import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaBars, FaTimes, FaUserTie } from 'react-icons/fa'
import './Navbar.css'

const navLinks = [
  { path: '/',           label: 'Home' },
  { path: '/apartments', label: 'Properties' },
  { path: '/about',      label: 'About Us' },
  { path: '/contact',    label: 'Contact Us' },
]

function MileviaLogo({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="100" height="100" rx="14" fill="#0D0D0D" />
      <path
        d="M14 72 L14 38 L36 62 L50 44 L64 62 L78 38 L78 52 L90 38"
        stroke="#C9A84C"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M82 28 L90 38 L80 40"
        stroke="#C9A84C"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="navbar__inner">

        {/* ── Logo ── */}
        <Link to="/" className="navbar__logo" aria-label="Milevia Estates — Home">
          <MileviaLogo size={42} />
          <div className="navbar__logo-text">
            <span className="navbar__logo-main">MILEVIA</span>
            <span className="navbar__logo-sub">ESTATES</span>
            <span className="navbar__logo-tagline">Premium Life in Addis Ababa</span>
          </div>
        </Link>

        {/* ── Desktop nav links (hidden on mobile) ── */}
        <ul className="navbar__links" role="list">
          {navLinks.map(link => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`navbar__link ${location.pathname === link.path ? 'navbar__link--active' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* ── Partner Login — ALWAYS VISIBLE next to logo on every screen ── */}
        <Link to="/partner/login" className="navbar__partner-link" aria-label="Partner Login">
          <FaUserTie aria-hidden="true" />
          <span className="navbar__partner-label">Partner Login</span>
        </Link>

        {/* ── Hamburger (mobile only) ── */}
        <button
          className="navbar__hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      <div
        className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <ul className="navbar__mobile-links" role="list">
          {navLinks.map((link, i) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`navbar__mobile-link ${location.pathname === link.path ? 'navbar__mobile-link--active' : ''}`}
                style={{ animationDelay: menuOpen ? `${i * 0.07}s` : '0s' }}
                tabIndex={menuOpen ? 0 : -1}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
