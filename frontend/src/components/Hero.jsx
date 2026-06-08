import { Link } from 'react-router-dom'
import { FaArrowRight, FaBuilding, FaChartLine, FaUsers, FaHandshake } from 'react-icons/fa'
import './Hero.css'

const stats = [
  { icon: <FaBuilding />, value: '150+', label: 'Properties Available' },
  { icon: <FaChartLine />, value: '50+', label: 'Investment Opportunities' },
  { icon: <FaUsers />, value: '100+', label: 'Happy Clients' },
  { icon: <FaHandshake />, value: '25+', label: 'Partner Agents' },
]

export default function Hero() {
  return (
    <section className="hero">
      {/* Background — luxury Addis Ababa night skyline */}
      <div className="hero__bg">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=90"
          alt="Luxury residence in Addis Ababa"
          className="hero__bg-img"
        />
        {/* Warm amber/gold gradient overlay for luxury feel */}
        <div className="hero__overlay" />
        <div className="hero__overlay-warm" />
      </div>

      {/* Decorative gold lines */}
      <div className="hero__deco hero__deco--left" />
      <div className="hero__deco hero__deco--right" />

      {/* Main Content */}
      <div className="hero__content container">
        <div className="hero__text">
          <div className="hero__eyebrow animate-fadeInDown">
            <span className="hero__eyebrow-line" />
            <span>PREMIUM LIFE IN</span>
            <span className="hero__eyebrow-line" />
          </div>

          <h1 className="hero__title animate-fadeInUp">
            ADDIS ABABA
          </h1>

          <p className="hero__subtitle animate-fadeInUp delay-200">
            Discover exclusive apartments, investment properties,<br />
            and luxury homes with <strong>MILEVIA Estates</strong>.
          </p>

          <div className="hero__actions animate-fadeInUp delay-300">
            <Link to="/apartments" className="btn btn-gold btn-lg">
              View Properties <FaArrowRight />
            </Link>
            <Link to="/contact" className="btn btn-outline-white btn-lg">
              Contact Us <FaArrowRight />
            </Link>
          </div>

          {/* Trust badges */}
          <div className="hero__trust animate-fadeInUp delay-400">
            <div className="hero__trust-item">
              <span className="hero__trust-dot" />
              Verified Listings
            </div>
            <div className="hero__trust-item">
              <span className="hero__trust-dot" />
              Trusted Since 2014
            </div>
            <div className="hero__trust-item">
              <span className="hero__trust-dot" />
              100% Satisfaction
            </div>
          </div>
        </div>

        {/* Floating property card */}
        <div className="hero__card animate-fadeInUp delay-300">
          <div className="hero__card-badge">Featured</div>
          <img
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&q=80"
            alt="Featured luxury apartment"
            className="hero__card-img"
          />
          <div className="hero__card-body">
            <span className="hero__card-location">📍 Bole, Addis Ababa</span>
            <h4 className="hero__card-title">Bole Premium Penthouse</h4>
            <div className="hero__card-specs">
              <span>3 Beds</span>
              <span className="hero__card-dot">·</span>
              <span>3 Baths</span>
              <span className="hero__card-dot">·</span>
              <span>210 m²</span>
            </div>
            <div className="hero__card-price">ETB 15,000,000</div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="hero__stats">
        <div className="container">
          <div className="hero__stats-grid">
            {stats.map((stat, i) => (
              <div key={i} className="hero__stat">
                <div className="hero__stat-icon">{stat.icon}</div>
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
