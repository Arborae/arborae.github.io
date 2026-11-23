/* Dynamic Tools catalog — reads assets/tools.json with zero build step */
(function () {
  const FALLBACK_TEXT = {
    'tools.all': 'All',
    'tools.open': 'Open',
    'tools.repo': 'Repo',
    'tools.no_desc': 'No description provided.',
    'tools.empty.title': 'No web tools published yet',
    'tools.empty.desc': 'Every public Arborae repository tagged with the arborae-page topic will appear here automatically.',
    'tools.error': 'Unable to load the tools index right now.'
  };

  function t(key) {
    if (window.arboraeI18n && typeof window.arboraeI18n.t === 'function') {
      return window.arboraeI18n.t(key);
    }
    return FALLBACK_TEXT[key] || key;
  }

  function isSafeHttpUrl(value) {
    if (typeof value !== 'string') return false;
    const trimmed = value.trim();
    if (!/^https?:\/\//i.test(trimmed)) return false;
    try {
      const parsed = new URL(trimmed);
      return parsed.protocol === 'https:' || parsed.protocol === 'http:';
    } catch (e) {
      return false;
    }
  }

  const filtersEl = document.getElementById('tools-filters');
  const gridEl = document.getElementById('tools-grid');
  if (!gridEl) return;

  const state = {
    status: 'loading',
    tools: [],
    activeCategory: 'all'
  };

  function createActionLink(href, label, variantClass) {
    const link = document.createElement('a');
    link.className = 'btn ' + variantClass + ' small';
    link.setAttribute('href', href.trim());
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noreferrer noopener');
    link.textContent = label;
    return link;
  }

  function renderEmptyCard(badgeText, titleText, descText) {
    const card = document.createElement('article');
    card.className = 'card tools-empty';

    const top = document.createElement('div');
    top.className = 'card-top';

    if (badgeText) {
      const badge = document.createElement('div');
      badge.className = 'badge grey';
      badge.textContent = badgeText;
      top.appendChild(badge);
    }

    if (titleText) {
      const heading = document.createElement('h3');
      heading.textContent = titleText;
      top.appendChild(heading);
    }

    const desc = document.createElement('p');
    desc.textContent = descText;
    top.appendChild(desc);

    card.appendChild(top);
    return card;
  }

  function renderToolCard(tool) {
    const card = document.createElement('article');
    card.className = 'card';

    const top = document.createElement('div');
    top.className = 'card-top';

    const categories = Array.isArray(tool.categories)
      ? tool.categories.filter(cat => typeof cat === 'string' && cat.trim() !== '')
      : [];

    if (categories.length > 0) {
      const badges = document.createElement('div');
      badges.className = 'tool-badges';
      categories.forEach(cat => {
        const badge = document.createElement('span');
        badge.className = 'badge teal';
        badge.textContent = cat.trim();
        badges.appendChild(badge);
      });
      top.appendChild(badges);
    }

    const title = document.createElement('h3');
    title.textContent = (typeof tool.title === 'string' && tool.title.trim()) ||
      (typeof tool.name === 'string' && tool.name.trim()) ||
      'Untitled tool';
    top.appendChild(title);

    const desc = document.createElement('p');
    const description = typeof tool.description === 'string' ? tool.description.trim() : '';
    desc.textContent = description || t('tools.no_desc');
    top.appendChild(desc);

    card.appendChild(top);

    const hasOpen = isSafeHttpUrl(tool.url);
    const hasRepo = isSafeHttpUrl(tool.repo);
    const metaParts = [];
    if (typeof tool.license === 'string' && tool.license.trim()) {
      metaParts.push(tool.license.trim());
    }
    if (typeof tool.updated_at === 'string' && tool.updated_at.trim()) {
      metaParts.push(tool.updated_at.trim());
    }

    if (metaParts.length > 0 || hasOpen || hasRepo) {
      const bottom = document.createElement('div');
      bottom.className = 'tool-bottom';

      if (metaParts.length > 0) {
        const meta = document.createElement('p');
        meta.className = 'tool-meta mono';
        meta.textContent = metaParts.join(' · ');
        bottom.appendChild(meta);
      }

      if (hasOpen || hasRepo) {
        const actions = document.createElement('div');
        actions.className = 'card-actions';
        if (hasOpen) actions.appendChild(createActionLink(tool.url, t('tools.open'), 'primary'));
        if (hasRepo) actions.appendChild(createActionLink(tool.repo, t('tools.repo'), 'ghost'));
        bottom.appendChild(actions);
      }

      card.appendChild(bottom);
    }

    return card;
  }

  function renderFilters(categories) {
    if (!filtersEl) return;
    filtersEl.replaceChildren();

    if (categories.length === 0) {
      filtersEl.hidden = true;
      return;
    }

    filtersEl.hidden = false;

    const options = [{ key: 'all', label: t('tools.all') }].concat(
      categories.map(cat => ({ key: cat, label: cat }))
    );

    options.forEach(opt => {
      const btn = document.createElement('button');
      const isActive = state.activeCategory === opt.key;
      btn.type = 'button';
      btn.className = isActive ? 'filter-pill active' : 'filter-pill';
      btn.setAttribute('aria-pressed', String(isActive));
      btn.textContent = opt.label;
      btn.addEventListener('click', () => {
        if (state.activeCategory === opt.key) return;
        state.activeCategory = opt.key;
        render();
      });
      filtersEl.appendChild(btn);
    });
  }

  function render() {
    if (state.status === 'loading') return;

    if (state.status === 'error') {
      if (filtersEl) {
        filtersEl.replaceChildren();
        filtersEl.hidden = true;
      }
      gridEl.replaceChildren(renderEmptyCard(null, null, t('tools.error')));
      return;
    }

    const categories = Array.from(
      new Set(
        state.tools.flatMap(tool =>
          Array.isArray(tool.categories)
            ? tool.categories.filter(cat => typeof cat === 'string' && cat.trim() !== '').map(cat => cat.trim())
            : []
        )
      )
    ).sort((a, b) => a.localeCompare(b));

    if (state.activeCategory !== 'all' && !categories.includes(state.activeCategory)) {
      state.activeCategory = 'all';
    }

    renderFilters(categories);

    const visibleTools = state.activeCategory === 'all'
      ? state.tools
      : state.tools.filter(tool =>
          Array.isArray(tool.categories) &&
          tool.categories.some(cat => typeof cat === 'string' && cat.trim() === state.activeCategory)
        );

    if (visibleTools.length === 0) {
      gridEl.replaceChildren(
        renderEmptyCard('arborae-page', t('tools.empty.title'), t('tools.empty.desc'))
      );
      return;
    }

    const fragment = document.createDocumentFragment();
    visibleTools.forEach(tool => fragment.appendChild(renderToolCard(tool)));
    gridEl.replaceChildren(fragment);
  }

  window.addEventListener('arborae:langchange', render);

  fetch('assets/tools.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('HTTP ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      state.tools = data && Array.isArray(data.tools) ? data.tools : [];
      state.status = 'ready';
      render();
    })
    .catch(() => {
      state.status = 'error';
      render();
    });
})();
