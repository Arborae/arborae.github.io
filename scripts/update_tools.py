#!/usr/bin/env python3
"""Fetch public Arborae repositories tagged as web tools and build assets/tools.json."""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.error
import urllib.request

INDEX_TOPICS = ("arborae-page", "arborae-pagina")
EXCLUDED_REPOS = {".github", "arborae.github.io"}
API_BASE = "https://api.github.com"
NEXT_LINK_RE = re.compile(r'<([^>]+)>\s*;\s*rel=["\']next["\']')


def parse_next_link(link_header: str | None) -> str | None:
    """Extract the 'next' pagination URL from a GitHub Link header."""
    if not link_header:
        return None
    match = NEXT_LINK_RE.search(link_header)
    return match.group(1) if match else None


def format_title(name: str) -> str:
    """Turn a repository slug into a clean human-readable title."""
    parts = [part for part in re.split(r"[-_\s]+", name.strip()) if part]
    if not parts:
        return name
    formatted = [
        part if part.isupper() else part[:1].upper() + part[1:]
        for part in parts
    ]
    return " ".join(formatted)


def resolve_url(repo: dict, org: str) -> str:
    """Pick the best public URL: explicit homepage, GitHub Pages, or repository URL."""
    homepage = (repo.get("homepage") or "").strip()
    if homepage.startswith("https://") or homepage.startswith("http://"):
        return homepage
    if repo.get("has_pages"):
        return f"https://{org.lower()}.github.io/{repo['name']}/"
    return repo.get("html_url", "")


def is_eligible_repo(repo: dict) -> bool:
    """Return True when a repository should appear in the Tools index."""
    if (
        repo.get("private")
        or repo.get("archived")
        or repo.get("disabled")
        or repo.get("is_template")
    ):
        return False

    name = repo.get("name", "")
    if not name or name in EXCLUDED_REPOS:
        return False

    topics = repo.get("topics") or []
    return any(topic in INDEX_TOPICS for topic in topics)


def extract_tool(repo: dict, org: str) -> dict:
    """Map a GitHub repository payload into the normalized tool entry schema."""
    topics = [
        topic.strip()
        for topic in (repo.get("topics") or [])
        if isinstance(topic, str) and topic.strip()
    ]
    categories = sorted({topic for topic in topics if topic not in INDEX_TOPICS})

    license_info = repo.get("license")
    spdx = license_info.get("spdx_id") if isinstance(license_info, dict) else None
    license_id = spdx if spdx and spdx != "NOASSERTION" else None

    pushed_at = repo.get("pushed_at")
    updated_at = (
        pushed_at[:10]
        if isinstance(pushed_at, str) and len(pushed_at) >= 10
        else None
    )

    name = repo["name"]
    return {
        "name": name,
        "title": format_title(name),
        "description": (repo.get("description") or "").strip(),
        "url": resolve_url(repo, org),
        "repo": repo.get("html_url", ""),
        "categories": categories,
        "license": license_id,
        "updated_at": updated_at,
    }


def build_tools_payload(repos: list[dict], org: str = "Arborae") -> dict:
    """Filter, transform, and deterministically sort tool entries."""
    tools = [extract_tool(repo, org) for repo in repos if is_eligible_repo(repo)]
    tools.sort(key=lambda item: (item["name"].lower(), item["name"]))
    return {
        "topics": list(INDEX_TOPICS),
        "tools": tools,
    }


def fetch_repos(org: str, token: str | None = None) -> list[dict]:
    """Fetch all public repositories for an organization via GitHub REST API."""
    url: str | None = f"{API_BASE}/orgs/{org}/repos?type=public&per_page=100"
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "arborae-tools-indexer",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"

    repos: list[dict] = []
    while url:
        request = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(request, timeout=20) as response:
            data = json.loads(response.read().decode("utf-8"))
            if not isinstance(data, list):
                raise ValueError("Unexpected GitHub API response format")
            repos.extend(data)
            url = parse_next_link(response.headers.get("Link"))
    return repos


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    """Parse CLI arguments."""
    parser = argparse.ArgumentParser(
        description="Update the Arborae web tools index from GitHub public repositories."
    )
    parser.add_argument(
        "--org",
        default="Arborae",
        help="GitHub organization name (default: Arborae)",
    )
    parser.add_argument(
        "--output",
        default="assets/tools.json",
        help="Output JSON path (default: assets/tools.json)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print generated JSON to stdout without writing the output file",
    )
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    """Run CLI entrypoint."""
    args = parse_args(argv)
    token = os.environ.get("GITHUB_TOKEN", "").strip() or None

    try:
        repos = fetch_repos(args.org, token=token)
    except (urllib.error.HTTPError, urllib.error.URLError, ValueError, json.JSONDecodeError) as exc:
        print(f"Error fetching repositories for {args.org}: {exc}", file=sys.stderr)
        return 1

    payload = build_tools_payload(repos, org=args.org)
    rendered = json.dumps(payload, indent=2, ensure_ascii=False) + "\n"

    if args.dry_run:
        sys.stdout.write(rendered)
        return 0

    parent = os.path.dirname(args.output)
    if parent:
        os.makedirs(parent, exist_ok=True)
    with open(args.output, "w", encoding="utf-8") as handle:
        handle.write(rendered)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
