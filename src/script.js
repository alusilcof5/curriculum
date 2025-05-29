class App {
  constructor() {
    this.translations = {};
    this.currentLanguage = localStorage.getItem('language') || 'es';
    if (!['es', 'en', 'fr'].includes(this.currentLanguage)) {
      this.currentLanguage = 'es';
    }
    this.init();
  }

  async init() {
    document.documentElement.lang = this.currentLanguage;
    this.setupLanguageSelector();
    this.loadTranslations();
    this.setupThemeToggle();
    this.setupSmoothScrolling();
    this.setupExternalLinks();
    this.setupObserver();
  }

  async loadTranslations() {
    try {
      const response = await fetch('./src/translations.json');
      this.translations = await response.json();
      this.translatePage(this.currentLanguage);
    } catch (error) {
      console.error('Error cargando las traducciones:', error);
    }
  }

  translatePage(language) {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
      const key = element.getAttribute('data-translate');
      if (this.translations[language]?.[key]) {
        element.textContent = this.translations[language][key];
      }
    });
    document.documentElement.lang = language;
  }

  setupLanguageSelector() {
    const selector = document.getElementById('language-select');
    if (!selector) return;

    selector.value = this.currentLanguage;
    selector.addEventListener('change', (e) => {
      this.currentLanguage = e.target.value;
      localStorage.setItem('language', this.currentLanguage);
      this.translatePage(this.currentLanguage);
    });
  }

  setupThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const body = document.body;

    if (!toggle) return;

    const icon = toggle.querySelector('i');
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    if (icon) icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

    toggle.addEventListener('click', () => {
      const currentTheme = body.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      body.setAttribute('data-theme', newTheme);
      if (icon) icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      localStorage.setItem('theme', newTheme);
    });
  }

  animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'), 10);
      const duration = 2000;
      let current = 0;
      const increment = target / (duration / 16);

      const timer = setInterval(() => {
        current += increment;
        counter.textContent = Math.floor(current);
        if (current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        }
      }, 16);
    });
  }

  setupObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          if (entry.target.querySelector('[data-count]')) {
            this.animateCounters();
          }
        }
      });
    }, options);

    document.querySelectorAll('.section').forEach(section => {
      observer.observe(section);
    });
  }

  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  setupExternalLinks() {
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
      link.addEventListener('click', function () {
        const originalText = this.innerHTML;
        this.innerHTML = '<span class="loading"></span> Abriendo...';
        setTimeout(() => {
          this.innerHTML = originalText;
        }, 2000);
      });
    });
  }
}

// Inicializa la aplicación al cargar el DOM
document.addEventListener('DOMContentLoaded', () => new App());

