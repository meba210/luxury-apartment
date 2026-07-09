import { Link } from 'react-router-dom'
import { FaArrowRight, FaBuilding, FaChartLine, FaUsers, FaHandshake } from 'react-icons/fa'
import './Hero.css'

const stats = [
  { icon: <FaBuilding />,   value: '40+',  label: 'Properties Available' },
  { icon: <FaChartLine />,  value: '50+',  label: 'Investment Opportunities' },
  { icon: <FaUsers />,      value: '30+',  label: 'Happy Clients' },
  { icon: <FaHandshake />,  value: '25+',  label: 'Partner Agents' },
]

export default function Hero() {
  return (
    <section className="hero">

      {/* ── Background ── */}
      <div className="hero__bg">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=90"
          alt="Luxury residence in Addis Ababa"
          className="hero__bg-img"
          loading="eager"
        />
        <div className="hero__overlay" />
        <div className="hero__overlay-warm" />
      </div>

      {/* Decorative vertical gold lines */}
      <div className="hero__deco hero__deco--left"  aria-hidden="true" />
      <div className="hero__deco hero__deco--right" aria-hidden="true" />

      {/* ── Main content ── */}
      <div className="hero__content container">
        <div className="hero__text">

          {/* Eyebrow */}
          <div className="hero__eyebrow animate-fadeInDown" aria-hidden="true">
            <span className="hero__eyebrow-line" />
            <span>ESTABLISHED 2024 · ADDIS ABABA</span>
            <span className="hero__eyebrow-line" />
          </div>

          {/* Main title — two lines */}
          <h1 className="hero__title animate-fadeInUp">
            <span className="hero__title-welcome">Welcome to</span>
            <span className="hero__title-brand">MILEVIA</span>
            <span className="hero__title-estates">ESTATES</span>
          </h1>

          {/* Sub-heading */}
          <p className="hero__subtitle animate-fadeInUp delay-200">
            Addis Ababa's premier destination for luxury 2, 3 &amp; 4-bedroom
            apartments.<br className="hero__br" />
            Exclusive listings. Trusted service. Unmatched value.
          </p>

          {/* CTAs */}
          <div className="hero__actions animate-fadeInUp delay-300">
            <Link to="/apartments" className="btn btn-gold btn-lg">
              Explore Properties <FaArrowRight aria-hidden="true" />
            </Link>
            <Link to="/contact" className="btn btn-outline-white btn-lg">
              Contact Us <FaArrowRight aria-hidden="true" />
            </Link>
          </div>

          {/* Trust badges */}
          <div className="hero__trust animate-fadeInUp delay-400" aria-label="Trust indicators">
            {['Verified Listings', 'Trusted Since 2024', '100% Satisfaction'].map(t => (
              <div className="hero__trust-item" key={t}>
                <span className="hero__trust-dot" aria-hidden="true" />
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* ── Floating property card ── */}
        <div className="hero__card animate-fadeInUp delay-300" aria-label="Featured property preview">
          <div className="hero__card-badge">Featured</div>
          <img
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&q=80"
            alt="Bole Premium Penthouse — featured luxury apartment"
            className="hero__card-img"
            loading="lazy"
          />
          <div className="hero__card-body">
            <span className="hero__card-location">📍 Bole, Addis Ababa</span>
            <h4 className="hero__card-title">Bole Premium Penthouse</h4>
            <div className="hero__card-specs">
              <span>3 Beds</span>
              <span className="hero__card-dot" aria-hidden="true">·</span>
              <span>3 Baths</span>
              <span className="hero__card-dot" aria-hidden="true">·</span>
              <span>210 m²</span>
            </div>
            <div className="hero__card-price">ETB 15,000,000</div>
          </div>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="hero__stats" role="region" aria-label="Company statistics">
        <div className="container">
          <div className="hero__stats-grid">
            {stats.map((stat, i) => (
              <div key={i} className="hero__stat">
                <div className="hero__stat-icon" aria-hidden="true">{stat.icon}</div>
                <div className="hero__stat-info">
                  <span className="hero__stat-value">{stat.value}</span>
                  <span className="hero__stat-label">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  )
}
