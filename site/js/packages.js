(function () {
  'use strict';

  var state = {
    activeDomain: 'all',
    domains: [],
    packages: [],
    query: ''
  };

  var mounts = {};

  function getText(value) {
    return typeof value === 'string' ? value : '';
  }

  function getDomainKey(pkg) {
    return getText(pkg.domain || pkg.domainKey);
  }

  function getDomainLabel(key) {
    var match = state.domains.find(function (domain) {
      return domain.key === key || domain.id === key || domain.slug === key;
    });

    return match ? getText(match.label || match.name || match.key || match.id || match.slug) : key;
  }

  function getDomainId(domain) {
    return getText(domain.key || domain.id || domain.slug);
  }

  function normalize(value) {
    return getText(value).toLocaleLowerCase();
  }

  function matchesDomain(pkg) {
    return state.activeDomain === 'all' || getDomainKey(pkg) === state.activeDomain;
  }

  function matchesSearch(pkg) {
    if (!state.query) {
      return true;
    }

    var haystack = [
      getText(pkg.name),
      getText(pkg.purpose),
      getDomainLabel(getDomainKey(pkg))
    ].join(' ');

    return normalize(haystack).indexOf(state.query) !== -1;
  }

  function getFilteredPackages() {
    return state.packages.filter(function (pkg) {
      return matchesDomain(pkg) && matchesSearch(pkg);
    });
  }

  function getDomainCount(domainId) {
    if (domainId === 'all') {
      return state.packages.length;
    }

    return state.packages.filter(function (pkg) {
      return getDomainKey(pkg) === domainId;
    }).length;
  }

  function clearNode(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  function createChip(domainId, label) {
    var button = document.createElement('button');
    var count = getDomainCount(domainId);

    button.className = 'chip-btn';
    button.type = 'button';
    button.dataset.domain = domainId;
    button.setAttribute('aria-pressed', String(state.activeDomain === domainId));
    button.textContent = label + ' ' + count;
    button.addEventListener('click', function () {
      state.activeDomain = domainId;
      render();
    });

    return button;
  }

  function createPill(className, text) {
    var pill = document.createElement('span');
    pill.className = className;
    pill.textContent = text;
    return pill;
  }

  function createCard(pkg) {
    var article = document.createElement('article');
    var heading = document.createElement('h3');
    var meta = document.createElement('div');
    var purpose = document.createElement('p');
    var repo = getText(pkg.repo);
    var domainId = getDomainKey(pkg);

    article.className = 'pkg-card';
    article.dataset.domain = domainId;

    heading.textContent = getText(pkg.name);
    article.appendChild(heading);

    meta.className = 'pkg-card__meta';
    meta.appendChild(createPill('pkg-card__kind', getText(pkg.kind || 'Package')));
    meta.appendChild(createPill('pkg-card__domain pkg-card__domain--' + domainId, getDomainLabel(domainId)));
    article.appendChild(meta);

    purpose.className = 'pkg-card__purpose';
    purpose.textContent = getText(pkg.purpose);
    article.appendChild(purpose);

    if (repo) {
      var link = document.createElement('a');
      link.className = 'pkg-card__source';
      link.href = repo;
      link.rel = 'noopener';
      link.target = '_blank';
      link.textContent = 'Source';
      article.appendChild(link);
    }

    return article;
  }

  function renderChips() {
    clearNode(mounts.filters);
    mounts.filters.appendChild(createChip('all', 'All'));

    state.domains.forEach(function (domain) {
      var domainId = getDomainId(domain);
      var label = getText(domain.label || domain.name || domainId);

      if (domainId) {
        mounts.filters.appendChild(createChip(domainId, label));
      }
    });
  }

  function renderCards(filtered) {
    clearNode(mounts.grid);

    filtered.forEach(function (pkg) {
      mounts.grid.appendChild(createCard(pkg));
    });
  }

  function updateCount(filtered) {
    mounts.count.textContent = filtered.length + ' of ' + state.packages.length + ' packages';
  }

  function render() {
    var filtered = getFilteredPackages();

    renderChips();
    renderCards(filtered);
    updateCount(filtered);
    mounts.empty.hidden = filtered.length !== 0;
    mounts.error.hidden = true;
  }

  function showError(error) {
    console.error('Package catalog failed to load', error);
    clearNode(mounts.grid);
    clearNode(mounts.filters);
    mounts.count.textContent = 'Packages unavailable';
    mounts.empty.hidden = true;
    mounts.error.hidden = false;
  }

  function validateData(data) {
    if (!data || !Array.isArray(data.packages) || !Array.isArray(data.domains)) {
      throw new Error('Invalid packages data');
    }

    return data;
  }

  function loadPackages() {
    fetch('data/packages.json', { cache: 'no-cache' })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Package data request failed with status ' + response.status);
        }

        return response.json();
      })
      .then(validateData)
      .then(function (data) {
        state.packages = data.packages;
        state.domains = data.domains;
        render();
      })
      .catch(showError);
  }

  function bindMounts() {
    mounts.filters = document.getElementById('catalog-filters');
    mounts.search = document.getElementById('catalog-search');
    mounts.count = document.getElementById('catalog-count');
    mounts.grid = document.getElementById('catalog-grid');
    mounts.empty = document.getElementById('catalog-empty');
    mounts.error = document.getElementById('catalog-error');

    if (!mounts.filters || !mounts.search || !mounts.count || !mounts.grid || !mounts.empty || !mounts.error) {
      throw new Error('Package catalog mounts are missing');
    }
  }

  function init() {
    try {
      bindMounts();
      mounts.search.addEventListener('input', function (event) {
        state.query = normalize(event.target.value);
        render();
      });
      loadPackages();
    } catch (error) {
      if (mounts.grid && mounts.filters && mounts.count && mounts.empty && mounts.error) {
        showError(error);
      } else {
        console.error('Package catalog failed to initialize', error);
      }
    }
  }

  document.addEventListener('DOMContentLoaded', init);
}());
