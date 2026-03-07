import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navLinks } from '../constants/site.js';
import HomeIcon from './HomeIcon.jsx';
import Sidebar from './Sidebar.jsx';
import ThemeToggle from './ThemeToggle.jsx';

export default function SiteLayout({ children }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [location.pathname]);

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
