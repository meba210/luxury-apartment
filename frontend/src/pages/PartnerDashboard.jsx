import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  FaSignOutAlt, FaSearch, FaSort, FaSortUp, FaSortDown,
  FaFileExcel, FaBuilding, FaChartBar, FaTimes, FaFilter
} from 'react-icons/fa'
import './Dashboard.css'

const STATUS_COLORS = {
  active:       { bg: '#E6F9EE', color: '#1A7A3C', label: 'Active' },
  sold:         { bg: '#FEE2E2', color: '#B91C1C', label: 'Sold' },
  pending:      { bg: '#FEF3C7', color: '#92400E', label: 'Pending' },
  'off-market': { bg: '#F3F4F6', color: '#374151', label: 'Off Market' },
}

const PROPERTY_TYPES = ['Apartment','Duplex','Penthouse']

function fmt(n) {
  if (!n && n !== 0) return '—'
  return new Intl.NumberFormat('en-ET').format(n)
}

function SortIcon({ col, sortCol, sortDir }) {
  if (sortCol !== col) return <FaSort className="tbl-sort-icon tbl-sort-icon--inactive" />
  return sortDir === 'asc'
    ? <FaSortUp   className="tbl-sort-icon tbl-sort-icon--active" />
    : <FaSortDown className="tbl-sort-icon tbl-sort-icon--active" />
}

