import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle.jsx';
import { adminApi, api, ADMIN_TOKEN_KEY, readFileDataUrl } from '../lib/api.js';
import { pageTargets } from '../constants/site.js';

export default function AdminPage() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginMsg, setLoginMsg] = useState('');
  const [postMsg, setPostMsg] = useState('');
  const [posts, setPosts] = useState([]);
  const [login, setLogin] = useState({ username: '', password: '' });
  const [files, setFiles] = useState({ image: null, popup: null });
  const [form, setForm] = useState({
    imageUrl: '',
    title: '',
    description: '',
    pageKey: 'home',
    content: '',
    buttonText: '',
    buttonLink: '',
    buttonIconUrl: '',
    popupImageUrl: ''
  });

  const loadPosts = () => adminApi('/api/posts').then((d) => setPosts(d.posts || [])).catch(() => {});

  useEffect(() => {
    adminApi('/api/admin/me')
      .then(() => {
        setLoggedIn(true);
        loadPosts();
      })
      .catch(() => setLoggedIn(false));
  }, []);

  const uploadIfFile = async (file) => {
    if (!file) return '';
    const dataUrl = await readFileDataUrl(file);
    const uploaded = await adminApi('/api/upload', {
      method: 'POST',
      body: JSON.stringify({
        name: (file.name || 'upload').replace(/\.[^.]+$/, ''),
        dataUrl
      })
    });
    return uploaded.imageUrl || '';
  };

  return (
    <main className="admin-page">
      <div className="admin-theme-bar"><ThemeToggle /></div>

      {!loggedIn ? (
        <section className="admin-panel">
          <h1>Admin Login</h1>
          <p>Hidden page. Sign in to create posts shown on pages.</p>
          <form
            className="admin-form"
            onSubmit={(e) => {
              e.preventDefault();
              setLoginMsg('');
              api('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(login)
              })
                .then((d) => {
                  localStorage.setItem(ADMIN_TOKEN_KEY, d.token);
                  setLoggedIn(true);
                  loadPosts();
                })
                .catch((err) => setLoginMsg(err.message));
            }}
          >
            <label>Username<input required value={login.username} onChange={(e) => setLogin({ ...login, username: e.target.value })} /></label>
            <label>Password<input type="password" required value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} /></label>
            <button type="submit" className="read-card-btn">Login</button>
          </form>
          <p className="admin-message">{loginMsg}</p>
        </section>
      ) : (
        <section className="admin-panel">
          <div className="admin-top-row">
            <h1>Post Manager</h1>
            <button
              type="button"
              className="read-card-btn"
              onClick={() => {
                localStorage.removeItem(ADMIN_TOKEN_KEY);
                setLoggedIn(false);
              }}
            >
              Logout
            </button>
          </div>

          <form
            className="admin-form"
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                setPostMsg('Uploading image...');
                const uploadedMain = await uploadIfFile(files.image);
                const uploadedPopup = await uploadIfFile(files.popup);
                setPostMsg('Saving post...');
                await adminApi('/api/posts', {
                  method: 'POST',
                  body: JSON.stringify({
                    ...form,
                    imageUrl: uploadedMain || form.imageUrl,
                    popupImageUrl: uploadedPopup || form.popupImageUrl
                  })
                });
                setPostMsg('Post added.');
                setForm({
                  imageUrl: '',
                  title: '',
                  description: '',
                  pageKey: 'home',
                  content: '',
                  buttonText: '',
                  buttonLink: '',
                  buttonIconUrl: '',
                  popupImageUrl: ''
                });
                setFiles({ image: null, popup: null });
                loadPosts();
              } catch (err) {
                setPostMsg(err.message);
              }
            }}
          >
            <label>Upload Image (from PC)<input type="file" accept="image/*" onChange={(e) => setFiles({ ...files, image: e.target.files?.[0] || null })} /></label>
            <label>Image URL<input type="url" required={!files.image} value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></label>
            <label>Title<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
            <label>Description<textarea rows="4" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
            <label>Show On Page
              <select value={form.pageKey} onChange={(e) => setForm({ ...form, pageKey: e.target.value })}>
                {pageTargets.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </label>
            <label>Full Post Content<textarea rows="8" required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></label>
            <label>Extra Button Text<input value={form.buttonText} onChange={(e) => setForm({ ...form, buttonText: e.target.value })} /></label>
            <label>Extra Button Link<input type="url" value={form.buttonLink} onChange={(e) => setForm({ ...form, buttonLink: e.target.value })} /></label>
            <label>Extra Button Icon URL<input type="url" value={form.buttonIconUrl} onChange={(e) => setForm({ ...form, buttonIconUrl: e.target.value })} /></label>
            <label>VN/Capcut Popup Image URL<input type="url" value={form.popupImageUrl} onChange={(e) => setForm({ ...form, popupImageUrl: e.target.value })} /></label>
            <label>VN/Capcut Popup Image (from PC)<input type="file" accept="image/*" onChange={(e) => setFiles({ ...files, popup: e.target.files?.[0] || null })} /></label>
            <button type="submit" className="read-card-btn">Add Post</button>
          </form>

          <p className="admin-message">{postMsg}</p>

          <h2 className="admin-subtitle">Existing Posts</h2>
          <div className="admin-post-list">
            {posts.map((post) => (
              <article className="admin-post-item" key={post.id}>
                <img src={post.imageUrl} alt={post.title} />
                <div>
                  <h3>{post.title}</h3>
                  <p>{post.description}</p>
                  <small>{new Date(post.createdAt).toLocaleString()} | {post.pageKey}</small>
                </div>
                <div className="admin-post-actions">
                  <Link className="read-card-btn" to={`/post.html?id=${encodeURIComponent(post.id)}`}>Open</Link>
                  <button type="button" className="read-card-btn" onClick={() => navigate(`/admin/post/${post.id}`)}>Edit Full</button>
                  <button
                    type="button"
                    className="read-card-btn"
                    onClick={() => adminApi(`/api/posts/${encodeURIComponent(post.id)}`, { method: 'DELETE' }).then(loadPosts)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
