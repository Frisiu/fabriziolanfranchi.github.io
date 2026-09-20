/* ==========================================================================
   FABRIZIO LANFRANCHI — SCI DI FONDO
   Interazioni: nav, lingua IT/DE, galleria + lightbox, statistiche, fallback immagini
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------
     1. NAVBAR — sfondo su scroll, menu mobile, voce attiva
     ------------------------------------------------------------------ */
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelectorAll('.nav-links a');

  const onScroll = () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 60);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  hamburger.addEventListener('click', () => {
    const open = navbar.classList.toggle('menu-open');
    hamburger.classList.toggle('is-open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('menu-open');
      hamburger.classList.remove('is-open');
    });
  });

  const sections = document.querySelectorAll('section[id]');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navLinks.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === `#${id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => spy.observe(s));

  /* ------------------------------------------------------------------
     2. FALLBACK IMMAGINI MANCANTI
     Finché le foto reali non sono in assets/img/, mostriamo un
     placeholder elegante invece dell'icona di immagine rotta.
     ------------------------------------------------------------------ */
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      if (img.classList.contains('hero-bg')) {
        img.closest('.hero')?.classList.add('no-img');
      } else {
        img.closest('.about-image, .gallery-item')?.classList.add('no-img');
      }
    }, { once: true });
    // Se l'immagine è già in errore prima che lo script parta
    if (img.complete && img.naturalWidth === 0) {
      img.dispatchEvent(new Event('error'));
    }
  });

  /* ------------------------------------------------------------------
     3. REVEAL ON SCROLL — un'unica animazione misurata per blocco
     ------------------------------------------------------------------ */
  const revealTargets = document.querySelectorAll(
    '.about-grid, .stats-grid, .results-table-wrapper, .goals-box, .equipment-grid, .gallery-grid, .sponsors-grid, .contact-grid'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealTargets.forEach(el => revealObserver.observe(el));

  /* ------------------------------------------------------------------
     4. CONTATORI STATISTICHE — partono quando entrano in vista
     ------------------------------------------------------------------ */
  const statNumbers = document.querySelectorAll('.stat-number');
  const animateCount = (el) => {
    const raw = el.textContent.trim();
    const match = raw.match(/^([^\d]*)(\d+)(.*)$/);
    if (!match) return;
    const [, prefix, digits, suffix] = match;
    const target = parseInt(digits, 10);
    const duration = 900;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = `${prefix}${Math.round(target * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  statNumbers.forEach(el => statObserver.observe(el));

  /* ------------------------------------------------------------------
     5. GALLERIA — filtri
     ------------------------------------------------------------------ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('is-hidden', !match);
      });
    });
  });

  /* ------------------------------------------------------------------
     6. LIGHTBOX
     ------------------------------------------------------------------ */
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox.querySelector('img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const lightboxPrev = lightbox.querySelector('.lightbox-prev');
  const lightboxNext = lightbox.querySelector('.lightbox-next');
  let currentIndex = 0;

  const visibleItems = () => Array.from(galleryItems).filter(i => !i.classList.contains('is-hidden'));

  const openLightbox = (index) => {
    const items = visibleItems();
    if (!items.length) return;
    currentIndex = (index + items.length) % items.length;
    const item = items[currentIndex];
    const img = item.querySelector('img');
    const caption = item.querySelector('.gallery-overlay')?.textContent || '';
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.dataset.caption = caption;
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(visibleItems().indexOf(item)));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  lightboxPrev.addEventListener('click', () => openLightbox(currentIndex - 1));
  lightboxNext.addEventListener('click', () => openLightbox(currentIndex + 1));

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') openLightbox(currentIndex - 1);
    if (e.key === 'ArrowRight') openLightbox(currentIndex + 1);
  });

  /* ------------------------------------------------------------------
     7. CAMBIO LINGUA — IT / DE
     ------------------------------------------------------------------ */
  const translations = {
    de: {
      'nav-about': 'Über mich', 'nav-results': 'Resultate', 'nav-calendar': 'Kalender', 'nav-equipment': 'Ausrüstung',
      'nav-gallery': 'Galerie', 'nav-sponsors': 'Partner', 'nav-contact': 'Kontakt',
      'hero-tagline': 'Langlauf • Mein Weg',
      'hero-subtitle': 'Von der Eishockeybahn zur Loipe. Auf dem Weg zum EYOF 2027.',
      'hero-cta-results': 'Meine Resultate', 'hero-cta-contact': 'Kontaktiere mich',
      'about-title': 'Mein Werdegang', 'about-subtitle': 'Von Poschiavo ins Engadin, vom Schläger zu den Skiern',
      'about-heading': 'Eine Geschichte der Veränderung',
      'about-p1': 'Nach der obligatorischen Schule mit Vorlehrjahr in Poschiavo beende ich 2024 meine Zeit im Eishockey und suche neue Horizonte. Ich nähere mich dem Langlauf an und trainiere fortan regelmässig bei der Rösa.',
      'about-p2': 'Mit Studienbeginn an der Academia Engiadina in Samedan trete ich dem Team Engadin Nordic bei. Schon im ersten Sommer zeige ich mein Potenzial und verbessere im ersten Winter rasch meine Technik.',
      'about-p3': 'In der zweiten Saison wachse ich weiter und beginne, stabil an nationalen Rennen teilzunehmen, mit einem Top-10-Resultat. Jetzt gehe ich die dritte Saison mit ehrgeizigen Zielen an.',
      'timeline-2024-text': 'Ende Eishockey, Start Langlauf bei der Rösa',
      'timeline-2024b-text': 'Eintritt ins Team Engadin Nordic',
      'timeline-2025-text': 'Technische Fortschritte, erste nationale Rennen',
      'timeline-2026-text': '8. Platz Sprint Langis, konstant in Top 15/20',
      'timeline-2027-text': 'Qualifikation Europäisches Olympisches Jugendfestival',
      'stats-title': 'Zahlen der Saison 2025/26',
      'stats-hours': 'Trainingsstunden', 'stats-km': 'Renn-Kilometer',
      'stats-top10': 'Nationale Top 10', 'stats-top15': 'Top-15-Platzierungen',
      'results-title': 'Resultate 2025/26', 'results-subtitle': 'Eine Saison der Bestätigung und des Wachstums',
      'results-race': 'Rennen', 'results-position': 'Platz', 'results-category': 'Kategorie', 'results-technique': 'Technik',
      'results-technique-skating': 'Skating', 'results-technique-classic': 'Klassisch',
      'results-fis-link': 'FIS-Profil →',
      'calendar-title': 'Rennkalender 2026/27',
      'calendar-subtitle': 'Auf ein Rennen klicken, um die Details zu sehen',
      'results-goal-title': 'Ziele Saison 2026/27',
      'results-goal-1': 'Konstanz in den nationalen Top 10 U18 halten',
      'results-goal-2': 'Qualifikation für die FESA Games',
      'results-goal-3': 'Qualifikation für das EYOF (Europäisches Olympisches Jugendfestival)',
      'results-goal-4': 'Aufnahme in den Nationalkader C',
      'results-goal-5': 'Verbesserung der anaeroben Schwelle und Technik',
      'results-goal-6': 'Erhöhung des Trainingsumfangs auf 640 Stunden',
      'equipment-title': 'Meine Ausrüstung', 'equipment-subtitle': 'Die Marken, mit denen ich trainiere und antrete',
      'equipment-skis': 'Ski', 'equipment-boots': 'Schuhe', 'equipment-poles': 'Stöcke',
      'equipment-glasses': 'Brille', 'equipment-gloves': 'Handschuhe',
      'gallery-title': 'Galerie', 'gallery-subtitle': 'Momente von Rennen, Training und Podesten',
      'filter-all': 'Alle', 'filter-race': 'Rennen', 'filter-training': 'Training', 'filter-podium': 'Podeste',
      'sponsors-title': 'Meine Partner', 'sponsors-subtitle': 'Wer meinen Weg unterstützt',
      'sponsor-punto-desc': 'Küchen und hochwertige Einrichtungen in Campascio',
      'sponsor-gervasi-desc': 'Schreinerei und Fensterbau in Poschiavo',
      'sponsor-cortesi-desc': 'Professionelle Böden und Verkleidungen',
      'sponsors-note': 'Punto Cucina, Gervasi SA und Cortesi Pavimenti unterstützen meinen Weg',
      'contact-title': 'Kontaktiere mich', 'contact-subtitle': 'Für Sponsoring, Zusammenarbeit oder einfach zum Mitfiebern',
      'contact-email': 'E-Mail', 'contact-phone': 'Telefon',
      'footer-text': '© 2025 Fabrizio Lanfranchi. Alle Rechte vorbehalten.',
      'footer-privacy': 'Datenschutz: Diese Website sammelt keine persönlichen Daten und verwendet keine Tracking-Cookies.',
    },
    it: {} // ripristinato dai testi originali salvati in dataset.originalText
  };

  const translatableEls = document.querySelectorAll('[data-translate]');
  translatableEls.forEach(el => { el.dataset.originalText = el.innerHTML; });

  const langBtns = document.querySelectorAll('.lang-btn');
  const setLanguage = (lang) => {
    document.documentElement.lang = lang;
    langBtns.forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
    translatableEls.forEach(el => {
      const key = el.dataset.translate;
      const hasTranslation = lang !== 'it' && Object.prototype.hasOwnProperty.call(translations.de, key);
      if (hasTranslation) {
        el.textContent = translations.de[key];
      } else {
        el.innerHTML = el.dataset.originalText;
      }
    });
    try { localStorage.setItem('fl-lang', lang); } catch (e) {}
  };

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });

  let savedLang = 'it';
  try { savedLang = localStorage.getItem('fl-lang') || 'it'; } catch (e) {}
  if (savedLang === 'de') setLanguage('de');

  /* ------------------------------------------------------------------
     8. ANNO FOOTER AUTOMATICO
     ------------------------------------------------------------------ */
  const footerText = document.querySelector('[data-translate="footer-text"]');
  if (footerText) {
    const year = new Date().getFullYear();
    footerText.dataset.originalText = footerText.dataset.originalText.replace(/\d{4}/, year);
    if (document.documentElement.lang === 'it') footerText.innerHTML = footerText.dataset.originalText;
  }
});
