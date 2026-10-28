/* i18n EN/IT + boot (lang switch, reveal, anno) — zero build step
   L'HTML è in inglese: questo file lo traduce in italiano se il visitatore lo sceglie
   (o se il browser è in italiano) e ricorda la scelta. */
(function () {
  const I18N = {
    en: {
      'nav.projects': 'Projects',
      'nav.principles': 'Principles',
      'hero.title': '<span class="accent-text">Clean</span>, modular,<br>reliable software.',
      'hero.lead': 'We build useful projects that are a pleasure to use and easy to maintain — with a healthy obsession for clear UX, smart automation and simple DevOps.',
      'hero.explore': 'Explore the projects',
      'projects.label': '// projects',
      'projects.title': 'Featured projects',
      'projects.lead': 'Our main repositories, built for real-world use and easy maintenance.',
      'd2ha.desc': 'Integrate and control Docker containers inside Home Assistant: automatic discovery, sensors, actions, updates and monitoring — with a modern web UI and MQTT autodiscovery.',
      'appliance.badge': 'In development',
      'appliance.desc': 'A modular appliance/stack that makes deploys, setup wizards, an App Store and container management user‑friendly.',
      'contrib.title': 'Contributing',
      'contrib.desc': 'Small, focused PRs, up-to-date docs, quick reviews. If something is confusing, to us it’s a bug.',
      'security.title': 'Security',
      'security.desc': 'Responsible disclosure and a shared policy for every repository in the organization.',
      'security.short': 'Responsible disclosure and a shared policy.',
      'policy.read': 'Read the policy',
      'principles.label': '// principles',
      'principles.title': 'Principles',
      'principles.lead': 'Simple rules that keep projects clean over time.',
      'p1.title': 'Documentation first',
      'p1.desc': 'If it isn’t explained well, it isn’t done.',
      'p2.title': 'Modularity & maintainability',
      'p2.desc': 'We prefer clear architecture to “quick hacks”.',
      'p3.title': 'Clear UX',
      'p3.desc': 'If something is confusing, it’s a bug. Period.',
      'p4.title': 'Security & transparency',
      'p4.desc': 'Clear policies and processes, responsible disclosure.',
      'founders.title': 'Who’s behind it',
      'founders.lead': 'Two friends who share a passion for well-made software.',
      'founders.alt.giovanni': 'Giovanni’s avatar',
      'founders.alt.baldo': 'Baldo’s avatar',
      'community.lead': 'Questions, ideas, bugs and PRs: everything in its right place.',
      'discussions.desc': 'Ideas, roadmap, questions and general support.',
      'discussions.open': 'Open Discussions',
      'issues.desc': 'Bug reports and feature requests with guided templates.',
      'issues.pick': 'Pick a repo',
      'cta.title': 'Want to help out?',
      'cta.desc': 'Even a small PR is welcome. If you like, start from a “good first issue”.',
      'cta.explore': 'Explore the repos',
      '_meta.desc': 'Arborae — clean, modular and reliable software. Polished UIs, smart automation and simple DevOps.'
    },
    it: {
      'nav.projects': 'Progetti',
      'nav.principles': 'Principi',
      'hero.title': 'Software <span class="accent-text">pulito</span>,<br>modulare e affidabile.',
      'hero.lead': 'Costruiamo progetti utili, belli da usare e facili da mantenere — con un’ossessione sana per UX chiare, automazioni intelligenti e DevOps semplici.',
      'hero.explore': 'Esplora i progetti',
      'projects.label': '// progetti',
      'projects.title': 'Progetti in evidenza',
      'projects.lead': 'Repository principali, con obiettivo utilità reale e manutenzione semplice.',
      'd2ha.desc': 'Integrazione e controllo dei container Docker dentro Home Assistant: discovery automatica, sensori, azioni, update e monitoraggio — con una web UI moderna e MQTT autodiscovery.',
      'appliance.badge': 'In sviluppo',
      'appliance.desc': 'Appliance/stack modulare per semplificare deploy, wizard, App Store e gestione container in modo user‑friendly.',
      'contrib.title': 'Contribuire',
      'contrib.desc': 'PR piccole e mirate, documentazione aggiornata, review rapide. Se qualcosa confonde, per noi è un bug.',
      'security.title': 'Sicurezza',
      'security.desc': 'Segnalazioni responsabili e policy comune per tutti i repository dell’organizzazione.',
      'security.short': 'Segnalazioni responsabili e policy comune.',
      'policy.read': 'Leggi policy',
      'principles.label': '// principi',
      'principles.title': 'Principi',
      'principles.lead': 'Regole semplici che tengono i progetti puliti nel tempo.',
      'p1.title': 'Documentazione prima di tutto',
      'p1.desc': 'Se non è spiegato bene, non è finito.',
      'p2.title': 'Modularità & manutenzione',
      'p2.desc': 'Preferiamo architetture chiare a “hack veloci”.',
      'p3.title': 'UX chiara',
      'p3.desc': 'Se qualcosa confonde, è un bug. Punto.',
      'p4.title': 'Sicurezza & trasparenza',
      'p4.desc': 'Policy e processi chiari, disclosure responsabile.',
      'founders.title': 'Chi c’è dietro',
      'founders.lead': 'Due amici, una passione per il software fatto bene.',
      'founders.alt.giovanni': 'Avatar di Giovanni',
      'founders.alt.baldo': 'Avatar di Baldo',
      'community.lead': 'Domande, idee, bug e PR: tutto al posto giusto.',
      'discussions.desc': 'Idee, roadmap, domande e supporto generale.',
      'discussions.open': 'Apri Discussions',
      'issues.desc': 'Bug e feature request con template guidati.',
      'issues.pick': 'Scegli repo',
      'cta.title': 'Vuoi dare una mano?',
      'cta.desc': 'Anche una PR piccola è benvenuta. Se vuoi, parti da una issue “good first issue”.',
      'cta.explore': 'Esplora i repo',
      '_meta.desc': 'Arborae — software pulito, modulare e affidabile. UI curate, automazioni intelligenti e DevOps semplici.'
    }
  };

  function setLang(lang, remember) {
    const dict = I18N[lang] || I18N.en;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (!(key in dict)) return;
      if (el.hasAttribute('data-i18n-html')) el.innerHTML = dict[key];
      else el.textContent = dict[key];
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(el => {
      const key = el.getAttribute('data-i18n-alt');
      if (key in dict) el.setAttribute('alt', dict[key]);
    });
    const md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute('content', dict['_meta.desc']);
    ['it', 'en'].forEach(l => {
      const b = document.getElementById('lang-' + l);
      if (!b) return;
      b.classList.toggle('active', l === lang);
      b.setAttribute('aria-pressed', String(l === lang));
    });
    if (remember) {
      try { localStorage.setItem('lang', lang); } catch (e) { }
    }
  }

  ['it', 'en'].forEach(l => {
    const b = document.getElementById('lang-' + l);
    if (b) b.addEventListener('click', () => setLang(l, true));
  });

  // Prima la scelta salvata, poi la lingua principale del browser; altrimenti inglese.
  let saved = null;
  try { saved = localStorage.getItem('lang'); } catch (e) { }
  const browser = ((navigator.languages && navigator.languages[0]) || navigator.language || '').toLowerCase();
  const initial = saved === 'it' || saved === 'en' ? saved : browser.startsWith('it') ? 'it' : 'en';
  if (initial !== 'en') setLang(initial, false);

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('visible'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => io.observe(el));
  }
})();
