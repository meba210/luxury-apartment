import { useLocation } from 'react-router-dom';
import ContactForm from '../components/ContactForm';
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaClock,
} from 'react-icons/fa';
import './Contact.css';

const contactDetails = [
  {
    icon: <FaPhone />,
    title: 'Call Us',
    lines: ['+251 935584767', '+251 9963320937'],
    href: 'tel:+251 935584767',
    href: 'tel:+251 9963320937',
  },

  {
    icon: <FaEnvelope />,
    title: 'Email Us',
    lines: ['minilikab4@gmail.com'],
    href: 'mailto:minilikab4@gmail.com',
  },

  {
    icon: <FaClock />,
    title: 'Working Hours',
    lines: ['Mon – Fri: 8:00 AM – 6:00 PM', 'Sat: 9:00 AM – 4:00 PM'],
  },
];

export default function Contact() {
  const location = useLocation();
  const state = location.state || {};

  return (
    <div className="contact-page">
      {/* Header */}
      <div className="contact-page__header">
        <div className="contact-page__header-bg">
          <img
            src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1400&q=80"
            alt="Contact"
            className="contact-page__header-img"
          />
          <div className="contact-page__header-overlay" />
        </div>
        <div className="container">
          <div className="contact-page__header-content">
            <span className="overline" style={{ color: 'var(--gold-light)' }}>
              We're Here to Help
            </span>
            <h1 className="contact-page__title">CONTACT US</h1>
            <p className="contact-page__subtitle">
              Reach out to our team and we'll get back to you within 24 hours
            </p>
          </div>
        </div>
      </div>

      {/* Main */}
      <section className="contact-page__main section">
        <div className="container">
          <div className="contact-page__inner">
            {/* Info */}
            <div className="contact-page__info">
              <span className="overline">Get In Touch</span>
              <h2>Let's Find Your Perfect Property</h2>
              <div className="gold-divider" style={{ margin: '12px 0 20px' }} />
              <p>
                Whether you're looking to buy, rent, or invest in Addis Ababa's
                luxury real estate market, our expert team is ready to guide you
                every step of the way.
              </p>

              <div className="contact-page__details">
                {contactDetails.map((d, i) => (
                  <div key={i} className="contact-page__detail">
                    <div className="contact-page__detail-icon">{d.icon}</div>
                    <div>
                      <span className="contact-page__detail-title">
                        {d.title}
                      </span>
                      {d.lines.map((line, j) =>
                        d.href ? (
                          <a
                            key={j}
                            href={d.href}
                            className="contact-page__detail-line"
                          >
                            {line}
                          </a>
                        ) : (
                          <span key={j} className="contact-page__detail-line">
                            {line}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="contact-page__form-wrap">
              <div className="contact-page__form-header">
                <h3>Send Us a Message</h3>
                <p>Fill out the form and our team will contact you shortly.</p>
              </div>
              <ContactForm
                preselectedId={state.apartmentId}
                preselectedTitle={state.apartmentTitle}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      {/* <section className="contact-page__map">
        <div className="contact-page__map-inner">
          <div className="contact-page__map-placeholder">
            <div className="contact-page__map-content">
              <FaMapMarkerAlt className="contact-page__map-icon" />
              <h3>Bole, Addis Ababa</h3>
              <p>Bole Sub-City, Woreda 03, Addis Ababa, Ethiopia</p>
              <a
                href="https://maps.google.com/?q=Bole,Addis+Ababa,Ethiopia"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold btn-sm"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
}
