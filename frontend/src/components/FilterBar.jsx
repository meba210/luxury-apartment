import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaSearch,
  FaBed,
  FaTag,
  FaMapMarkerAlt,
  FaTimes,
} from 'react-icons/fa';
import './FilterBar.css';

// Only 2+ bedrooms — live properties for sale only
const bedroomOptions = [
  { value: '', label: 'All Properties' },
  { value: '2', label: '2 Bedroom Property' },
  { value: '3', label: '3 Bedroom Property' },
  { value: '4', label: '4+ Bedroom Property' },
];

const priceRanges = [
  { label: 'All Prices', min: null, max: null },
  { label: 'Under 8M ETB', min: null, max: 8000000 },
  { label: '8M – 12M ETB', min: 8000000, max: 12000000 },
  { label: '12M – 18M ETB', min: 12000000, max: 18000000 },
  { label: '18M – 30M ETB', min: 18000000, max: 30000000 },
  { label: '30M+ ETB', min: 30000000, max: null },
];

export default function FilterBar({ filters, onChange, count }) {
  const [locations, setLocations] = useState([]);
  const [local, setLocal] = useState(filters);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/apartments/meta/locations`)
      .then((r) => setLocations(r.data.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLocal(filters);
  }, [filters]);

  const handleSearch = () => onChange(local);

  const handleClear = () => {
    const cleared = {
      bedrooms: '',
      location_id: '',
      min_price: '',
      max_price: '',
    };
    setLocal(cleared);
    onChange(cleared);
  };

  const hasFilters =
    local.bedrooms || local.location_id || local.min_price || local.max_price;

  const activePriceIdx = priceRanges.findIndex(
    (r) =>
      (r.min ? String(r.min) : '') === local.min_price &&
      (r.max ? String(r.max) : '') === local.max_price
  );

  const handlePriceRange = (range) => {
    setLocal((prev) => ({
      ...prev,
      min_price: range.min ? String(range.min) : '',
      max_price: range.max ? String(range.max) : '',
    }));
  };

  return (
    <section className="filterbar">
      <div className="container">
        <div className="filterbar__header">
          <h2 className="filterbar__title">FIND YOUR PERFECT PROPERTY</h2>
          <p className="filterbar__subtitle">
            Premium 2, 3 &amp; 4+ bedroom residences for sale across Addis Ababa
          </p>
        </div>

        <div className="filterbar__grid">
          {/* By Bedroom */}
          <div className="filterbar__col">
            <div className="filterbar__col-header">
              <FaBed className="filterbar__col-icon" />
              <span>BEDROOMS</span>
            </div>
            <ul className="filterbar__list">
              {bedroomOptions.map((opt) => (
                <li key={opt.value}>
                  <label
                    className={`filterbar__radio ${local.bedrooms === opt.value ? 'filterbar__radio--active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="bedrooms"
                      value={opt.value}
                      checked={local.bedrooms === opt.value}
                      onChange={() =>
                        setLocal((p) => ({ ...p, bedrooms: opt.value }))
                      }
                    />
                    <span className="filterbar__radio-dot" />
                    {opt.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* By Price Range */}
          <div className="filterbar__col">
            <div className="filterbar__col-header">
              <FaTag className="filterbar__col-icon" />
              <span>PRICE RANGE</span>
            </div>
            <ul className="filterbar__list">
              {priceRanges.map((range, i) => (
                <li key={i}>
                  <label
                    className={`filterbar__radio ${activePriceIdx === i ? 'filterbar__radio--active' : ''}`}
                    onClick={() => handlePriceRange(range)}
                  >
                    <input
                      type="radio"
                      name="price"
                      readOnly
                      checked={activePriceIdx === i}
                    />
                    <span className="filterbar__radio-dot" />
                    {range.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* By Location */}
          <div className="filterbar__col">
            <div className="filterbar__col-header">
              <FaMapMarkerAlt className="filterbar__col-icon" />
              <span>LOCATION</span>
            </div>
            <ul className="filterbar__list">
              <li>
                <label
                  className={`filterbar__radio ${!local.location_id ? 'filterbar__radio--active' : ''}`}
                >
                  <input
                    type="radio"
                    name="location"
                    value=""
                    checked={!local.location_id}
                    onChange={() =>
                      setLocal((p) => ({ ...p, location_id: '' }))
                    }
                  />
                  <span className="filterbar__radio-dot" />
                  All Locations
                </label>
              </li>
              {locations.map((loc) => (
                <li key={loc.id}>
                  <label
                    className={`filterbar__radio ${local.location_id === String(loc.id) ? 'filterbar__radio--active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="location"
                      value={loc.id}
                      checked={local.location_id === String(loc.id)}
                      onChange={() =>
                        setLocal((p) => ({ ...p, location_id: String(loc.id) }))
                      }
                    />
                    <span className="filterbar__radio-dot" />
                    {loc.name}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* What We Offer */}
          <div className="filterbar__col filterbar__col--info">
            <div className="filterbar__col-header">
              <FaBed className="filterbar__col-icon" />
              <span>WHAT WE OFFER</span>
            </div>
            <div className="filterbar__offer-list">
              {[
                { icon: '🏢', text: '2 Bedroom Apartments' },
                { icon: '🏢', text: '3 Bedroom Apartments' },
                { icon: '🏢', text: '4+ Bedroom Apartments' },
                { icon: '🏙️', text: 'Duplex Apartments' },
                { icon: '🏙️', text: 'Luxury Penthouses' },
                { icon: '✅', text: 'For Sale Only' },
                { icon: '📍', text: 'Prime Addis Locations' },
              ].map((item, i) => (
                <div key={i} className="filterbar__offer-item">
                  <span className="filterbar__offer-icon">{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="filterbar__actions">
          {hasFilters && (
            <button className="filterbar__clear" onClick={handleClear}>
              <FaTimes /> Clear Filters
            </button>
          )}
          <button className="filterbar__search-btn" onClick={handleSearch}>
            <FaSearch />
            SEARCH PROPERTIES
            {count !== undefined && (
              <span className="filterbar__count">({count} found)</span>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
