import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categories } from '../constants/site.js';

export default function Sidebar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const runSearch = () => {
    if (query.trim().toLowerCase() === '/admin') navigate('/admin');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-search">
        <input
          type="text"
          placeholder="Search ..."
          aria-label="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && runSearch()}
        />
        <button type="button" onClick={runSearch}>Search</button>
      </div>
      <h3 className="sidebar-heading">CATEGORIES</h3>
      <nav className="sidebar-categories">
        {categories.map((item) => (
          <Link key={item} to="/home.html">{item}</Link>
        ))}
      </nav>
    </aside>
  );
}
