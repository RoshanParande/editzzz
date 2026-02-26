import { useState } from 'react';
import SiteLayout from '../components/SiteLayout.jsx';
import { api } from '../lib/api.js';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const submit = (e) => {
    e.preventDefault();
    setStatus('Sending...');
    api('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(() => {
        setStatus('Message saved successfully.');
        setForm({ name: '', email: '', message: '' });
      })
      .catch((err) => setStatus(err.message));
  };

  return (
    <SiteLayout>
      <section className="contact-box">
        <h2>Contact Us</h2>
        <p>Use this form to send your message.</p>
        <form className="contact-form" onSubmit={submit}>
          <label>Name</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <label>Email</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <label>Message</label>
          <textarea rows="6" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <button type="submit" className="read-card-btn">Send Message</button>
        </form>
        <p className="contact-status">{status}</p>
        <p className="contact-email-note">For more info contact on this email: <a href="mailto:roshaneditzz098@gmail.com">roshaneditzz098@gmail.com</a></p>
      </section>
    </SiteLayout>
  );
}
