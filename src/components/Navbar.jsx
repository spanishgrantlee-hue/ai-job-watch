import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!e.target.closest('.navbar')) setOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [open]);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-icon">⚡</span>
        <span className="brand-text">AI Job Watch</span>
      </Link>

      <button
        className="hamburger"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle navigation menu"
        aria-expanded={open}
      >
        <span className={`ham-line line1 ${open ? 'open' : ''}`} />
        <span className={`ham-line line2 ${open ? 'open' : ''}`} />
        <span className={`ham-line line3 ${open ? 'open' : ''}`} />
      </button>

      <div className={`navbar-links ${open ? 'mobile-open' : ''}`}>
        <Link to="/" className={pathname === '/' ? 'nav-link active' : 'nav-link'}>
          Home
        </Link>
        <Link
          to="/assessment"
          className={pathname === '/assessment' ? 'nav-link active' : 'nav-link'}
        >
          Assessment
        </Link>
        <Link to="/about" className={pathname === '/about' ? 'nav-link active' : 'nav-link'}>
          About
        </Link>
        <Link to="/assessment" className="nav-cta">
          Take the Test
        </Link>
      </div>
    </nav>
  );
}
