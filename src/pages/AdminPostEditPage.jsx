import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle.jsx';
import { adminApi, readFileDataUrl } from '../lib/api.js';
import { pageTargets } from '../constants/site.js';

export default function AdminPostEditPage() {
  const { id = '' } = useParams();
  const [message, setMessage] = useState('');
  const [form, setForm] = useState(null);
  const [popupFile, setPopupFile] = useState(null);

  useEffect(() => {
    adminApi('/api/admin/me')
      .then(() => adminApi(`/api/posts/${encodeURIComponent(id)}`))
      .then((data) => {
        const post = data.post || {};
        setForm({
          imageUrl: post.imageUrl || '',
          title: post.title || '',
          description: post.description || '',
          pageKey: post.pageKey || 'home',
          content: post.content || '',
          buttonText: post.buttonText || '',
          buttonLink: post.buttonLink || '',
          buttonIconUrl: post.buttonIconUrl || '',
          popupImageUrl: post.popupImageUrl || ''
        });
      })
      .catch((err) => setMessage(err.message));
  }, [id]);

  if (!form) {
    return (
      <main className="admin-page">
        <div className="admin-theme-bar"><ThemeToggle /></div>
        <section className="admin-panel"><p className="admin-message">{message || 'Loading...'}</p></section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-theme-bar"><ThemeToggle /></div>
      <section className="admin-panel">
        <Link className="read-card-btn" to="/admin">Back to Admin</Link>
        <h1 className="admin-detail-title">Edit Continue Reading Content</h1>
        <p className="admin-message">{message}</p>
        <form
          className="admin-form"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              let popupImageUrl = form.popupImageUrl;
              if (popupFile) {
                setMessage('Uploading popup image...');
                const dataUrl = await readFileDataUrl(popupFile);
                const uploaded = await adminApi('/api/upload', {
                  method: 'POST',
                  body: JSON.stringify({
                    name: (popupFile.name || 'popup').replace(/\.[^.]+$/, ''),
                    dataUrl
                  })
                });
                popupImageUrl = uploaded.imageUrl;
              }

              setMessage('Saving...');
              await adminApi(`/api/posts/${encodeURIComponent(id)}`, {
                method: 'PUT',
                body: JSON.stringify({ ...form, popupImageUrl })
              });
              setMessage('Saved successfully.');
            } catch (err) {
              setMessage(err.message);
            }
          }}
        >
          <label>Image URL<input type="url" required value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></label>
          <label>Title<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
          <label>Description<textarea rows="4" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
          <label>Show On Page
            <select value={form.pageKey} onChange={(e) => setForm({ ...form, pageKey: e.target.value })}>
              {pageTargets.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </label>
          <label>Full Post Content<textarea rows="12" required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></label>
          <label>Extra Button Text<input value={form.buttonText} onChange={(e) => setForm({ ...form, buttonText: e.target.value })} /></label>
          <label>Extra Button Link<input type="url" value={form.buttonLink} onChange={(e) => setForm({ ...form, buttonLink: e.target.value })} /></label>
          <label>Extra Button Icon URL<input type="url" value={form.buttonIconUrl} onChange={(e) => setForm({ ...form, buttonIconUrl: e.target.value })} /></label>
          <label>VN/Capcut Popup Image URL<input type="url" value={form.popupImageUrl} onChange={(e) => setForm({ ...form, popupImageUrl: e.target.value })} /></label>
          <label>VN/Capcut Popup Image (from PC)<input type="file" accept="image/*" onChange={(e) => setPopupFile(e.target.files?.[0] || null)} /></label>
          <button type="submit" className="read-card-btn">Save Changes</button>
        </form>
      </section>
    </main>
  );
}
