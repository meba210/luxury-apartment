import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import ApartmentCard from '../components/ApartmentCard'
import ApartmentModal from '../components/ApartmentModal'
import FilterBar from '../components/FilterBar'
import LoadingSpinner from '../components/LoadingSpinner'
import { FaBuilding, FaSearch } from 'react-icons/fa'
import './Apartments.css'

const PAGE_SIZE = 9

export default function Apartments() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [apartments, setApartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedApt, setSelectedApt] = useState(null)
  const [page, setPage] = useState(1)

  const [filters, setFilters] = useState({
    bedrooms: searchParams.get('bedrooms') || '',
    location_id: searchParams.get('location_id') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
  })

  const fetchApartments = useCallback(async (f) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (f.bedrooms) params.set('bedrooms', f.bedrooms)
      if (f.location_id) params.set('location_id', f.location_id)
      if (f.min_price) params.set('min_price', f.min_price)
      if (f.max_price) params.set('max_price', f.max_price)
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/apartments?${params.toString()}`
      );
      setApartments(res.data.data || [])
      setPage(1)
    } catch {
      setError('Failed to load apartments. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchApartments(filters) }, [filters, fetchApartments])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([k, v]) => { if (v) params.set(k, v) })
    setSearchParams(params)
  }

  const paginated = apartments.slice(0, page * PAGE_SIZE)
  const hasMore = paginated.length < apartments.length

  return (
    <div className="apartments-page">
      {/* Header */}
      <div className="apartments-page__header">
        <div className="apartments-page__header-bg">
          <img
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1400&q=80"
            alt="Properties"
            className="apartments-page__header-img"
          />
          <div className="apartments-page__header-overlay" />
        </div>
        <div className="container">
          <div className="apartments-page__header-content">
            <span className="overline" style={{ color: 'var(--gold-light)' }}>Our Portfolio</span>
            <h1 className="apartments-page__title">LUXURY PROPERTIES</h1>
            <p className="apartments-page__subtitle">
              Browse our curated collection of premium 2 &amp; 3 bedroom residences<br />
              across Addis Ababa's finest neighborhoods.
            </p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <FilterBar filters={filters} onChange={handleFilterChange} count={apartments.length} />

      {/* Grid */}
      <div className="apartments-page__content section">
        <div className="container">
          {loading ? (
            <LoadingSpinner size="lg" text="Loading properties..." />
          ) : error ? (
            <div className="apartments-page__state">
              <FaBuilding className="apartments-page__state-icon" />
              <h3>Something went wrong</h3>
              <p>{error}</p>
              <button className="btn btn-gold" onClick={() => fetchApartments(filters)}>
                Try Again
              </button>
            </div>
          ) : apartments.length === 0 ? (
            <div className="apartments-page__state">
              <FaSearch className="apartments-page__state-icon" />
              <h3>No Properties Found</h3>
              <p>No apartments match your current filters. Try adjusting your search criteria.</p>
              <button
                className="btn btn-outline-gold"
                onClick={() => handleFilterChange({ bedrooms: '', location_id: '', min_price: '', max_price: '' })}
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="apartments-page__grid">
                {paginated.map(apt => (
                  <ApartmentCard key={apt.id} apartment={apt} onClick={() => setSelectedApt(apt)} />
                ))}
              </div>

              {hasMore && (
                <div className="apartments-page__load-more">
                  <button className="btn btn-outline-gold btn-lg" onClick={() => setPage(p => p + 1)}>
                    Load More Properties ({apartments.length - paginated.length} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {selectedApt && (
        <ApartmentModal apartment={selectedApt} onClose={() => setSelectedApt(null)} />
      )}
    </div>
  )
}
