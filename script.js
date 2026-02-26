(function () {
  const storageKey = 'roshan-editzz-theme';
  const toggle = document.querySelector('.theme-toggle');
  const navBar = document.querySelector('.nav-bar');
  const navToggle = document.querySelector('.nav-toggle');
  const searchWrap = document.querySelector('.sidebar-search');
  const postsFeed = document.getElementById('postsFeed');

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : '');
    localStorage.setItem(storageKey, theme);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderPosts(posts) {
    if (!postsFeed) return;
    if (!posts || !posts.length) {
      postsFeed.innerHTML = '<p class="feed-empty">No posts yet.</p>';
      return;
    }

    postsFeed.innerHTML = posts.map(function (post) {
      var title = escapeHtml(post.title || 'Untitled');
      var description = escapeHtml(post.description || '');
      var imageUrl = escapeHtml(post.imageUrl || '');
      var link = '/post.html?id=' + encodeURIComponent(post.id || '');
      return '' +
        '<article class="read-card">' +
          '<div class="read-card-image-wrap">' +
            '<img src="' + imageUrl + '" alt="' + title + '">' +
          '</div>' +
          '<div class="read-card-body">' +
            '<h2>' + title + '</h2>' +
            '<p>' + description + '</p>' +
            '<a class="read-card-btn" href="' + link + '">Continue Reading <span aria-hidden="true">&#10140;</span></a>' +
          '</div>' +
        '</article>';
    }).join('');
  }

  function loadPosts() {
    if (!postsFeed) return;
    var page = document.body.getAttribute('data-posts-page') || 'home';
    var endpoint = page === 'home'
      ? '/api/posts'
      : '/api/posts?page=' + encodeURIComponent(page);
    fetch(endpoint)
      .then(function (res) { return res.json(); })
      .then(function (data) { renderPosts(data.posts || []); })
      .catch(function () {
        postsFeed.innerHTML = '<p class="feed-empty">Could not load posts.</p>';
      });
  }

  function initSearch() {
    if (!searchWrap) return;
    var input = searchWrap.querySelector('input');
    var button = searchWrap.querySelector('button');
    if (!input || !button) return;

    function runSearch() {
      var value = input.value.trim();
      if (!value) return;
      if (value.toLowerCase() === '/admin') {
        window.location.href = '/admin';
      }
    }

    button.addEventListener('click', runSearch);
    input.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        runSearch();
      }
    });
  }

  function init() {
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    if (toggle) {
      toggle.addEventListener('click', function () {
        var current = document.documentElement.getAttribute('data-theme');
        setTheme(current === 'dark' ? 'light' : 'dark');
      });
    }

    if (navToggle && navBar) {
      navToggle.addEventListener('click', function () {
        var isOpen = navBar.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', isOpen);
        navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      });
      document.querySelectorAll('.nav-left a').forEach(function (link) {
        link.addEventListener('click', function () {
          navBar.classList.remove('is-open');
          navToggle.setAttribute('aria-expanded', 'false');
          navToggle.setAttribute('aria-label', 'Open menu');
        });
      });
    }

    initSearch();
    loadPosts();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
