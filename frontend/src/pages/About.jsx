import { FaAward, FaShieldAlt, FaHandshake, FaUsers, FaBuilding, FaMapMarkerAlt } from 'react-icons/fa'
import './About.css'

const values = [
  { icon: <FaAward />, title: 'Excellence', desc: 'We maintain the highest standards in every property we list and every service we provide.' },
  { icon: <FaShieldAlt />, title: 'Integrity', desc: 'Transparent dealings, honest pricing, and trustworthy guidance at every step.' },
  { icon: <FaHandshake />, title: 'Partnership', desc: 'We build lasting relationships with clients, investors, and partners across Ethiopia.' },
  { icon: <FaUsers />, title: 'Client First', desc: 'Your satisfaction is our priority. We go above and beyond to exceed expectations.' },
]

const team = [
  { name: 'Abebe Girma', role: 'CEO & Founder', img: 'https://i.pravatar.cc/200?img=12' },
  { name: 'Tigist Haile', role: 'Head of Sales', img: 'https://i.pravatar.cc/200?img=47' },
  { name: 'Dawit Bekele', role: 'Investment Advisor', img: 'https://i.pravatar.cc/200?img=15' },
  { name: 'Meron Tadesse', role: 'Property Manager', img: 'https://i.pravatar.cc/200?img=32' },
]

export default function About() {
  return (
    <div className="about-page">
      {/* Header */}
      <div className="about-page__header">
        <div className="about-page__header-bg">
          <img
            src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1400&q=80"
            alt="About us"
            className="about-page__header-img"
          />
          <div className="about-page__header-overlay" />
        </div>
        <div className="container">
          <div className="about-page__header-content">
            <span className="overline" style={{ color: 'var(--gold-light)' }}>Our Story</span>
            <h1 className="about-page__title">ABOUT MILEVIA</h1>
            <p className="about-page__subtitle">
              Addis Ababa's most trusted luxury real estate partner
            </p>
          </div>
        </div>
      </div>

      {/* Story */}
      <section className="about-page__story section">
        <div className="container">
          <div className="about-page__story-inner">
            <div className="about-page__story-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=700&q=80"
                alt="Addis Ababa skyline"
                className="about-page__story-img"
              />
              <div className="about-page__story-badge">
                <span className="about-page__story-badge-num">10+</span>
                <span className="about-page__story-badge-txt">Years of Excellence</span>
              </div>
            </div>
            <div className="about-page__story-content">
              <span className="overline">Who We Are</span>
              <h2>Redefining Luxury Real Estate in Addis Ababa</h2>
              <div className="gold-divider" style={{ margin: '12px 0' }} />
              <p>
                MILEVIA Estates was founded with a singular vision: to connect discerning clients
                with the finest properties in Addis Ababa. Over the past decade, we have grown to become
                the city's most trusted name in premium real estate.
              </p>
              <p style={{ marginTop: '14px' }}>
                From the diplomatic enclave of Kazanchis to the vibrant streets of Bole, we curate
                an exclusive portfolio of 2 and 3 bedroom apartments that meet the highest standards
                of luxury, comfort, and investment value.
              </p>
              <div className="about-page__story-stats">
                {[
                  { val: '150+', lbl: 'Properties Listed' },
                  { val: '200+', lbl: 'Happy Clients' },
                  { val: '6', lbl: 'Prime Locations' },
                  { val: '25+', lbl: 'Partner Agents' },
                ].map((s, i) => (
                  <div key={i} className="about-page__story-stat">
                    <span className="about-page__story-stat-val">{s.val}</span>
                    <span className="about-page__story-stat-lbl">{s.lbl}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about-page__values section">
        <div className="container">
          <div className="section-header">
            <span className="overline">What Drives Us</span>
            <h2>OUR CORE VALUES</h2>
            <div className="gold-divider" />
          </div>
          <div className="about-page__values-grid">
            {values.map((v, i) => (
              <div key={i} className="about-page__value-card">
                <div className="about-page__value-icon">{v.icon}</div>
                <h3 className="about-page__value-title">{v.title}</h3>
                <p className="about-page__value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="about-page__team section">
        <div className="container">
          <div className="section-header">
            <span className="overline">The People Behind It</span>
            <h2>MEET OUR TEAM</h2>
            <div className="gold-divider" />
          </div>
          <div className="about-page__team-grid">
            {team.map((member, i) => (
              <div key={i} className="about-page__team-card">
                <div className="about-page__team-img-wrap">
                  <img src={member.img} alt={member.name} className="about-page__team-img" />
                  <div className="about-page__team-overlay" />
                </div>
                <div className="about-page__team-info">
                  <h4 className="about-page__team-name">{member.name}</h4>
                  <span className="about-page__team-role">{member.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
