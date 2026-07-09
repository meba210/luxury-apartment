import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaSearch,
  FaBed,
  FaTag,
  FaMapMarkerAlt,
  FaTimes,
  FaBuilding,
  FaChevronDown,
} from 'react-icons/fa';
import './FilterBar.css';

// Only 2+ bedrooms — live properties for sale only
const bedroomOptions = [
  { value: '', label: 'All Properties' },
  { value: '2', label: '2 Bedroom Property' },
  { value: '3', label: '3 Bedroom Property' },
  { value: '4', label: '4+ Bedroom Property' },
];

const propertyTypes = [
  { value: '', label: 'All Types' },
  { value: 'Apartment', label: 'Apartments' },
  { value: 'Duplex', label: 'Duplexes' },
  { value: 'Penthouse', label: 'Penthouses' },
];

const priceRanges = [
  { label: 'All Prices', min: null, max: null },
  { label: 'Under 8M ETB', min: null, max: 8000000 },
  { label: '8M – 12M ETB', min: 8000000, max: 12000000 },
  { label: '12M – 18M ETB', min: 12000000, max: 18000000 },
  { label: '18M – 30M ETB', min: 18000000, max: 30000000 },
  { label: '30M+ ETB', min: 30000000, max: null },
];

const fallbackLocations = [
  { id: 1, name: 'Bole' },
  { id: 2, name: 'Megenagna' },
  { id: 3, name: 'Mexico' },
  { id: 4, name: 'Kazanchis' },
  { id: 5, name: 'CMC' },
  { id: 6, name: 'Sarbet' },
  { id: 7, name: '6 Killo' },
  { id: 8, name: 'Arada' },
  { id: 9, name: 'Piazza' },
  { id: 10, name: 'Nifas Silk' },
  { id: 11, name: 'Ayat' },
  { id: 12, name: 'Gerji' },
  { id: 13, name: 'Lebu' },
  { id: 14, name: 'Lideta' },
  { id: 15, name: 'Atlas' },
  { id: 16, name: 'Old Airport' },
  { id: 17, name: 'Jemo' },
  { id: 18, name: 'Bole Wolo Sefer' },
  { id: 19, name: 'Hilton Area' },
  { id: 20, name: 'Summit' },
];

export default function FilterBar({ filters, onChange, count }) {
  const [locations, setLocations] = useState(fallbackLocations);
  const [local, setLocal] = useState(filters);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/apartments/meta/locations`)
      .then((r) => {
        const apiLocations = r.data.data || [];
        setLocations(
          apiLocations.length >= 6 ? apiLocations : fallbackLocations
        );
      })
      .catch(() => setLocations(fallbackLocations));
  }, []);

  useEffect(() => {
    setLocal(filters);
  }, [filters]);

  const handleSearch = () => onChange(local);

  const handleClear = () => {
    const cleared = {
      bedrooms: '',
      property_type: '',
      location_id: '',
      location_name: '',
      min_price: '',
      max_price: '',
    };
    setLocal(cleared);
    onChange(cleared);
  };

  const hasFilters =
    local.bedrooms ||
    local.property_type ||
    local.location_id ||
    local.location_name ||
    local.min_price ||
    local.max_price;

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

  const selectedLocation = locations.find(
    (l) => String(l.id) === local.location_id || l.name === local.location_name
  );

  return (
    <section className="filterbar">
      <div className="container">
        <div className="filterbar__header">
          <h2 className="filterbar__title">FIND YOUR PERFECT PROPERTY</h2>
          <p className="filterbar__subtitle">
            Explore our curated collection of premium apartments, duplexes &amp;
            penthouses
          </p>
        </div>

        <div className="filterbar__card">
          {/* Property Type Filter */}
          <div className="filterbar__section">
            <div className="filterbar__section-label">
              <FaBuilding className="filterbar__section-icon" />
              <span>Property Type</span>
            </div>
            <div className="filterbar__pills">
              {propertyTypes.map((type) => (
                <button
                  key={type.value}
                  className={`filterbar__pill ${
                    local.property_type === type.value
                      ? 'filterbar__pill--active'
                      : ''
                  }`}
                  onClick={() =>
                    setLocal((p) => ({ ...p, property_type: type.value }))
                  }
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bedrooms Filter */}
          <div className="filterbar__section">
            <div className="filterbar__section-label">
              <FaBed className="filterbar__section-icon" />
              <span>Bedrooms</span>
            </div>
            <div className="filterbar__pills">
              {bedroomOptions.map((opt) => (
                <button
                  key={opt.value}
                  className={`filterbar__pill ${
                    local.bedrooms === opt.value
                      ? 'filterbar__pill--active'
                      : ''
                  }`}
                  onClick={() =>
                    setLocal((p) => ({ ...p, bedrooms: opt.value }))
                  }
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="filterbar__section">
            <div className="filterbar__section-label">
              <FaTag className="filterbar__section-icon" />
              <span>Price Range</span>
            </div>
            <div className="filterbar__pills">
              {priceRanges.map((range, i) => (
                <button
                  key={i}
                  className={`filterbar__pill ${
                    activePriceIdx === i ? 'filterbar__pill--active' : ''
                  }`}
                  onClick={() => handlePriceRange(range)}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location Filter - Dropdown */}
          <div className="filterbar__section">
            <div className="filterbar__section-label">
              <FaMapMarkerAlt className="filterbar__section-icon" />
              <span>Location</span>
            </div>
            <div className="filterbar__dropdown-wrapper">
              <button
                className="filterbar__dropdown-btn"
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              >
                <span>
                  {selectedLocation ? selectedLocation.name : 'All Locations'}
                </span>
                <FaChevronDown
                  className={`filterbar__dropdown-icon ${
                    showLocationDropdown ? 'filterbar__dropdown-icon--open' : ''
                  }`}
                />
              </button>
              {showLocationDropdown && (
                <div className="filterbar__dropdown-menu">
                  <button
                    className={`filterbar__dropdown-item ${
                      !local.location_id && !local.location_name
                        ? 'filterbar__dropdown-item--active'
                        : ''
                    }`}
                    onClick={() => {
                      setLocal((p) => ({
                        ...p,
                        location_id: '',
                        location_name: '',
                      }));
                      setShowLocationDropdown(false);
                    }}
                  >
                    All Locations
                  </button>
                  {locations.map((loc) => (
                    <button
                      key={loc.id}
                      className={`filterbar__dropdown-item ${
                        local.location_id === String(loc.id) ||
                        local.location_name === loc.name
                          ? 'filterbar__dropdown-item--active'
                          : ''
                      }`}
                      onClick={() => {
                        setLocal((p) => ({
                          ...p,
                          location_id: String(loc.id),
                          location_name: loc.name,
                        }));
                        setShowLocationDropdown(false);
                      }}
                    >
                      {loc.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="filterbar__actions">
          {hasFilters && (
            <button className="filterbar__clear" onClick={handleClear}>
              <FaTimes /> Clear All
            </button>
          )}
          <button className="filterbar__search-btn" onClick={handleSearch}>
            <FaSearch />
            SEARCH PROPERTIES
            {/* {count !== undefined && (
              <span className="filterbar__count">({count})</span>
            )} */}
          </button>
        </div>
      </div>
    </section>
  );
}
