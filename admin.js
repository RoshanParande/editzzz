(function () {
  const tokenKey = 'roshan_admin_token';

  const loginPanel = document.getElementById('adminLoginPanel');
  const editorPanel = document.getElementById('adminEditorPanel');
  const loginForm = document.getElementById('adminLoginForm');
  const loginMsg = document.getElementById('adminLoginMsg');
  const postForm = document.getElementById('adminPostForm');
  const postMsg = document.getElementById('adminPostMsg');
  const postsList = document.getElementById('adminPostsList');
  const logoutBtn = document.getElementById('adminLogout');
  const imageFileInput = document.getElementById('postImageFile');
  const imageUrlInput = document.getElementById('postImage');
  const popupImageFileInput = document.getElementById('postPopupImageFile');
  const popupImageUrlInput = document.getElementById('postPopupImageUrl');
  const pageNames = {
    lightroom: 'Lightroom Preset',
    snapseed: 'Snapseed Preset',
    capcut: 'Capcut Template',
    reel: 'VN editing',
    aiprompts: 'AI Prompts',
    home: 'Home'
  };

  function getToken() {
    return localStorage.getItem(tokenKey) || '';
  }

  function setToken(token) {
    if (token) localStorage.setItem(tokenKey, token);
    else localStorage.removeItem(tokenKey);
  }

  async function api(path, options) {
    const token = getToken();
    const headers = Object.assign({}, options && options.headers ? options.headers : {});
    if (token) headers.Authorization = `Bearer ${token}`;
    if (!headers['Content-Type'] && options && options.body) {
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(path, Object.assign({}, options, { headers, credentials: 'include' }));
    let data = {};
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

  function showLoggedIn(isLoggedIn) {
    loginPanel.classList.toggle('admin-panel-hidden', isLoggedIn);
    editorPanel.classList.toggle('admin-panel-hidden', !isLoggedIn);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  async function loadPosts() {
    const { posts } = await api('/api/posts');
    postsList.innerHTML = '';

    if (!posts.length) {
      postsList.innerHTML = '<p class="admin-message">No posts yet.</p>';
      return;
    }

    posts.forEach((post) => {
      const card = document.createElement('article');
      card.className = 'admin-post-item';
      card.innerHTML = `
        <img src="${escapeHtml(post.imageUrl)}" alt="${escapeHtml(post.title)}">
        <div>
          <h3>${escapeHtml(post.title)}</h3>
          <p>${escapeHtml(post.description)}</p>
          <small>${new Date(post.createdAt).toLocaleString()} | ${escapeHtml(pageNames[post.pageKey] || post.pageKey || 'Home')}</small>
        </div>
        <div class="admin-post-actions">
          <a class="read-card-btn" href="/post.html?id=${encodeURIComponent(post.id)}" target="_blank" rel="noopener">Open</a>
          <a class="read-card-btn" href="/admin/post/${encodeURIComponent(post.id)}">Edit Full</a>
          <button type="button" class="read-card-btn" data-delete-id="${escapeHtml(post.id)}">Delete</button>
        </div>
      `;
      postsList.appendChild(card);
    });
  }

  function readFileAsDataUrl(file) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onload = function () { resolve(reader.result); };
      reader.onerror = function () { reject(new Error('Could not read image file')); };
      reader.readAsDataURL(file);
    });
  }

  async function uploadImageIfNeeded() {
    const file = imageFileInput && imageFileInput.files ? imageFileInput.files[0] : null;
    if (!file) return imageUrlInput.value.trim();

    const dataUrl = await readFileAsDataUrl(file);
    const upload = await api('/api/upload', {
      method: 'POST',
      body: JSON.stringify({
        name: (file.name || 'upload').replace(/\.[^.]+$/, ''),
        dataUrl: dataUrl
      })
    });
    imageUrlInput.value = upload.imageUrl;
    return upload.imageUrl;
  }

  async function uploadPopupImageIfNeeded() {
    const file = popupImageFileInput && popupImageFileInput.files ? popupImageFileInput.files[0] : null;
    if (!file) return popupImageUrlInput.value.trim();

    const dataUrl = await readFileAsDataUrl(file);
    const upload = await api('/api/upload', {
      method: 'POST',
      body: JSON.stringify({
        name: (file.name || 'popup').replace(/\.[^.]+$/, ''),
        dataUrl: dataUrl
      })
    });
    popupImageUrlInput.value = upload.imageUrl;
    return upload.imageUrl;
  }

  async function checkSession() {
    const token = getToken();
    if (!token) {
      showLoggedIn(false);
      return;
    }
    try {
      await api('/api/admin/me');
      showLoggedIn(true);
      await loadPosts();
    } catch (err) {
      setToken('');
      showLoggedIn(false);
    }
  }

  loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    loginMsg.textContent = '';
    try {
      const username = document.getElementById('adminUsername').value.trim();
      const password = document.getElementById('adminPassword').value;
      const data = await api('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      setToken(data.token);
      showLoggedIn(true);
      loginForm.reset();
      await loadPosts();
    } catch (err) {
      loginMsg.textContent = err.message;
    }
  });

  postForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    postMsg.textContent = '';
    try {
      postMsg.textContent = 'Uploading image...';
      const resolvedImageUrl = await uploadImageIfNeeded();
      const resolvedPopupImageUrl = await uploadPopupImageIfNeeded();
      const payload = {
        imageUrl: resolvedImageUrl,
        title: document.getElementById('postTitle').value.trim(),
        description: document.getElementById('postDescription').value.trim(),
        pageKey: document.getElementById('postPageKey').value,
        content: document.getElementById('postContent').value.trim(),
        buttonText: document.getElementById('postButtonText').value.trim(),
        buttonLink: document.getElementById('postButtonLink').value.trim(),
        buttonIconUrl: document.getElementById('postButtonIconUrl').value.trim(),
        popupImageUrl: resolvedPopupImageUrl
      };
      postMsg.textContent = 'Saving post...';
      await api('/api/posts', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      postForm.reset();
      postMsg.textContent = 'Post added.';
      await loadPosts();
    } catch (err) {
      postMsg.textContent = err.message;
    }
  });

  postsList.addEventListener('click', async function (event) {
    const button = event.target.closest('[data-delete-id]');
    if (!button) return;
    const id = button.getAttribute('data-delete-id');
    if (!id) return;
    try {
      await api(`/api/posts/${encodeURIComponent(id)}`, { method: 'DELETE' });
      await loadPosts();
    } catch (err) {
      postMsg.textContent = err.message;
    }
  });

  logoutBtn.addEventListener('click', function () {
    setToken('');
    showLoggedIn(false);
  });

  checkSession();
})();
