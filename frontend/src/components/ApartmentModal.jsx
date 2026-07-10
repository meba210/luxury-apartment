import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaTimes, FaBed, FaBath, FaRulerCombined,
  FaMapMarkerAlt, FaBuilding, FaChevronLeft,
  FaChevronRight, FaStar, FaPhone, FaCheckCircle,
  FaPlay, FaExternalLinkAlt,
} from 'react-icons/fa';
import { SiTelegram } from 'react-icons/si';
import './ApartmentModal.css';

/* ─── helpers ─────────────────────────────────────────── */
const formatETB = n => new Intl.NumberFormat('en-ET').format(n);

/**
 * Given a URL, return the display metadata for the video link button.
 * Telegram links get their own branding; everything else gets a generic style.
 */
function getVideoMeta(url, index) {
  const u = (url || '').toLowerCase();

  if (u.includes('t.me') || u.includes('telegram.me') || u.includes('telegram.org')) {
    return {
      platform: 'telegram',
      label: `Watch on Telegram — Video ${index + 1}`,
      color: '#2AABEE',          // Telegram blue
      bg:    'rgba(42,171,238,0.1)',
      icon:  'telegram',
    };
  }
  if (u.includes('youtube.com') || u.includes('youtu.be')) {
    return { platform: 'youtube',   label: `YouTube Tour ${index + 1}`,  color: '#FF0000', bg: 'rgba(255,0,0,0.08)',   icon: 'play' };
  }
  if (u.includes('tiktok.com')) {
    return { platform: 'tiktok',    label: `TikTok Tour ${index + 1}`,   color: '#69C9D0', bg: 'rgba(105,201,208,0.1)', icon: 'play' };
  }
  if (u.includes('instagram.com')) {
    return { platform: 'instagram', label: `Instagram Tour ${index + 1}`,color: '#C13584', bg: 'rgba(193,53,132,0.08)', icon: 'play' };
  }
  if (u.includes('facebook.com') || u.includes('fb.watch')) {
    return { platform: 'facebook',  label: `Facebook Video ${index + 1}`,color: '#1877F2', bg: 'rgba(24,119,242,0.08)', icon: 'play' };
  }
  return {
    platform: 'other',
    label: `Property Video ${index + 1}`,
    color: '#C9A84C',
    bg:    'rgba(201,168,76,0.08)',
    icon:  'play',
  };
}

const amenityIcons = {
  'Swimming Pool':'🏊','Gym':'💪','24/7 Security':'🔒',
  'Parking':'🚗','Concierge':'🛎️','Rooftop Terrace':'🌆',
  'High-Speed Internet':'📶','Backup Generator':'⚡',
  'Private Terrace':'🌿','Valet Parking':'🚘',
  'Smart Home System':'🏠','Wine Cellar':'🍷',
  'Jacuzzi':'🛁','Sauna':'🧖','Rooftop Garden':'🌺',
  'Children Playground':'🎠','Business Center':'💼',
  'Laundry Service':'👕','Meeting Rooms':'📋',
  'Private Pool':'🏊','Butler Service':'🤵',
  'Garden':'🌳','Private Garden':'🌻',
  'BBQ Area':'🔥','Rooftop Bar':'🍸','Spa':'💆',
};

/* ─── VideoLinkButton ─────────────────────────────────── */
function VideoLinkButton({ url, index }) {
  const meta = getVideoMeta(url, index);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="modal__video-link"
      style={{
        '--vlink-color': meta.color,
        '--vlink-bg':    meta.bg,
      }}
      aria-label={meta.label}
    >
      {/* Icon */}
      <span className="modal__video-link__icon">
        {meta.icon === 'telegram'
          ? <SiTelegram />
          : <FaPlay style={{ fontSize: '0.6rem' }} />
        }
      </span>

      {/* Label */}
      <span className="modal__video-link__label">{meta.label}</span>

      {/* External arrow */}
      <FaExternalLinkAlt className="modal__video-link__ext" />
    </a>
  );
}

