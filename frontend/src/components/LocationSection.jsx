import { FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa'
import './LocationSection.css'

const locations = [
  {
    name: 'Bole Rwanda',
    desc: 'Upscale diplomatic zone with luxury residences',
    img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80',
    count: 4,
    id: 1,
  },
  {
    name: 'Megenagna',
    desc: 'Vibrant commercial hub with premium apartments',
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
    count: 3,
    id: 2,
  },
  {
    name: 'Mexico Square',
    desc: 'Central business district with modern living',
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
    count: 3,
    id: 3,
  },
  {
    name: 'Kazanchis',
    desc: 'Embassy district — prestige and exclusivity',
    img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
    count: 2,
    id: 4,
  },
  {
    name: 'CMC',
    desc: 'Quiet residential area with green spaces',
    img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
    count: 2,
    id: 5,
  },
  {
    name: 'Sarbet',
    desc: 'Upscale neighborhood with fine dining nearby',
    img: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80',
    count: 2,
    id: 6,
  },
]

export default function LocationSection({ onLocationClick }) {
  return (
    <section className="locations section">
      <div className="container">
        <div className="section-header">
          <span className="overline">Explore by Area</span>
          <h2>Prime Locations in Addis Ababa</h2>
          <div className="gold-divider" />
          <p>From the diplomatic enclave of Kazanchis to the vibrant streets of Bole — find your perfect neighborhood.</p>
        </div>

        <div className="locations__grid">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="loc-card"
              onClick={() => onLocationClick && onLocationClick(loc.id)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && onLocationClick && onLocationClick(loc.id)}
            >
              <div className="loc-card__img-wrap">
                <img src={loc.img} alt={loc.name} className="loc-card__img" loading="lazy" />
                <div className="loc-card__overlay" />
              </div>
              <div className="loc-card__body">
                <div className="loc-card__count">{loc.count} Properties</div>
                <h3 className="loc-card__name">
                  <FaMapMarkerAlt className="loc-card__pin" />
                  {loc.name}
                </h3>
                <p className="loc-card__desc">{loc.desc}</p>
                <span className="loc-card__link">
                  View Properties <FaArrowRight />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
