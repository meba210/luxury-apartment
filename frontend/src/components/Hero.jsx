import { Link } from 'react-router-dom'
import { FaArrowRight, FaBuilding, FaChartLine, FaUsers, FaHandshake } from 'react-icons/fa'
import './Hero.css'
import nightcity from '../assets/nightcity.jpg';
const stats = [
  { icon: <FaBuilding />,   value: '40+',  label: 'Properties Available' },
  { icon: <FaChartLine />,  value: '50+',  label: 'Investment Opportunities' },
  { icon: <FaUsers />,      value: '30+',  label: 'Happy Clients' },
  { icon: <FaHandshake />,  value: '200+',  label: 'Partner Agents' },
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
      <div className="hero__deco hero__deco--left" aria-hidden="true" />
      <div className="hero__deco hero__deco--right" aria-hidden="true" />

      {/* ── Main content ── */}
      <div className="hero__content container">
        <div className="hero__text">
          {/* Eyebrow */}
          <div className="hero__eyebrow animate-fadeInDown" aria-hidden="true">
            {/* <span className="hero__eyebrow-line" />
            <span>ESTABLISHED 2024 · ADDIS ABABA</span>
            <span className="hero__eyebrow-line" /> */}
          </div>

          {/* Main title — two lines */}
          <h1 className="hero__title animate-fadeInUp">
            <span className="hero__title-welcome">Welcome to</span>
            <span className="hero__title-brand">MILEVIA</span>
            <span className="hero__title-estates">ESTATES</span>
          </h1>

          {/* Sub-heading */}
          <p className="hero__subtitle animate-fadeInUp delay-200">
            We specializes in premium, fully finished apartments in Addis
            Ababa's most desirable neighborhoods. Whether you're buying your
            first home or investing, we make the process simple, transparent,
            and secure.
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
          <div
            className="hero__trust animate-fadeInUp delay-400"
            aria-label="Trust indicators"
          >
            {[
              'Verified Listings',
              'Trusted Since 2024',
              '100% Satisfaction',
            ].map((t) => (
              <div className="hero__trust-item" key={t}>
                <span className="hero__trust-dot" aria-hidden="true" />
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* ── Floating property card ── */}
        <div
          className="hero__card animate-fadeInUp delay-300"
          aria-label="Featured property preview"
        >
          <img
            src={nightcity}
            alt=" luxury apartment"
            className="hero__card-img"
            loading="lazy"
          />
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div
        className="hero__stats"
        role="region"
        aria-label="Company statistics"
      >
        <div className="container">
          <div className="hero__stats-grid">
            {stats.map((stat, i) => (
              <div key={i} className="hero__stat">
                <div className="hero__stat-icon" aria-hidden="true">
                  {stat.icon}
                </div>
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
  );
}