/* ─── ApartmentModal ──────────────────────────────────── */
export default function ApartmentModal({ apartment, onClose }) {
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();

  const images     = Array.isArray(apartment.images)      ? apartment.images      : [];
  const amenities  = Array.isArray(apartment.amenities)   ? apartment.amenities   : [];
  const videoLinks = Array.isArray(apartment.video_links)
    ? apartment.video_links.filter(Boolean)
    : [];

  const prevImage = useCallback(() => {
    setCurrentImage(i => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const nextImage = useCallback(() => {
    setCurrentImage(i => (i + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape')     onClose();
      if (e.key === 'ArrowLeft')  prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
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
      aria-label={`${apartment.title} details`}
    >
      <div className="modal animate-scaleIn" onClick={e => e.stopPropagation()}>

        <button className="modal__close" onClick={onClose} aria-label="Close">
          <FaTimes />
        </button>

        <div className="modal__inner">

          {/* ── LEFT: Photo gallery ── */}
          <div className="modal__gallery">
            <div className="modal__gallery-main">
              <img
                src={
                  images[currentImage] ||
                  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
                }
                alt={`${apartment.title} — photo ${currentImage + 1}`}
                className="modal__gallery-img"
              />
              {apartment.is_featured && (
                <div className="modal__featured-badge"><FaStar /> Featured</div>
              )}
              <div className="modal__badge-sale">FOR SALE</div>
              {images.length > 1 && (
                <>
                  <button className="modal__nav modal__nav--prev" onClick={prevImage}><FaChevronLeft /></button>
                  <button className="modal__nav modal__nav--next" onClick={nextImage}><FaChevronRight /></button>
                  <div className="modal__counter">{currentImage + 1} / {images.length}</div>
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
                    <img src={img} alt={`View ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Details ── */}
          <div className="modal__details">
            <div className="modal__details-scroll">

              <div className="modal__location">
                <FaMapMarkerAlt /> {apartment.location_name}
              </div>
              <h2 className="modal__title">{apartment.title}</h2>

              <div className="modal__price-block">
                <span className="modal__price-etb">ETB {formatETB(apartment.price_etb)}</span>
                {apartment.price_usd && (
                  <span className="modal__price-usd">
                    ≈ ${new Intl.NumberFormat('en-US').format(apartment.price_usd)}
                  </span>
                )}
              </div>

              {/* Specs */}
              <div className="modal__specs">
                <div className="modal__spec">
                  <FaBed />
                  <div>
                    <span className="modal__spec-val">{apartment.bedrooms}</span>
                    <span className="modal__spec-lbl">Bedrooms</span>
                  </div>
                </div>
                <div className="modal__spec">
                  <FaBath />
                  <div>
                    <span className="modal__spec-val">{apartment.bathrooms}</span>
                    <span className="modal__spec-lbl">Bathrooms</span>
                  </div>
                </div>
                {apartment.size_sqm && (
                  <div className="modal__spec">
                    <FaRulerCombined />
                    <div>
                      <span className="modal__spec-val">{apartment.size_sqm}</span>
                      <span className="modal__spec-lbl">m² Area</span>
                    </div>
                  </div>
                )}
                {apartment.floor && (
                  <div className="modal__spec">
                    <FaBuilding />
                    <div>
                      <span className="modal__spec-val">{apartment.floor}/{apartment.total_floors}</span>
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

              {/* ── VIDEO LINKS — right under description ── */}
              {videoLinks.length > 0 && (
                <div className="modal__section modal__section--videos">
                  <h4 className="modal__section-title modal__section-title--videos">
                    <SiTelegram className="modal__video-section-icon" />
                    Watch Property Tour
                  </h4>
                  <p className="modal__video-section-hint">
                    Tap a link below to watch the full video tour of this apartment.
                  </p>
                  <div className="modal__video-links-list">
                    {videoLinks.map((url, i) => (
                      <VideoLinkButton key={i} url={url} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities */}
              {amenities.length > 0 && (
                <div className="modal__section">
                  <h4 className="modal__section-title">Amenities &amp; Features</h4>
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
              <button className="modal__cta-btn modal__cta-btn--gold" onClick={handleInquire}>
                <FaPhone /> Inquire Now
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
