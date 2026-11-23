# Changelog

All notable structural changes to `arborae.github.io` are documented in this file.

## [2026-11-23] — PolyForm License Detection Fallback

### Changed
- `scripts/update_tools.py`: when GitHub reports a repository license as `NOASSERTION` (such as PolyForm licenses), fetch `/repos/<org>/<repo>/license` and match known license headers (`PolyForm-Noncommercial-1.0.0`, etc.) so the license badge renders accurately in `assets/tools.json`.
- `assets/tools.json`: updated with resolved `PolyForm-Noncommercial-1.0.0` license for `aiuto-risiko`.

## [2026-11-22] — Automatic Web Tools Index

### Added
- `scripts/update_tools.py`: zero-dependency Python 3 stdlib indexer that queries the GitHub REST API for public `Arborae` repositories tagged with `arborae-page` or `arborae-pagina` and generates deterministic `assets/tools.json`.
- `.github/workflows/update-tools.yml`: scheduled (`0 3 * * *`), `workflow_dispatch`, and `repository_dispatch` (`tools-updated`) workflow that updates `assets/tools.json` when changed.
- `assets/tools.json`: initial tools index payload.
- `assets/tools.js`: modular client-side renderer building category filters, tool cards, empty state, and error handling strictly via DOM APIs (`createElement` / `textContent`) with URL validation and live language sync.

### Changed
- `index.html`: added `Tools` navigation link and `#tools` section (`#tools-filters`, `#tools-grid` with `aria-live="polite"`), loading `assets/tools.js` after `assets/i18n.js`.
- `assets/i18n.js`: added EN/IT translations for the Tools section, exposed `window.arboraeI18n` (`getLang()`, `t()`), and dispatched `arborae:langchange` in `setLang`.
- `style.css`: added design-system styles and responsive breakpoints for `.tools-filters`, `.filter-pill`, `.tools-grid`, `.tool-badges`, `.tool-meta`, and `.tools-empty`.
- `README.md`: documented the Tools section, auto-index workflow, and local script usage.
