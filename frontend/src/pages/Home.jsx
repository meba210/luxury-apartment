import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Hero from '../components/Hero';
import ApartmentCard from '../components/ApartmentCard';
import ApartmentModal from '../components/ApartmentModal';
import FilterBar from '../components/FilterBar';
import LocationSection from '../components/LocationSection';
import ContactForm from '../components/ContactForm';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  FaArrowRight,
  FaStar,
  FaQuoteLeft,
  FaCheckCircle,
  FaHandshake,
  FaAward,
  FaShieldAlt,
  FaUsers,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import './Home.css';

const initialRatingForm = {
  apartment_id: '',
  name: '',
  stars: 5,
  comment: '',
};

const testimonials = [
  {
    name: 'Biruk T.',
    role: 'Property Investor',
    avatar: 'https://i.pravatar.cc/60?img=11',
    stars: 5,
    text: 'MILEVIA Estates helped me find the perfect investment property. Their team is professional, trustworthy, and always available.',
  },
 
];

const whyUs = [
  {
    icon: <FaAward />,
    title: 'Premium Quality',
    desc: 'Every property meets our rigorous standards for luxury finishes, modern amenities, and exceptional craftsmanship.',
  },
  {
    icon: <FaMapMarkerAlt />,
    title: 'Prime Locations',
    desc: "Strategically located in Addis Ababa's most sought-after neighborhoods — Bole, Kazanchis, Sarbet and more.",
  },
  {
    icon: <FaShieldAlt />,
    title: '24/7 Security',
    desc: 'Round-the-clock security, CCTV surveillance, and professional concierge services for your peace of mind.',
  },
  {
    icon: <FaUsers />,
    title: 'Trusted Service',
    desc: 'Our dedicated team provides personalized service from property viewing to move-in and beyond.',
  },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [allApts, setAllApts] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [ratingMessage, setRatingMessage] = useState('');
  const [selectedApt, setSelectedApt] = useState(null);
  const [ratingForm, setRatingForm] = useState(initialRatingForm);
  const [filters] = useState({
    bedrooms: '',
    location_id: '',
    min_price: '',
    max_price: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      axios.get(`${import.meta.env.VITE_API_URL}/api/apartments?featured=true`),
      axios.get(`${import.meta.env.VITE_API_URL}/api/apartments`),
      axios.get(`${import.meta.env.VITE_API_URL}/api/ratings`),
    ])
      .then(([featRes, allRes, ratingRes]) => {
        const apartments = allRes.data.data || [];
        setFeatured(featRes.data.data || []);
        setAllApts(apartments);
        setRatings(ratingRes.data.data || []);
        if (apartments.length && !ratingForm.apartment_id) {
          setRatingForm((prev) => ({
            ...prev,
            apartment_id: String(apartments[0].id),
          }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (f) => {
    const params = new URLSearchParams();
    if (f.bedrooms) params.set('bedrooms', f.bedrooms);
    if (f.location_id) params.set('location_id', f.location_id);
    if (f.min_price) params.set('min_price', f.min_price);
    if (f.max_price) params.set('max_price', f.max_price);
    navigate(`/apartments?${params.toString()}`);
  };

  const handleRatingChange = (e) => {
    const { name, value } = e.target;
    setRatingForm((prev) => ({
      ...prev,
      [name]: name === 'stars' ? Number(value) : value,
    }));
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    setRatingMessage('');

    if (!ratingForm.apartment_id || !ratingForm.name.trim()) {
      setRatingMessage('Please choose a property and enter your name.');
      return;
    }

    try {
      setRatingSubmitting(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/ratings`, {
        apartment_id: Number(ratingForm.apartment_id),
        name: ratingForm.name.trim(),
        stars: Number(ratingForm.stars),
        comment: ratingForm.comment.trim(),
      });

      const ratingRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/ratings`
      );
      setRatings(ratingRes.data.data || []);
      setRatingForm({
        ...initialRatingForm,
        apartment_id: ratingForm.apartment_id,
      });
      setRatingMessage(
        'Thanks for your review — it has been saved successfully.'
      );
    } catch (error) {
      setRatingMessage(
        error?.response?.data?.message ||
          'Unable to save your review right now.'
      );
    } finally {
      setRatingSubmitting(false);
    }
  };

  const visibleRatings = ratings.slice(0, 3);

  return (
    <div className="home">
      {/* ① DARK — Hero */}
      <Hero />

      {/* ② DARK — Search / Filter (sits right under hero, same dark tone) */}
      <FilterBar
        filters={filters}
        onChange={handleSearch}
        count={allApts.length}
      />

      {/* ③ CREAM — Featured Properties */}
      <section className="home__featured section section--cream">
        <div className="container">
          <div className="home__featured-header">
            <div>
              <span className="overline">Handpicked for You</span>
              <h2>FEATURED PROPERTIES</h2>
              <div
                className="gold-divider"
                style={{
                  margin: '10px 0 0',
                  background:
                    'linear-gradient(90deg,var(--gold-dark),var(--gold))',
                }}
              />
            </div>
            <Link to="/apartments" className="btn btn-outline-brown btn-sm">
              VIEW ALL PROPERTIES <FaArrowRight />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading properties..." />
          ) : (
            <div className="home__featured-grid">
              {featured.slice(0, 4).map((apt) => (
                <ApartmentCard
                  key={apt.id}
                  apartment={apt}
                  onClick={() => setSelectedApt(apt)}
                  cream
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ④ DARK — Why Choose Us */}
      <section className="home__why section">
        <div className="container">
          <div className="section-header">
            <span className="overline">Why Choose Us</span>
            <h2>THE MILEVIA DIFFERENCE</h2>
            <div className="gold-divider" />
            <p>
              We combine deep local knowledge with world-class service to
              deliver an unmatched real estate experience.
            </p>
          </div>
          <div className="home__why-grid">
            {whyUs.map((item, i) => (
              <div key={i} className="home__why-card">
                <div className="home__why-icon">{item.icon}</div>
                <h3 className="home__why-title">{item.title}</h3>
                <p className="home__why-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⑤ CREAM — Partner Banner */}
      <section className="home__partner section--cream">
        <div className="home__partner-bg">
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1400&q=80"
            alt="Partnership"
            className="home__partner-img"
          />
          <div className="home__partner-overlay" />
        </div>
        <div className="container">
          <div className="home__partner-inner">
            <div className="home__partner-content">
              <span className="overline" style={{ color: 'var(--gold-light)' }}>
                Join Our Network
              </span>
              <h2 className="home__partner-title">
                BECOME A MILEVIA ESTATES PARTNER
              </h2>
              <div className="home__partner-items">
                <div className="home__partner-item">
                  <FaCheckCircle className="home__partner-check" />
                  <div>
                    <strong>Bring a Property</strong>
                    <span>→ Earn Seller Commission</span>
                  </div>
                </div>
                <div className="home__partner-item">
                  <FaCheckCircle className="home__partner-check" />
                  <div>
                    <strong>Bring a Buyer</strong>
                    <span>→ Earn up to 75% Buyer Commission</span>
                  </div>
                </div>
              </div>
              <Link to="/partner/register" className="btn btn-gold btn-lg">
                <FaHandshake /> JOIN OUR PARTNER NETWORK
              </Link>
            </div>
            <div className="home__partner-badge">
              <div className="home__partner-badge-inner">
                <div className="home__partner-badge-icon">
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
                <p className="home__partner-badge-text">GROW TOGETHER,</p>
                <p className="home__partner-badge-text home__partner-badge-text--gold">
                  SUCCEED TOGETHER
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ⑥ DARK — Locations */}
      <LocationSection
        onLocationClick={(id) => navigate(`/apartments?location_id=${id}`)}
      />

      {/* ⑦ CREAM — Stats Banner */}
      <section className="home__stats-banner section--cream">
        <div className="container">
          <div className="home__stats-banner-grid">
            {[
              {
                value: '150+',
                label: 'Premium Properties',
                sub: 'Across Addis Ababa',
              },
              {
                value: '6',
                label: 'Prime Locations',
                sub: 'In the best neighborhoods',
              },
              { value: '50+', label: 'Happy Residents', sub: 'And counting' },
              {
                value: '5★',
                label: 'Client Rating',
                sub: 'Consistently excellent',
              },
            ].map((stat, i) => (
              <div key={i} className="home__stats-banner-item">
                <span className="home__stats-banner-value">{stat.value}</span>
                <span className="home__stats-banner-label">{stat.label}</span>
                <span className="home__stats-banner-sub">{stat.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⑧ DARK — Real Customer Ratings */}
      <section className="home__testimonials section">
        <div className="container">
          <div className="section-header">
            <span className="overline">Real Customer Reviews</span>
            <h2>WHAT OUR CLIENTS SAY</h2>
            <div className="gold-divider" />
            <p>
              These reviews come directly from our live customer rating system.
            </p>
          </div>

          <div className="home__testimonials-grid">
            {visibleRatings.length ? (
              visibleRatings.map((t) => (
                <article key={t.id} className="testimonial-card">
                  <div className="testimonial-card__stars">
                    {Array.from({ length: t.stars || 0 }).map((_, s) => (
                      <FaStar key={s} />
                    ))}
                  </div>
                  <FaQuoteLeft className="testimonial-card__quote" />
                  <p className="testimonial-card__text">
                    {t.comment || 'No written comment provided.'}
                  </p>
                  <div className="testimonial-card__author">
                    <div className="testimonial-card__avatar-badge">
                      {(t.name || 'C').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="testimonial-card__name">
                        {t.name || 'Customer'}
                      </span>
                      <span className="testimonial-card__role">
                        {t.apartment_title || 'Luxury Apartment Review'}
                      </span>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="home__testimonials-empty">
                No reviews have been submitted yet. Be the first to add one
                below.
              </div>
            )}
          </div>

          <div className="home__rating-card">
            <div>
              <span className="overline">Leave a real review</span>
              <h3>Share your experience</h3>
              <p>Submit a real rating and comment for one of our properties.</p>
            </div>

            <form className="home__rating-form" onSubmit={handleRatingSubmit}>
              <label>
                Property
                <select
                  name="apartment_id"
                  value={ratingForm.apartment_id}
                  onChange={handleRatingChange}
                  required
                >
                  {allApts.map((apt) => (
                    <option key={apt.id} value={apt.id}>
                      {apt.title}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Your name
                <input
                  type="text"
                  name="name"
                  value={ratingForm.name}
                  onChange={handleRatingChange}
                  placeholder="Enter your name"
                  required
                />
              </label>

              <label>
                Rating
                <select
                  name="stars"
                  value={ratingForm.stars}
                  onChange={handleRatingChange}
                >
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option key={value} value={value}>
                      {value} star{value > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Comment
                <textarea
                  name="comment"
                  value={ratingForm.comment}
                  onChange={handleRatingChange}
                  rows="4"
                  placeholder="Tell us about your experience"
                />
              </label>

              <button
                type="submit"
                className="btn btn-gold"
                disabled={ratingSubmitting}
              >
                {ratingSubmitting ? 'Saving review...' : 'Submit Review'}
              </button>
            </form>

            {ratingMessage && (
              <p className="home__rating-message">{ratingMessage}</p>
            )}
          </div>
        </div>
      </section>

      {/* ⑨ CREAM — Contact */}
      <section className="home__contact section section--cream" id="contact">
        <div className="container">
          <div className="home__contact-inner">
            <div className="home__contact-info">
              <span className="overline">Get In Touch</span>
              <h2>Ready to Find Your Dream Home?</h2>
              <div
                className="gold-divider"
                style={{
                  margin: '12px 0',
                  background:
                    'linear-gradient(90deg,var(--gold-dark),var(--gold))',
                }}
              />
              <p>
                Our expert team is ready to help you find the perfect luxury
                apartment in Addis Ababa. Schedule a viewing or ask us anything.
              </p>
              <div className="home__contact-details">
                <div className="home__contact-detail">
                  <span className="home__contact-detail-label">📞 Call Us</span>
                  <a
                    href="tel:+251935584767"
                    className="home__contact-detail-value"
                  >
                    +251 935584767
                  </a>
                </div>
                <div className="home__contact-detail">
                  <span className="home__contact-detail-label">
                    ✉️ Email Us
                  </span>
                  <a
                    href="mailto:minilikab4@gmail.com"
                    className="home__contact-detail-value"
                  >
                    minilikab4@gmail.com
                  </a>
                </div>
                {/* <div className="home__contact-detail">
                  <span className="home__contact-detail-label">
                    📍 Visit Us
                  </span>
                  <span className="home__contact-detail-value">
                    Bole, Addis Ababa, Ethiopia
                  </span>
                </div> */}
              </div>
            </div>
            <div className="home__contact-form-wrap">
              <ContactForm apartments={allApts} />
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedApt && (
        <ApartmentModal
          apartment={selectedApt}
          onClose={() => setSelectedApt(null)}
        />
      )}
    </div>
  );
}
