import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaBars, FaTimes, FaWhatsapp, FaUserTie } from 'react-icons/fa'
import './Navbar.css'

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/apartments', label: 'Properties' },
  { path: '/about', label: 'About Us' },
  { path: '/contact', label: 'Contact Us' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-icon">
            {/* M monogram */}
            <svg
              viewBox="0 0 44 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="1"
                y="1"
                width="42"
                height="42"
                rx="3"
                stroke="#C9A84C"
                strokeWidth="1.5"
              />
              <path
                d="M10 32V12L22 26L34 12V32"
                stroke="#C9A84C"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>
          <div className="navbar__logo-text">
            <span className="navbar__logo-main">MILEVIA</span>
            <span className="navbar__logo-sub">ESTATES</span>
            <span className="navbar__logo-tagline">
              Premium Life in Addis Ababa
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <ul className="navbar__links">
          {navLinks.map((link) => (
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

        {/* Partner CTA */}
        <Link to="/partner/login" className="navbar__partner-link">
          <FaUserTie />
          <span>Partner Login</span>
        </Link>

        {/* WhatsApp CTA */}
        {/* <a
          href="https://wa.me/251911234567"
          target="_blank"
          rel="noopener noreferrer"
          className="navbar__whatsapp"
        >
          <FaWhatsapp />
          <span>WhatsApp Us</span>
        </a> */}

        {/* Hamburger */}
        <button
          className="navbar__hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`}
      >
        <ul className="navbar__mobile-links">
          {navLinks.map((link, i) => (
            <li key={link.path} style={{ animationDelay: `${i * 0.07}s` }}>
              <Link
                to={link.path}
                className={`navbar__mobile-link ${location.pathname === link.path ? 'navbar__mobile-link--active' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li style={{ animationDelay: '0.28s' }}>
            <Link to="/partner/login" className="navbar__mobile-link">
              <FaUserTie />
              <span>Partner Login</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
