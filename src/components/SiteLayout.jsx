import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navLinks } from '../constants/site.js';
import HomeIcon from './HomeIcon.jsx';
import Sidebar from './Sidebar.jsx';
import ThemeToggle from './ThemeToggle.jsx';

export default function SiteLayout({ children }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [serviceStatus, setServiceStatus] = useState({
    loading: true,
    backendOk: false,
    mongoOk: false,
    cloudinaryConfigured: false,
    cloudinaryLiveAvailable: false,
    cloudinaryOk: false,
    message: 'Checking backend services...'
  });

  useEffect(() => setMenuOpen(false), [location.pathname]);

  useEffect(() => {
    let cancelled = false;

    const fetchServiceStatus = async () => {
      try {
        const res = await fetch('/api/health?live=1', { credentials: 'include' });
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;

        const mongoOk = Boolean(data?.checks?.database?.connected);
        const cloudinaryConfigured = Boolean(data?.checks?.cloudinary?.configured);
        const cloudinaryLiveAvailable = typeof data?.checks?.cloudinary?.connected === 'boolean';
        const cloudinaryOk = cloudinaryLiveAvailable
          ? Boolean(data?.checks?.cloudinary?.connected)
          : cloudinaryConfigured;
        const backendOk = Boolean(data?.ok);

        let message = 'Backend connected';
        if (!mongoOk) message = 'MongoDB disconnected';
        else if (cloudinaryConfigured && cloudinaryLiveAvailable && !cloudinaryOk) message = 'Cloudinary disconnected';
        else if (cloudinaryConfigured && !cloudinaryLiveAvailable) message = 'Cloudinary configured (live check unavailable)';
        else if (!cloudinaryConfigured) message = 'Cloudinary not configured';

        setServiceStatus({
          loading: false,
          backendOk,
          mongoOk,
          cloudinaryConfigured,
          cloudinaryLiveAvailable,
          cloudinaryOk,
          message
        });
      } catch (err) {
        if (cancelled) return;
        setServiceStatus({
          loading: false,
          backendOk: false,
          mongoOk: false,
          cloudinaryConfigured: false,
          cloudinaryLiveAvailable: false,
          cloudinaryOk: false,
          message: 'Backend unreachable'
        });
      }
    };

    fetchServiceStatus();
    const timer = setInterval(fetchServiceStatus, 15000);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <div className="heading">
            <h1>Roshan Editzz</h1>
            <p className="tagline">Create trending Videos and Photos</p>
          </div>
          <nav className={`nav-bar ${menuOpen ? 'is-open' : ''}`}>
            <button
              type="button"
              className="nav-toggle"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="nav-toggle-bar" />
              <span className="nav-toggle-bar" />
              <span className="nav-toggle-bar" />
            </button>
            <div className="nav-left">
              {navLinks.map((item) => (
                <Link key={item.to} to={item.to} className={item.label === 'Home' ? 'nav-home' : ''}>
                  {item.label === 'Home' ? <HomeIcon /> : null}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
            <ThemeToggle />
          </nav>
          <div className={`service-status ${serviceStatus.backendOk ? 'ok' : 'bad'}`}>
            {serviceStatus.loading ? 'Status: checking...' : `Status: ${serviceStatus.message}`}
            {!serviceStatus.loading ? (
              <span className="service-status-meta">
                {`MongoDB: ${serviceStatus.mongoOk ? 'Connected' : 'Disconnected'} | Cloudinary: ${
                  serviceStatus.cloudinaryConfigured
                    ? serviceStatus.cloudinaryLiveAvailable
                      ? serviceStatus.cloudinaryOk
                        ? 'Connected'
                        : 'Disconnected'
                      : 'Configured'
                    : 'Not Configured'
                }`}
              </span>
            ) : null}
          </div>
        </div>
      </header>

      <div className="page-layout">
        <main className="main">{children}</main>
        <Sidebar />
      </div>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-links">
            <Link to="/privacy.html">Privacy Policy</Link>
            <Link to="/terms.html">Terms of Use</Link>
            <Link to="/contact.html">Contact</Link>
            <Link to="/disclaimer.html">Disclaimer</Link>
          </div>
          <p className="footer-copy">&copy; {new Date().getFullYear()} Roshan Editzz. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
