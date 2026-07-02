(function () {
  'use strict';

  var KEY = 'fkst-theme';
  var DARK = 'dark';
  var LIGHT = 'light';
  var QUERY = '(prefers-color-scheme: dark)';
  var hasExplicitChoice = false;

  function storageGet() {
    try {
      return window.localStorage.getItem(KEY);
    } catch (error) {
      return null;
    }
  }

  function storageSet(theme) {
    try {
      window.localStorage.setItem(KEY, theme);
    } catch (error) {
      return;
    }
  }

  function normalize(theme) {
    return theme === LIGHT ? LIGHT : DARK;
  }

  function current() {
    return normalize(document.documentElement.getAttribute('data-theme'));
  }

  function syncButton() {
    var button = document.getElementById('theme-toggle');

    if (!button) {
      return;
    }

    var isLight = current() === LIGHT;
    var label = isLight ? 'Switch to dark theme' : 'Switch to light theme';

    button.setAttribute('aria-pressed', isLight ? 'true' : 'false');
    button.setAttribute('aria-label', label);
    button.setAttribute('title', label);
  }

  function apply(theme, persist) {
    var normalized = normalize(theme);

    document.documentElement.setAttribute('data-theme', normalized);

    if (persist) {
      storageSet(normalized);
    }

    syncButton();
  }

  function preferredTheme() {
    if (window.matchMedia && window.matchMedia(QUERY).matches) {
      return DARK;
    }

    return LIGHT;
  }

  function applyStoredOrPreferred() {
    var stored = storageGet();

    hasExplicitChoice = stored === LIGHT || stored === DARK;
    apply(stored === LIGHT || stored === DARK ? stored : preferredTheme(), false);
  }

  function handleClick(event) {
    var target = event.target;
    var button = target && target.closest ? target.closest('#theme-toggle') : null;

    if (!button) {
      return;
    }

    hasExplicitChoice = true;
    apply(current() === LIGHT ? DARK : LIGHT, true);
  }

  function handlePreferenceChange() {
    if (!hasExplicitChoice && storageGet() === null) {
      apply(preferredTheme(), false);
    }
  }

  function watchPreference() {
    if (!window.matchMedia) {
      return;
    }

    var media = window.matchMedia(QUERY);

    if (media.addEventListener) {
      media.addEventListener('change', handlePreferenceChange);
      return;
    }

    if (media.addListener) {
      media.addListener(handlePreferenceChange);
    }
  }

  applyStoredOrPreferred();
  document.addEventListener('click', handleClick);
  document.addEventListener('layout:ready', syncButton);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncButton);
  } else {
    syncButton();
  }

  watchPreference();
})();
