(function () {
  'use strict';

  var ACTIVE_KEYS = {
    home: true,
    'getting-started': true,
    architecture: true,
    packages: true,
    about: true
  };
  var mq = null;

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function inferNavKey() {
    var override = document.body && document.body.getAttribute('data-nav');
    var file = window.location.pathname.split('/').pop() || 'index.html';
    var key = file.replace(/\.html?$/i, '') || 'index';

    if (override && ACTIVE_KEYS[override]) {
      return override;
    }

    if (key === 'index') {
      return 'home';
    }

    return ACTIVE_KEYS[key] ? key : '';
  }

  function setActiveNav() {
    var key = inferNavKey();
    var links = document.querySelectorAll('[data-nav]');
    var i;

    for (i = 0; i < links.length; i += 1) {
      if (links[i].getAttribute('data-nav') === key) {
        links[i].classList.add('is-active');
        links[i].setAttribute('aria-current', 'page');
      } else {
        links[i].classList.remove('is-active');
        links[i].removeAttribute('aria-current');
      }
    }
  }

  function closeMenu(toggle, nav, focusToggle) {
    toggle.classList.remove('is-open');
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    if (focusToggle) {
      toggle.focus();
    }
  }

  function wireToggle() {
    var toggle = document.querySelector('.site-nav-toggle');
    var nav = document.getElementById('site-nav');

    if (!toggle || !nav) {
      return;
    }

    toggle.addEventListener('click', function () {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';

      if (isOpen) {
        closeMenu(toggle, nav, false);
      } else {
        toggle.classList.add('is-open');
        nav.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Close navigation');
      }
    });

    nav.addEventListener('click', function (event) {
      if (event.target && event.target.tagName === 'A') {
        closeMenu(toggle, nav, false);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeMenu(toggle, nav, true);
      }
    });

    if (window.matchMedia) {
      mq = window.matchMedia('(min-width: 768px)');
      var onChange = function () {
        if (mq.matches) {
          closeMenu(toggle, nav, false);
        }
      };

      if (mq.addEventListener) {
        mq.addEventListener('change', onChange);
      } else if (mq.addListener) {
        mq.addListener(onChange);
      }
    }
  }

  function wireScrollState() {
    var header = document.querySelector('.site-header');

    if (!header) {
      return;
    }

    var update = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  function stampYear() {
    var nodes = document.querySelectorAll('[data-year]');
    var year = String(new Date().getFullYear());
    var i;

    for (i = 0; i < nodes.length; i += 1) {
      nodes[i].textContent = year;
    }
  }

  ready(function () {
    setActiveNav();
    wireToggle();
    wireScrollState();
    stampYear();
  });
}());
