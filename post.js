(function () {
  var detail = document.getElementById('postDetail');

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderContent(text) {
    var safe = escapeHtml(text || '');
    return safe.split(/\n{2,}/).map(function (p) {
      return '<p>' + p.replace(/\n/g, '<br>') + '</p>';
    }).join('');
  }

  function showError(message) {
    detail.innerHTML = '<p class="feed-empty">' + escapeHtml(message) + '</p>';
  }

  var params = new URLSearchParams(window.location.search);
  var id = params.get('id') || '';
  if (!id) {
    var parts = window.location.pathname.split('/').filter(Boolean);
    id = parts.length >= 2 && parts[0] === 'post' ? decodeURIComponent(parts[1]) : '';
  }
  if (!id) {
    showError('Post not found.');
    return;
  }

  fetch('/api/posts/' + encodeURIComponent(id))
    .then(function (res) {
      if (!res.ok) throw new Error('Post not found');
      return res.json();
    })
    .then(function (data) {
      var post = data.post || {};
      var title = escapeHtml(post.title || 'Untitled');
      var description = escapeHtml(post.description || '');
      var imageUrl = escapeHtml(post.imageUrl || '');
      var contentHtml = renderContent(post.content || post.description || '');
      var buttonText = escapeHtml(post.buttonText || 'Open Link');
      var buttonLink = escapeHtml(post.buttonLink || '');
      var buttonIconUrl = escapeHtml(post.buttonIconUrl || '');
      var popupImageUrl = escapeHtml(post.popupImageUrl || '');
      var copyText = escapeHtml((post.content || post.description || '').replace(/\r?\n/g, '\n'));
      var usePopup = (post.pageKey === 'reel' || post.pageKey === 'capcut') && popupImageUrl;
      var extraBtn = '';
      if (usePopup) {
        extraBtn =
          '<button type="button" class="read-card-btn post-popup-btn" data-popup-image="' + popupImageUrl + '">' +
            (buttonIconUrl ? '<img src="' + buttonIconUrl + '" alt="" class="post-btn-icon">' : '') +
            buttonText +
          '</button>';
      } else if (buttonLink) {
        extraBtn =
          '<a class="read-card-btn post-extra-btn" href="' + buttonLink + '" target="_blank" rel="noopener">' +
            (buttonIconUrl ? '<img src="' + buttonIconUrl + '" alt="" class="post-btn-icon">' : '') +
            buttonText +
          '</a>';
      }
      var copyBtn = post.pageKey === 'aiprompts'
        ? '<button type="button" class="read-card-btn post-copy-btn" data-copy-text="' + copyText + '">Copy Prompt</button>'
        : '';

      document.title = title + ' | Roshan Editzz';
      detail.innerHTML = '' +
        '<a class="read-card-btn" href="/home.html">Back to Home</a>' +
        '<h1>' + title + '</h1>' +
        '<p class="post-meta">' + description + '</p>' +
        '<div class="post-image-wrap"><img src="' + imageUrl + '" alt="' + title + '"></div>' +
        '<div class="post-content">' + contentHtml + '</div>' +
        '<div class="post-card-actions post-detail-actions">' +
          copyBtn +
          extraBtn +
        '</div>';

      var copyEl = detail.querySelector('.post-copy-btn');
      if (copyEl) {
        copyEl.addEventListener('click', function () {
          var text = copyEl.getAttribute('data-copy-text') || '';
          navigator.clipboard.writeText(text)
            .then(function () { copyEl.textContent = 'Copied'; })
            .catch(function () { copyEl.textContent = 'Copy Failed'; })
            .finally(function () {
              setTimeout(function () { copyEl.textContent = 'Copy Prompt'; }, 1200);
            });
        });
      }

      var popupBtn = detail.querySelector('.post-popup-btn');
      if (popupBtn) {
        popupBtn.addEventListener('click', function () {
          var imgUrl = popupBtn.getAttribute('data-popup-image');
          if (!imgUrl) return;
          var modal = document.createElement('div');
          modal.className = 'post-popup-modal';
          modal.innerHTML = ''
            + '<div class="post-popup-backdrop" data-close="1"></div>'
            + '<div class="post-popup-box">'
            + '  <button type="button" class="post-popup-close" aria-label="Close popup">&times;</button>'
            + '  <img src="' + imgUrl + '" alt="Code image">'
            + '</div>';
          document.body.appendChild(modal);

          function closePopup() {
            modal.remove();
            document.removeEventListener('keydown', escHandler);
          }
          function escHandler(e) {
            if (e.key === 'Escape') closePopup();
          }
          modal.addEventListener('click', function (e) {
            if (e.target.closest('[data-close]') || e.target.closest('.post-popup-close')) {
              closePopup();
            }
          });
          document.addEventListener('keydown', escHandler);
        });
      }
    })
    .catch(function () {
      showError('Could not load this post.');
    });
})();
