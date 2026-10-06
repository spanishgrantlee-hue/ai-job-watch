import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { pathname } = useLocation();
  // The mobile menu remembers which page it was opened on and only counts as
  // open there, so any route change closes it in the same render -- no
  // close-on-navigate effect, and no frame of the open menu on the new page.
  const [openedOn, setOpenedOn] = useState(null);
  const open = openedOn === pathname;

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!e.target.closest('.navbar')) setOpenedOn(null);
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
        onClick={() => setOpenedOn(open ? null : pathname)}
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
        <Link to="/explore" className={pathname === '/explore' ? 'nav-link active' : 'nav-link'}>
          Explore
        </Link>
        <Link to="/assessment" className="nav-cta">
          Take the Test
        </Link>
      </div>
    </nav>
  );
}
