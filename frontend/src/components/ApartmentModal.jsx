import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaTimes,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaBuilding,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaPhone,
  FaWhatsapp,
  FaCheckCircle,
} from 'react-icons/fa';
import './ApartmentModal.css';
import { normalizeImageUrl } from '../utils/normalizeImageUrl';

function formatETB(n) {
  return new Intl.NumberFormat('en-ET').format(n);
}

const amenityIcons = {
  'Swimming Pool': '🏊',
  Gym: '💪',
  '24/7 Security': '🔒',
  Parking: '🚗',
  Concierge: '🛎️',
  'Rooftop Terrace': '🌆',
  'High-Speed Internet': '📶',
  'Backup Generator': '⚡',
  'Private Terrace': '🌿',
  'Valet Parking': '🚘',
  'Smart Home System': '🏠',
  'Wine Cellar': '🍷',
  Jacuzzi: '🛁',
  Sauna: '🧖',
  'Rooftop Garden': '🌺',
  'Children Playground': '🎠',
  'Business Center': '💼',
  'Laundry Service': '👕',
  'Meeting Rooms': '📋',
  'Private Pool': '🏊',
  'Butler Service': '🤵',
  Garden: '🌳',
  'Private Garden': '🌻',
  'BBQ Area': '🔥',
  'Rooftop Bar': '🍸',
  Spa: '💆',
};

export default function ApartmentModal({ apartment, onClose }) {
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();

  const images = Array.isArray(apartment.images) ? apartment.images : [];
  const amenities = Array.isArray(apartment.amenities)
    ? apartment.amenities
    : [];

  const prevImage = useCallback(() => {
    setCurrentImage((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const nextImage = useCallback(() => {
    setCurrentImage((i) => (i + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose, prevImage, nextImage]);

  const handleInquire = () => {
    onClose();
    navigate('/contact', {
      state: { apartmentTitle: apartment.title, apartmentId: apartment.id },
    });
  };

  return (
    <div
      className="modal-overlay animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="modal animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button className="modal__close" onClick={onClose} aria-label="Close">
          <FaTimes />
        </button>

        <div className="modal__inner">
          {/* Gallery */}
          <div className="modal__gallery">
            <div className="modal__gallery-main">
              <img
                src={
                  normalizeImageUrl(images[currentImage]) ||
                  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
                }
                alt={`${apartment.title} - ${currentImage + 1}`}
                className="modal__gallery-img"
              />
              {apartment.is_featured && (
                <div className="modal__featured-badge">
                  <FaStar /> Featured
                </div>
              )}
              <div className="modal__badge-sale">FOR SALE</div>
              {images.length > 1 && (
                <>
                  <button
                    className="modal__nav modal__nav--prev"
                    onClick={prevImage}
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    className="modal__nav modal__nav--next"
                    onClick={nextImage}
                  >
                    <FaChevronRight />
                  </button>
                  <div className="modal__counter">
                    {currentImage + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="modal__thumbs">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`modal__thumb ${i === currentImage ? 'modal__thumb--active' : ''}`}
                    onClick={() => setCurrentImage(i)}
                  >
                    <img src={normalizeImageUrl(img)} alt={`View ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="modal__details">
            <div className="modal__details-scroll">
              <div className="modal__location">
                <FaMapMarkerAlt /> {apartment.location_name}
              </div>
              <h2 className="modal__title">{apartment.title}</h2>

              <div className="modal__price-block">
                <span className="modal__price-etb">
                  ETB {formatETB(apartment.price_etb)}
                </span>
                {apartment.price_usd && (
                  <span className="modal__price-usd">
                    ≈ $
                    {new Intl.NumberFormat('en-US').format(apartment.price_usd)}
                  </span>
                )}
              </div>

              {/* Specs */}
              <div className="modal__specs">
                <div className="modal__spec">
                  <FaBed />
                  <div>
                    <span className="modal__spec-val">
                      {apartment.bedrooms}
                    </span>
                    <span className="modal__spec-lbl">Bedrooms</span>
                  </div>
                </div>
                <div className="modal__spec">
                  <FaBath />
                  <div>
                    <span className="modal__spec-val">
                      {apartment.bathrooms}
                    </span>
                    <span className="modal__spec-lbl">Bathrooms</span>
                  </div>
                </div>
                <div className="modal__spec">
                  <FaRulerCombined />
                  <div>
                    <span className="modal__spec-val">
                      {apartment.size_sqm}
                    </span>
                    <span className="modal__spec-lbl">m² Area</span>
                  </div>
                </div>
                {apartment.floor && (
                  <div className="modal__spec">
                    <FaBuilding />
                    <div>
                      <span className="modal__spec-val">
                        {apartment.floor}/{apartment.total_floors}
                      </span>
                      <span className="modal__spec-lbl">Floor</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {apartment.description && (
                <div className="modal__section">
                  <h4 className="modal__section-title">About This Property</h4>
                  <p className="modal__desc">{apartment.description}</p>
                </div>
              )}

              {/* Amenities */}
              {amenities.length > 0 && (
                <div className="modal__section">
                  <h4 className="modal__section-title">Amenities & Features</h4>
                  <div className="modal__amenities">
                    {amenities.map((a, i) => (
                      <div key={i} className="modal__amenity">
                        <span className="modal__amenity-icon">
                          {amenityIcons[a] || <FaCheckCircle />}
                        </span>
                        <span>{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="modal__cta">
              <button
                className="modal__cta-btn modal__cta-btn--gold"
                onClick={handleInquire}
              >
                <FaPhone /> Inquire Now
              </button>
              {/* <a
                href={`https://wa.me/251911234567?text=I'm interested in ${encodeURIComponent(apartment.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="modal__cta-btn modal__cta-btn--whatsapp"
              >
                <FaWhatsapp /> WhatsApp
              </a> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
