import { FaBed, FaBath, FaCar, FaMapMarkerAlt, FaEye } from 'react-icons/fa';
import './ApartmentCard.css';

function formatETB(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return String(n);
}

export default function ApartmentCard({ apartment, onClick }) {
  const images = Array.isArray(apartment.images) ? apartment.images : [];
  const imgSrc =
    images[0] ||
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600';
  const img = imgSrc.startsWith('/uploads/')
    ? `http://localhost:5000${imgSrc}`
    : imgSrc;

  return (
    <div
      className="apt-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      {/* Image */}
      <div className="apt-card__img-wrap">
        <img
          src={img}
          alt={apartment.title}
          className="apt-card__img"
          loading="lazy"
        />
        <div className="apt-card__img-overlay" />

        {/* Badges */}
        <div className="apt-card__badges">
          <span className="apt-card__badge apt-card__badge--sale">
            FOR SALE
          </span>
          {apartment.is_featured && (
            <span className="apt-card__badge apt-card__badge--featured">
              FEATURED
            </span>
          )}
        </div>

        {/* View overlay */}
        <div className="apt-card__view-overlay">
          <span className="apt-card__view-btn">
            <FaEye /> View Details
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="apt-card__body">
        <div className="apt-card__location">
          <FaMapMarkerAlt />
          <span>{apartment.location_name}</span>
        </div>

        <h3 className="apt-card__title">{apartment.title}</h3>

        {/* Specs */}
        <div className="apt-card__specs">
          <div className="apt-card__spec">
            <FaBed />
            <span>{apartment.bedrooms} Beds</span>
          </div>
          <div className="apt-card__spec">
            <FaBath />
            <span>{apartment.bathrooms} Baths</span>
          </div>
          <div className="apt-card__spec">
            <FaCar />
            <span>1 Parking</span>
          </div>
        </div>

        {/* Price */}
        <div className="apt-card__price">
          {formatETB(apartment.price_etb)}&nbsp;ETB
        </div>

        <button className="apt-card__btn">VIEW DETAILS</button>
      </div>
    </div>
  );
}