export default function PartnerDashboard() {
  const navigate = useNavigate()
  const [partner, setPartner]   = useState(null)
  const [sales, setSales]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [search, setSearch]     = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterType, setFilterType]     = useState('')
  const [sortCol, setSortCol]   = useState('created_at')
  const [sortDir, setSortDir]   = useState('desc')

  const token = localStorage.getItem('partner_token')

  // ── Auth guard ──────────────────────────────────────────────
  useEffect(() => {
    if (!token) { navigate('/partner/login'); return }
    const info = localStorage.getItem('partner_info')
    if (info) setPartner(JSON.parse(info))
  }, [token, navigate])

  // ── Fetch sales ─────────────────────────────────────────────
  const fetchSales = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (filterStatus) params.set('status', filterStatus)
      if (filterType) params.set('type', filterType)
      params.set('sort', sortCol)
      params.set('order', sortDir)

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/partners/sales?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSales(res.data.data || [])
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('partner_token')
        navigate('/partner/login')
      } else {
        setError('Failed to load properties. Please refresh.')
      }
    } finally {
      setLoading(false)
    }
  }, [token, search, filterStatus, filterType, sortCol, sortDir, navigate])

  useEffect(() => { fetchSales() }, [fetchSales])

  const handleSort = col => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('asc') }
  }

  const clearFilters = () => { setSearch(''); setFilterStatus(''); setFilterType('') }
  const hasFilters = search || filterStatus || filterType

  const exportCSV = () => {
    const headers = ['Place','Property Type','Status','Price (ETB)','Area (sqm)','Per sqm (Birr)','Bedrooms','Bathrooms','Floor','Agent']
    const rows = sales.map(s => [
      s.place, s.property_type, s.listing_status,
      s.price_etb, s.area_sqm, s.per_sqm_birr,
      s.bedrooms || '', s.bathrooms || '', s.floor || '', s.agent_name || ''
    ])
    const csv  = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url
    a.download = `milevia_properties_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleLogout = () => {
    localStorage.removeItem('partner_token')
    localStorage.removeItem('partner_info')
    navigate('/partner/login')
  }

  const stats = useMemo(() => ({
    total:    sales.length,
    active:   sales.filter(s => s.listing_status === 'active').length,
    sold:     sales.filter(s => s.listing_status === 'sold').length,
    avgPrice: sales.length
      ? Math.round(sales.reduce((a, s) => a + Number(s.price_etb), 0) / sales.length)
      : 0,
  }), [sales])

  return (
    <div className="dashboard">

      {/* ── Top Bar ── */}
      <div className="dashboard__topbar">
        <div className="dashboard__topbar-inner">
          <div className="dashboard__topbar-brand">
            <svg viewBox="0 0 44 44" fill="none" width="32" height="32">
              <rect x="1" y="1" width="42" height="42" rx="3" stroke="#C9A84C" strokeWidth="1.5"/>
              <path d="M10 32V12L22 26L34 12V32" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <span className="dashboard__topbar-name">MILEVIA ESTATES</span>
              <span className="dashboard__topbar-role">Partner Dashboard</span>
            </div>
          </div>
          <div className="dashboard__topbar-user">
            <div className="dashboard__topbar-avatar">{partner?.full_name?.[0] || 'P'}</div>
            <div className="dashboard__topbar-info">
              <span className="dashboard__topbar-fullname">{partner?.full_name || 'Partner'}</span>
              <span className="dashboard__topbar-email">{partner?.email || ''}</span>
            </div>
            <button className="dashboard__logout-btn" onClick={handleLogout} title="Sign out">
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard__body">

        {/* ── Stats ── */}
        <div className="dashboard__stats">
          <div className="dashboard__stat-card">
            <div className="dashboard__stat-icon dashboard__stat-icon--blue"><FaBuilding /></div>
            <div><span className="dashboard__stat-value">{stats.total}</span><span className="dashboard__stat-label">Total Properties</span></div>
          </div>
          <div className="dashboard__stat-card">
            <div className="dashboard__stat-icon dashboard__stat-icon--green"><FaChartBar /></div>
            <div><span className="dashboard__stat-value">{stats.active}</span><span className="dashboard__stat-label">Active Listings</span></div>
          </div>
          <div className="dashboard__stat-card">
            <div className="dashboard__stat-icon dashboard__stat-icon--red"><FaBuilding /></div>
            <div><span className="dashboard__stat-value">{stats.sold}</span><span className="dashboard__stat-label">Sold Properties</span></div>
          </div>
          <div className="dashboard__stat-card">
            <div className="dashboard__stat-icon dashboard__stat-icon--gold"><FaChartBar /></div>
            <div><span className="dashboard__stat-value">ETB {fmt(stats.avgPrice)}</span><span className="dashboard__stat-label">Average Price</span></div>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="dashboard__table-card">
          <div className="dashboard__toolbar">
            <div className="dashboard__toolbar-left">
              <h3 className="dashboard__table-title">
                <FaBuilding /> Property Listings
                <span className="dashboard__table-count">{sales.length} records</span>
              </h3>
            </div>
            <div className="dashboard__toolbar-right">
              <div className="dashboard__search-wrap">
                <FaSearch className="dashboard__search-icon" />
                <input type="text" className="dashboard__search" placeholder="Search properties..." value={search} onChange={e => setSearch(e.target.value)} />
                {search && <button className="dashboard__search-clear" onClick={() => setSearch('')}><FaTimes /></button>}
              </div>
              <select className="dashboard__filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="sold">Sold</option>
                <option value="pending">Pending</option>
                <option value="off-market">Off Market</option>
              </select>
              <select className="dashboard__filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
                <option value="">All Types</option>
                {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {hasFilters && (
                <button className="dashboard__clear-btn" onClick={clearFilters}><FaTimes /> Clear</button>
              )}
              <button className="dashboard__export-btn" onClick={exportCSV}><FaFileExcel /> Export</button>
            </div>
          </div>

          {error && <div className="dashboard__error">{error}</div>}

          <div className="dashboard__table-wrap">
            <table className="dashboard__table">
              <thead>
                <tr>
                  <th className="tbl-th tbl-th--sortable" onClick={() => handleSort('place')}>PLACE <SortIcon col="place" sortCol={sortCol} sortDir={sortDir} /></th>
                  <th className="tbl-th">PROPERTY TYPE</th>
                  <th className="tbl-th">LISTING STATUS</th>
                  <th className="tbl-th tbl-th--sortable tbl-th--num" onClick={() => handleSort('price_etb')}>PRICE <SortIcon col="price_etb" sortCol={sortCol} sortDir={sortDir} /></th>
                  <th className="tbl-th tbl-th--sortable tbl-th--num" onClick={() => handleSort('area_sqm')}>AREA (SQM) <SortIcon col="area_sqm" sortCol={sortCol} sortDir={sortDir} /></th>
                  <th className="tbl-th tbl-th--sortable tbl-th--num" onClick={() => handleSort('per_sqm_birr')}>PER SQM (BIRR) <SortIcon col="per_sqm_birr" sortCol={sortCol} sortDir={sortDir} /></th>
                  <th className="tbl-th tbl-th--num">BEDS</th>
                  <th className="tbl-th tbl-th--num">BATHS</th>
                  <th className="tbl-th">AGENT</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9} className="tbl-loading"><div className="tbl-spinner" /> Loading properties...</td></tr>
                ) : sales.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="tbl-empty">
                      <FaFilter style={{ fontSize: '2rem', opacity: 0.3, marginBottom: '8px' }} />
                      <div>No properties match your filters.</div>
                    </td>
                  </tr>
                ) : sales.map((s, i) => {
                  const st = STATUS_COLORS[s.listing_status] || STATUS_COLORS.active
                  return (
                    <tr key={s.id} className={`tbl-row ${i % 2 === 0 ? 'tbl-row--even' : ''}`}>
                      <td className="tbl-td tbl-td--place">{s.place}</td>
                      <td className="tbl-td">{s.property_type}</td>
                      <td className="tbl-td"><span className="tbl-status" style={{ background: st.bg, color: st.color }}>{st.label}</span></td>
                      <td className="tbl-td tbl-td--num"><span className="tbl-price">{fmt(s.price_etb)}</span><span className="tbl-price-unit"> ETB</span></td>
                      <td className="tbl-td tbl-td--num">{Number(s.area_sqm).toFixed(2)}</td>
                      <td className="tbl-td tbl-td--num tbl-td--bold">{fmt(s.per_sqm_birr)}</td>
                      <td className="tbl-td tbl-td--num">{s.bedrooms || '—'}</td>
                      <td className="tbl-td tbl-td--num">{s.bathrooms || '—'}</td>
                      <td className="tbl-td tbl-td--agent">{s.agent_name || '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="dashboard__table-footer">
            Showing {sales.length} properties · Data visible to approved MILEVIA partners only
          </div>
        </div>
      </div>
    </div>
  )
}
