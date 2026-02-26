(function () {
  var tokenKey = 'roshan_admin_token';
  var form = document.getElementById('adminDetailForm');
  var msg = document.getElementById('adminDetailMsg');
  var popupImageFileInput = document.getElementById('detailPopupImageFile');
  var popupImageUrlInput = document.getElementById('detailPopupImageUrl');

  function getToken() {
    return localStorage.getItem(tokenKey) || '';
  }

  async function api(path, options) {
    var token = getToken();
    var headers = Object.assign({}, options && options.headers ? options.headers : {});
    if (token) headers.Authorization = 'Bearer ' + token;
    if (!headers['Content-Type'] && options && options.body) {
      headers['Content-Type'] = 'application/json';
    }

    var res = await fetch(path, Object.assign({}, options, { headers: headers }));
    var data = {};
    try {
      data = await res.json();
    } catch (err) {
      data = {};
    }
    if (!res.ok) {
      throw new Error(data.error || 'Request failed');
    }
    return data;
  }

  function getPostId() {
    var parts = window.location.pathname.split('/').filter(Boolean);
    return parts.length >= 3 && parts[0] === 'admin' && parts[1] === 'post' ? decodeURIComponent(parts[2]) : '';
  }

  async function init() {
    var id = getPostId();
    if (!id) {
      msg.textContent = 'Invalid post id.';
      return;
    }

    try {
      await api('/api/admin/me');
    } catch (err) {
      msg.textContent = 'Please login first from /admin.';
      return;
    }

    try {
      var data = await api('/api/posts/' + encodeURIComponent(id));
      var post = data.post || {};
      document.getElementById('detailImage').value = post.imageUrl || '';
      document.getElementById('detailTitle').value = post.title || '';
      document.getElementById('detailDescription').value = post.description || '';
      document.getElementById('detailPageKey').value = post.pageKey || 'home';
      document.getElementById('detailContent').value = post.content || post.description || '';
      document.getElementById('detailButtonText').value = post.buttonText || '';
      document.getElementById('detailButtonLink').value = post.buttonLink || '';
      document.getElementById('detailButtonIconUrl').value = post.buttonIconUrl || '';
      document.getElementById('detailPopupImageUrl').value = post.popupImageUrl || '';
      form.classList.remove('admin-panel-hidden');
      msg.textContent = '';

      form.addEventListener('submit', async function (event) {
        event.preventDefault();
        msg.textContent = 'Saving...';
        try {
          var popupImageUrl = popupImageUrlInput.value.trim();
          var popupFile = popupImageFileInput && popupImageFileInput.files ? popupImageFileInput.files[0] : null;
          if (popupFile) {
            msg.textContent = 'Uploading popup image...';
            var popupDataUrl = await new Promise(function (resolve, reject) {
              var reader = new FileReader();
              reader.onload = function () { resolve(reader.result); };
              reader.onerror = function () { reject(new Error('Could not read popup image')); };
              reader.readAsDataURL(popupFile);
            });
            var uploaded = await api('/api/upload', {
              method: 'POST',
              body: JSON.stringify({
                name: (popupFile.name || 'popup').replace(/\.[^.]+$/, ''),
                dataUrl: popupDataUrl
              })
            });
            popupImageUrl = uploaded.imageUrl;
            popupImageUrlInput.value = popupImageUrl;
          }

          msg.textContent = 'Saving...';
          await api('/api/posts/' + encodeURIComponent(id), {
            method: 'PUT',
            body: JSON.stringify({
              imageUrl: document.getElementById('detailImage').value.trim(),
              title: document.getElementById('detailTitle').value.trim(),
              description: document.getElementById('detailDescription').value.trim(),
              pageKey: document.getElementById('detailPageKey').value,
              content: document.getElementById('detailContent').value.trim(),
              buttonText: document.getElementById('detailButtonText').value.trim(),
              buttonLink: document.getElementById('detailButtonLink').value.trim(),
              buttonIconUrl: document.getElementById('detailButtonIconUrl').value.trim(),
              popupImageUrl: popupImageUrl
            })
          });
          msg.textContent = 'Saved successfully.';
        } catch (saveErr) {
          msg.textContent = saveErr.message;
        }
      });
    } catch (err) {
      msg.textContent = err.message;
    }
  }

  init();
})();
