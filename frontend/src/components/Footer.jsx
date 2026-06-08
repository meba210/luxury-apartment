import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="container">
          <div className="footer__grid">
            {/* Brand */}
            <div className="footer__brand">
              <div className="footer__logo">
                <div className="footer__logo-icon">
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
                <div>
                  <span className="footer__logo-main">MILEVIA</span>
                  <span className="footer__logo-sub">ESTATES</span>
                </div>
              </div>
              <p className="footer__tagline">
                Your trusted real estate partner in Addis Ababa. We connect
                people to premium properties and investment opportunities.
              </p>
              <div className="footer__socials">
                <a href="#" aria-label="Facebook" className="footer__social">
                  <FaFacebook />
                </a>
                <a href="#" aria-label="Instagram" className="footer__social">
                  <FaInstagram />
                </a>
                <a href="#" aria-label="LinkedIn" className="footer__social">
                  <FaLinkedin />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer__col">
              <h4 className="footer__col-title">Quick Links</h4>
              <ul className="footer__links">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/apartments">Properties</Link>
                </li>
                <li>
                  <Link to="/about">About Us</Link>
                </li>
                <li>
                  <Link to="/contact">Contact Us</Link>
                </li>
              </ul>
            </div>

            {/* Property Types */}
            <div className="footer__col">
              <h4 className="footer__col-title">Property Types</h4>
              <ul className="footer__links">
                <li>
                  <Link to="/apartments">Apartments</Link>
                </li>

                <li>
                  <Link to="/Penthouses">Penthouses</Link>
                </li>
                <li>
                  <Link to="/Duplexes">Duplexes</Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="footer__col">
              <h4 className="footer__col-title">Contact Us</h4>
              <ul className="footer__contact-list">
                <li>
                  <FaPhone className="footer__contact-icon" />
                  <div>
                    <a href="tel:+251935584767">+251 935584767</a>
                    <a href="tel:+2519963320937">+251 9963320937</a>
                  </div>
                </li>
                <li>
                  <FaEnvelope className="footer__contact-icon" />
                  <a href="mailto:minilikab4@gmail.com">minilikab4@gmail.com</a>
                </li>
                <li>
                  <FaGlobe className="footer__contact-icon" />
                  <a href="#">www.milevia.com</a>
                </li>
                {/* <li>
                  <FaMapMarkerAlt className="footer__contact-icon" />
                  <span>Bole, Addis Ababa, Ethiopia</span>
                </li> */}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <p>
            © {new Date().getFullYear()} MILEVIA Estates. All Rights Reserved.
          </p>
          <div className="footer__bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
