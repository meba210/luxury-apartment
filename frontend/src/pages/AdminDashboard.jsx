import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaSignOutAlt,
  FaCheck,
  FaTimes,
  FaUsers,
  FaBuilding,
  FaPlus,
  FaTrash,
  FaFileExcel,
  FaSearch,
  FaEye,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaStar,
  FaToggleOn,
  FaToggleOff,
  FaHome,
  FaComment,
} from 'react-icons/fa';
import './Dashboard.css';

// ── helpers ──────────────────────────────────────────────────
const STATUS_COLORS = {
  active: { bg: '#E6F9EE', color: '#1A7A3C' },
  sold: { bg: '#FEE2E2', color: '#B91C1C' },
  pending: { bg: '#FEF3C7', color: '#92400E' },
  'off-market': { bg: '#F3F4F6', color: '#374151' },
};

const PARTNER_STATUS = {
  pending: { bg: '#FEF3C7', color: '#92400E', label: 'Pending' },
  approved: { bg: '#E6F9EE', color: '#1A7A3C', label: 'Approved' },
  rejected: { bg: '#FEE2E2', color: '#B91C1C', label: 'Rejected' },
};

const AMENITY_OPTIONS = [
  'Swimming Pool',
  'Gym',
  '24/7 Security',
  'Parking',
  'Concierge',
  'Rooftop Terrace',
  'High-Speed Internet',
  'Backup Generator',
  'Private Terrace',
  'Valet Parking',
  'Smart Home System',
  'Wine Cellar',
  'Jacuzzi',
  'Sauna',
  'Rooftop Garden',
  'Children Playground',
  'Business Center',
  'Laundry Service',
  'Spa',
  'BBQ Area',
];

const LOCATIONS_STATIC = [
  { id: 1, name: 'Bole' },
  { id: 2, name: 'Megenagna' },
  { id: 3, name: 'Mexico' },
  { id: 4, name: 'Kazanchis' },
  { id: 5, name: 'CMC' },
  { id: 6, name: 'Sarbet' },
];

function fmt(n) {
  if (!n && n !== 0) return '—';
  return new Intl.NumberFormat('en-ET').format(n);
}

function SortIcon({ col, sortCol, sortDir }) {
  if (sortCol !== col)
    return <FaSort className="tbl-sort-icon tbl-sort-icon--inactive" />;
  return sortDir === 'asc' ? (
    <FaSortUp className="tbl-sort-icon tbl-sort-icon--active" />
  ) : (
    <FaSortDown className="tbl-sort-icon tbl-sort-icon--active" />
  );
}

const BLANK_APT = {
  title: '',
  description: '',
  bedrooms: '2',
  bathrooms: '2',
  size_sqm: '',
  price_etb: '',
  price_usd: '',
  location_id: '1',
  floor: '',
  total_floors: '',
  amenities: [],
  images: '',
  is_featured: false,
  is_available: true,
};

const BLANK_SALE = {
  place: '',
  property_type: 'Apartment',
  listing_status: 'active',
  price_etb: '',
  area_sqm: '',
  bedrooms: '',
  bathrooms: '',
  floor: '',
  total_floors: '',
  agent_name: '',
  sold_date: '',
  notes: '',
};

// ── Component ─────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('admin_token');
  const authH = useMemo(
    () => ({ headers: { Authorization: `Bearer ${token}` } }),
    [token]
  );

  useEffect(() => {
    if (!token) navigate('/admin/login');
  }, [token, navigate]);

  // ── data ──────────────────────────────────────────────────
  const [tab, setTab] = useState('apartments');
  const [apartments, setApartments] = useState([]);
  const [partners, setPartners] = useState([]);
  const [sales, setSales] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState(LOCATIONS_STATIC);
  const [inquiryUpdatingId, setInquiryUpdatingId] = useState(null);

  // partner tab
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // sales tab
  const [sortCol, setSortCol] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');
  const [showAddSale, setShowAddSale] = useState(false);
  const [newSale, setNewSale] = useState(BLANK_SALE);
  const [saleError, setSaleError] = useState('');
  const [saleLoading, setSaleLoading] = useState(false);

  // post apartment tab
  const [aptForm, setAptForm] = useState(BLANK_APT);
  const [aptError, setAptError] = useState('');
  const [aptSuccess, setAptSuccess] = useState('');
  const [aptLoading, setAptLoading] = useState(false);
  const [aptImgInput, setAptImgInput] = useState('');
  const [imgUploadLoading, setImgUploadLoading] = useState(false);

  // ── fetch ─────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [aRes, pRes, sRes, iRes, adRes, locRes] = await Promise.all([
        axios.get('/api/admin/apartments', authH),
        axios.get('/api/admin/partners', authH),
        axios.get('/api/admin/sales', authH),
        axios.get('/api/admin/inquiries', authH),
        axios.get('/api/admin/admins', authH),
        axios.get('/api/apartments/meta/locations'),
      ]);
      setApartments(aRes.data.data || []);
      setPartners(pRes.data.data || []);
      setSales(sRes.data.data || []);
      setInquiries(iRes.data.data || []);
      setAdmins(adRes.data.data || []);
      if (locRes.data.data?.length) setLocations(locRes.data.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('admin_token');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  }, [token, authH, navigate]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ── partner actions ───────────────────────────────────────
  const handlePartnerStatus = async (id, status) => {
    setActionLoading(id + status);
    try {
      await axios.patch(`/api/admin/partners/${id}`, { status }, authH);
      setPartners((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                status,
                approved_at:
                  status === 'approved' ? new Date().toISOString() : null,
              }
            : p
        )
      );
      if (selectedPartner?.id === id)
        setSelectedPartner((p) => ({ ...p, status }));
    } catch {
      alert('Action failed.');
    } finally {
      setActionLoading(null);
    }
  };

  // ── apartment actions ─────────────────────────────────────
  const handleDeleteApt = async (id) => {
    if (!window.confirm('Delete this apartment listing?')) return;
    try {
      await axios.delete(`/api/apartments/${id}`, authH);
      setApartments((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert('Delete failed.');
    }
  };

  const handleToggleApt = async (id, field, current) => {
    try {
      await axios.patch(`/api/apartments/${id}`, { [field]: !current }, authH);
      setApartments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, [field]: !current } : a))
      );
    } catch {
      alert('Update failed.');
    }
  };

  // ── post apartment ────────────────────────────────────────
  const handleAmenityToggle = (amenity) => {
    setAptForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleAddImage = () => {
    const url = aptImgInput.trim();
    if (!url) return;
    setAptForm((prev) => ({ ...prev, images: [...(prev.images || []), url] }));
    setAptImgInput('');
  };

  const handleImageFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setImgUploadLoading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('image', files[i]);

        const res = await axios.post('/api/uploads', formData, {
          headers: {
            ...authH.headers,
            'Content-Type': 'multipart/form-data',
          },
        });

        if (res.data.success && res.data.url) {
          setAptForm((prev) => ({
            ...prev,
            images: [...(prev.images || []), res.data.url],
          }));
        }
      }
      e.target.value = ''; // Reset file input
    } catch (err) {
      alert(
        'Image upload failed: ' + (err.response?.data?.message || err.message)
      );
    } finally {
      setImgUploadLoading(false);
    }
  };

  const handleRemoveImage = (idx) => {
    setAptForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  const handlePostApartment = async (e) => {
    e.preventDefault();
    setAptError('');
    setAptSuccess('');
    if (!aptForm.title || !aptForm.price_etb || !aptForm.bedrooms) {
      setAptError('Title, price and bedrooms are required.');
      return;
    }
    if (parseInt(aptForm.bedrooms) < 2) {
      setAptError(
        'Only apartments with 2 or more bedrooms are allowed on this platform.'
      );
      return;
    }
    setAptLoading(true);
    try {
      const payload = {
        ...aptForm,
        images: Array.isArray(aptForm.images) ? aptForm.images : [],
      };
      const res = await axios.post('/api/apartments', payload, authH);
      setAptSuccess(
        `Apartment "${aptForm.title}" posted successfully! (ID: ${res.data.id})`
      );
      setAptForm(BLANK_APT);
      setAptImgInput('');
      fetchAll();
      // auto-scroll to success
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setAptError(err.response?.data?.message || 'Failed to post apartment.');
    } finally {
      setAptLoading(false);
    }
  };

  // ── sales actions ─────────────────────────────────────────
  const handleInquiryUpdate = async (id, patch) => {
    setInquiryUpdatingId(id);
    try {
      await axios.patch(`/api/admin/inquiries/${id}`, patch, authH);
      setInquiries((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                ...patch,
                handled_at:
                  patch.status || patch.assigned_to
                    ? new Date().toISOString()
                    : item.handled_at,
              }
            : item
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update inquiry.');
    } finally {
      setInquiryUpdatingId(null);
    }
  };

  const handleDeleteSale = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await axios.delete(`/api/admin/sales/${id}`, authH);
      setSales((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert('Delete failed.');
    }
  };

  const handleAddSale = async (e) => {
    e.preventDefault();
    setSaleError('');
    if (!newSale.place || !newSale.price_etb || !newSale.area_sqm) {
      setSaleError('Place, price and area are required.');
      return;
    }
    setSaleLoading(true);
    try {
      await axios.post('/api/admin/sales', newSale, authH);
      setShowAddSale(false);
      setNewSale(BLANK_SALE);
      fetchAll();
    } catch (err) {
      setSaleError(err.response?.data?.message || 'Failed to add record.');
    } finally {
      setSaleLoading(false);
    }
  };

  const handleSort = (col) => {
    if (sortCol === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortCol(col);
      setSortDir('asc');
    }
  };

  const exportCSV = () => {
    const headers = [
      'Place',
      'Type',
      'Status',
      'Price ETB',
      'Area sqm',
      'Per sqm',
      'Beds',
      'Baths',
      'Agent',
    ];
    const rows = sales.map((s) => [
      s.place,
      s.property_type,
      s.listing_status,
      s.price_etb,
      s.area_sqm,
      s.per_sqm_birr,
      s.bedrooms || '',
      s.bathrooms || '',
      s.agent_name || '',
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `milevia_sales_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_info');
    navigate('/admin/login');
  };

  // ── derived ───────────────────────────────────────────────
  const filteredPartners = useMemo(
    () =>
      partners.filter((p) => {
        const q = search.toLowerCase();
        return (
          (!search ||
            p.full_name.toLowerCase().includes(q) ||
            p.email.toLowerCase().includes(q) ||
            (p.company || '').toLowerCase().includes(q)) &&
          (!filterStatus || p.status === filterStatus)
        );
      }),
    [partners, search, filterStatus]
  );

  const sortedSales = useMemo(
    () =>
      [...sales].sort((a, b) => {
        const av = a[sortCol] ?? '',
          bv = b[sortCol] ?? '';
        const cmp =
          typeof av === 'number'
            ? av - bv
            : String(av).localeCompare(String(bv));
        return sortDir === 'asc' ? cmp : -cmp;
      }),
    [sales, sortCol, sortDir]
  );

  const stats = {
    apartments: apartments.length,
    pendingPartners: partners.filter((p) => p.status === 'pending').length,
    approved: partners.filter((p) => p.status === 'approved').length,
    sales: sales.length,
    inquiries: inquiries.length,
  };

  // ── render ─────────────────────────────────────────────────
  return (
    <div className="dashboard dashboard--admin">
      {/* Top Bar */}
      <div className="dashboard__topbar dashboard__topbar--admin">
        <div className="dashboard__topbar-inner">
          <div className="dashboard__topbar-brand">
            <svg viewBox="0 0 44 44" fill="none" width="32" height="32">
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
              />
            </svg>
            <div>
              <span className="dashboard__topbar-name">MILEVIA ESTATES</span>
              <span className="dashboard__topbar-role">Admin Dashboard</span>
            </div>
          </div>
          <button className="dashboard__logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      <div className="dashboard__body">
        {/* Stats */}
        <div className="dashboard__stats">
          <div className="dashboard__stat-card">
            <div className="dashboard__stat-icon dashboard__stat-icon--blue">
              <FaHome />
            </div>
            <div>
              <span className="dashboard__stat-value">{stats.apartments}</span>
              <span className="dashboard__stat-label">Live Apartments</span>
            </div>
          </div>
          <div className="dashboard__stat-card">
            <div className="dashboard__stat-icon dashboard__stat-icon--gold">
              <FaUsers />
            </div>
            <div>
              <span className="dashboard__stat-value">
                {stats.pendingPartners}
              </span>
              <span className="dashboard__stat-label">Pending Partners</span>
            </div>
          </div>
          <div className="dashboard__stat-card">
            <div className="dashboard__stat-icon dashboard__stat-icon--green">
              <FaUsers />
            </div>
            <div>
              <span className="dashboard__stat-value">{stats.approved}</span>
              <span className="dashboard__stat-label">Approved Partners</span>
            </div>
          </div>
          <div className="dashboard__stat-card">
            <div className="dashboard__stat-icon dashboard__stat-icon--red">
              <FaBuilding />
            </div>
            <div>
              <span className="dashboard__stat-value">{stats.sales}</span>
              <span className="dashboard__stat-label">Sales Records</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="dashboard__tabs">
          <button
            className={`dashboard__tab ${tab === 'apartments' ? 'dashboard__tab--active' : ''}`}
            onClick={() => setTab('apartments')}
          >
            <FaHome /> Live Apartments
            <span className="dashboard__tab-count">{apartments.length}</span>
          </button>
          <button
            className={`dashboard__tab ${tab === 'post' ? 'dashboard__tab--active' : ''}`}
            onClick={() => setTab('post')}
          >
            <FaPlus /> Post New Apartment
          </button>
          <button
            className={`dashboard__tab ${tab === 'partners' ? 'dashboard__tab--active' : ''}`}
            onClick={() => setTab('partners')}
          >
            <FaUsers /> Partner Applications
            {stats.pendingPartners > 0 && (
              <span className="dashboard__tab-badge">
                {stats.pendingPartners}
              </span>
            )}
          </button>
          <button
            className={`dashboard__tab ${tab === 'inquiries' ? 'dashboard__tab--active' : ''}`}
            onClick={() => setTab('inquiries')}
          >
            <FaComment /> Inquiries
            <span className="dashboard__tab-count">{inquiries.length}</span>
          </button>
          <button
            className={`dashboard__tab ${tab === 'sales' ? 'dashboard__tab--active' : ''}`}
            onClick={() => setTab('sales')}
          >
            <FaBuilding /> Sales Records
            <span className="dashboard__tab-count">{sales.length}</span>
          </button>
        </div>

        {/* ══════════ LIVE APARTMENTS TAB ══════════ */}
        {tab === 'apartments' && (
          <div className="dashboard__table-card">
            <div className="dashboard__toolbar">
              <h3 className="dashboard__table-title">
                <FaHome /> Live Apartment Listings
              </h3>
              <div className="dashboard__toolbar-right">
                <button
                  className="dashboard__add-btn"
                  onClick={() => setTab('post')}
                >
                  <FaPlus /> Post New Apartment
                </button>
              </div>
            </div>
            <div className="dashboard__table-wrap">
              <table className="dashboard__table">
                <thead>
                  <tr>
                    <th className="tbl-th">TITLE</th>
                    <th className="tbl-th">LOCATION</th>
                    <th className="tbl-th tbl-th--num">BEDS</th>
                    <th className="tbl-th tbl-th--num">PRICE (ETB)</th>
                    <th className="tbl-th tbl-th--num">SIZE (m²)</th>
                    <th className="tbl-th">FEATURED</th>
                    <th className="tbl-th">AVAILABLE</th>
                    <th className="tbl-th">DELETE</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="tbl-loading">
                        <div className="tbl-spinner" />
                        Loading...
                      </td>
                    </tr>
                  ) : apartments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="tbl-empty">
                        No apartments yet. Use "Post New Apartment" to add one.
                      </td>
                    </tr>
                  ) : (
                    apartments.map((a, i) => (
                      <tr
                        key={a.id}
                        className={`tbl-row ${i % 2 === 0 ? 'tbl-row--even' : ''}`}
                      >
                        <td className="tbl-td tbl-td--bold">{a.title}</td>
                        <td className="tbl-td">{a.location_name || '—'}</td>
                        <td className="tbl-td tbl-td--num">{a.bedrooms}</td>
                        <td className="tbl-td tbl-td--num">
                          <span className="tbl-price">{fmt(a.price_etb)}</span>
                        </td>
                        <td className="tbl-td tbl-td--num">
                          {a.size_sqm ? Number(a.size_sqm).toFixed(0) : '—'}
                        </td>
                        <td className="tbl-td">
                          <button
                            className={`tbl-toggle-btn ${a.is_featured ? 'tbl-toggle-btn--on' : ''}`}
                            onClick={() =>
                              handleToggleApt(
                                a.id,
                                'is_featured',
                                a.is_featured
                              )
                            }
                            title="Toggle featured"
                          >
                            {a.is_featured ? <FaToggleOn /> : <FaToggleOff />}
                            {a.is_featured ? ' Yes' : ' No'}
                          </button>
                        </td>
                        <td className="tbl-td">
                          <button
                            className={`tbl-toggle-btn ${a.is_available ? 'tbl-toggle-btn--on' : 'tbl-toggle-btn--off'}`}
                            onClick={() =>
                              handleToggleApt(
                                a.id,
                                'is_available',
                                a.is_available
                              )
                            }
                            title="Toggle availability"
                          >
                            {a.is_available ? <FaToggleOn /> : <FaToggleOff />}
                            {a.is_available ? ' Live' : ' Hidden'}
                          </button>
                        </td>
                        <td className="tbl-td">
                          <button
                            className="tbl-action-btn tbl-action-btn--delete"
                            onClick={() => handleDeleteApt(a.id)}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════ INQUIRIES TAB ══════════ */}
        {tab === 'inquiries' && (
          <div className="dashboard__table-card">
            <div className="dashboard__toolbar">
              <h3 className="dashboard__table-title">
                <FaComment /> Customer Inquiries
              </h3>
              <div className="dashboard__toolbar-right">
                <span className="dashboard__table-count">
                  {inquiries.length} total
                </span>
              </div>
            </div>
            <div className="dashboard__table-wrap">
              <table className="dashboard__table">
                <thead>
                  <tr>
                    <th className="tbl-th">CUSTOMER</th>
                    <th className="tbl-th">PROPERTY</th>
                    <th className="tbl-th">MESSAGE</th>
                    <th className="tbl-th">STATUS</th>
                    <th className="tbl-th">ASSIGNED TO</th>
                    <th className="tbl-th">UPDATED</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="tbl-loading">
                        <div className="tbl-spinner" />
                        Loading inquiries...
                      </td>
                    </tr>
                  ) : inquiries.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="tbl-empty">
                        No inquiries yet.
                      </td>
                    </tr>
                  ) : (
                    inquiries.map((item) => (
                      <tr key={item.id} className="tbl-row">
                        <td className="tbl-td tbl-td--bold">
                          <div>{item.full_name}</div>
                          <div className="tbl-td--muted">{item.email}</div>
                          {item.phone && (
                            <div className="tbl-td--muted">{item.phone}</div>
                          )}
                        </td>
                        <td className="tbl-td">
                          {item.apartment_title || 'General inquiry'}
                        </td>
                        <td
                          className="tbl-td"
                          style={{ maxWidth: 280, whiteSpace: 'normal' }}
                        >
                          {item.message}
                        </td>
                        <td className="tbl-td">
                          <select
                            className="dashboard__filter-select"
                            value={item.status || 'new'}
                            onChange={(e) =>
                              handleInquiryUpdate(item.id, {
                                status: e.target.value,
                              })
                            }
                            disabled={inquiryUpdatingId === item.id}
                          >
                            <option value="new">New</option>
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                        <td className="tbl-td">
                          <select
                            className="dashboard__filter-select"
                            value={item.assigned_to || ''}
                            onChange={(e) =>
                              handleInquiryUpdate(item.id, {
                                assigned_to: e.target.value
                                  ? Number(e.target.value)
                                  : null,
                              })
                            }
                            disabled={inquiryUpdatingId === item.id}
                          >
                            <option value="">Unassigned</option>
                            {admins.map((admin) => (
                              <option key={admin.id} value={admin.id}>
                                {admin.username}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="tbl-td tbl-td--muted">
                          {item.handled_at
                            ? new Date(item.handled_at).toLocaleString()
                            : '—'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════ POST APARTMENT TAB ══════════ */}
        {tab === 'post' && (
          <div className="dashboard__table-card">
            <div className="dashboard__toolbar">
              <h3 className="dashboard__table-title">
                <FaPlus /> Post New Apartment Listing
              </h3>
              <p
                style={{
                  fontSize: '0.8rem',
                  color: '#6B7280',
                  marginLeft: '8px',
                }}
              >
                Only 2+ bedroom apartments for sale are allowed.
              </p>
            </div>

            <div className="apt-form-wrap">
              {aptSuccess && (
                <div className="apt-form__success">
                  <FaCheck /> {aptSuccess}
                </div>
              )}
              {aptError && (
                <div className="auth-error" style={{ margin: '0 0 16px' }}>
                  {aptError}
                </div>
              )}

              <form onSubmit={handlePostApartment} className="apt-form">
                {/* ── Basic Info ── */}
                <div className="apt-form__section">
                  <h4 className="apt-form__section-title">Basic Information</h4>
                  <div className="apt-form__grid apt-form__grid--2">
                    <div className="form-group apt-form__grid--full">
                      <label className="form-label">Apartment Title *</label>
                      <input
                        className="form-input"
                        value={aptForm.title}
                        onChange={(e) =>
                          setAptForm((p) => ({ ...p, title: e.target.value }))
                        }
                        placeholder="e.g. Bole Luxury Residence 3BR"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Location *</label>
                      <select
                        className="form-select"
                        value={aptForm.location_id}
                        onChange={(e) =>
                          setAptForm((p) => ({
                            ...p,
                            location_id: e.target.value,
                          }))
                        }
                      >
                        {locations.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Bedrooms * (min 2)</label>
                      <select
                        className="form-select"
                        value={aptForm.bedrooms}
                        onChange={(e) =>
                          setAptForm((p) => ({
                            ...p,
                            bedrooms: e.target.value,
                          }))
                        }
                      >
                        <option value="2">2 Bedrooms</option>
                        <option value="3">3 Bedrooms</option>
                        <option value="4">4 Bedrooms</option>
                        <option value="5">5+ Bedrooms</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Bathrooms *</label>
                      <select
                        className="form-select"
                        value={aptForm.bathrooms}
                        onChange={(e) =>
                          setAptForm((p) => ({
                            ...p,
                            bathrooms: e.target.value,
                          }))
                        }
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            {n} Bathroom{n > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-textarea"
                      rows={4}
                      value={aptForm.description}
                      onChange={(e) =>
                        setAptForm((p) => ({
                          ...p,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Describe this apartment — views, finishes, highlights..."
                    />
                  </div>
                </div>

                {/* ── Pricing & Size ── */}
                <div className="apt-form__section">
                  <h4 className="apt-form__section-title">
                    Pricing &amp; Size
                  </h4>
                  <div className="apt-form__grid apt-form__grid--3">
                    <div className="form-group">
                      <label className="form-label">Price (ETB) *</label>
                      <input
                        type="number"
                        className="form-input"
                        value={aptForm.price_etb}
                        onChange={(e) =>
                          setAptForm((p) => ({
                            ...p,
                            price_etb: e.target.value,
                          }))
                        }
                        placeholder="e.g. 12000000"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Price (USD)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={aptForm.price_usd}
                        onChange={(e) =>
                          setAptForm((p) => ({
                            ...p,
                            price_usd: e.target.value,
                          }))
                        }
                        placeholder="e.g. 21000"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Size (m²)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={aptForm.size_sqm}
                        onChange={(e) =>
                          setAptForm((p) => ({
                            ...p,
                            size_sqm: e.target.value,
                          }))
                        }
                        placeholder="e.g. 140"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Floor</label>
                      <input
                        type="number"
                        className="form-input"
                        value={aptForm.floor}
                        onChange={(e) =>
                          setAptForm((p) => ({ ...p, floor: e.target.value }))
                        }
                        placeholder="e.g. 8"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Total Floors in Building
                      </label>
                      <input
                        type="number"
                        className="form-input"
                        value={aptForm.total_floors}
                        onChange={(e) =>
                          setAptForm((p) => ({
                            ...p,
                            total_floors: e.target.value,
                          }))
                        }
                        placeholder="e.g. 20"
                      />
                    </div>
                  </div>
                </div>

                {/* ── Images ── */}
                <div className="apt-form__section">
                  <h4 className="apt-form__section-title">Images</h4>
                  <p className="apt-form__hint">
                    Upload from your computer or paste image URLs. First image
                    is the main photo.
                  </p>

                  {/* File Upload Option */}
                  <div className="apt-form__img-upload">
                    <label className="form-label">Upload from Computer</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="form-input"
                      onChange={handleImageFileUpload}
                      disabled={imgUploadLoading}
                    />
                    {imgUploadLoading && (
                      <span
                        className="apt-form__hint"
                        style={{ color: '#D97706' }}
                      >
                        Uploading...
                      </span>
                    )}
                  </div>

                  {/* URL Input Option */}
                  <div
                    className="apt-form__img-row"
                    style={{ marginTop: '16px' }}
                  >
                    <input
                      className="form-input"
                      value={aptImgInput}
                      onChange={(e) => setAptImgInput(e.target.value)}
                      placeholder="Or paste image URL: https://..."
                      onKeyDown={(e) =>
                        e.key === 'Enter' &&
                        (e.preventDefault(), handleAddImage())
                      }
                    />
                    <button
                      type="button"
                      className="btn btn-gold btn-sm"
                      onClick={handleAddImage}
                    >
                      <FaPlus /> Add URL
                    </button>
                  </div>
                  {Array.isArray(aptForm.images) &&
                    aptForm.images.length > 0 && (
                      <div className="apt-form__img-list">
                        {aptForm.images.map((url, i) => (
                          <div key={i} className="apt-form__img-item">
                            <img
                              src={url}
                              alt={`Preview ${i + 1}`}
                              className="apt-form__img-thumb"
                            />
                            <div className="apt-form__img-info">
                              <span className="apt-form__img-label">
                                {i === 0 ? '★ Main photo' : `Photo ${i + 1}`}
                              </span>
                              <span className="apt-form__img-url">
                                {url.slice(0, 60)}...
                              </span>
                            </div>
                            <button
                              type="button"
                              className="apt-form__img-remove"
                              onClick={() => handleRemoveImage(i)}
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                </div>

                {/* ── Amenities ── */}
                <div className="apt-form__section">
                  <h4 className="apt-form__section-title">Amenities</h4>
                  <div className="apt-form__amenities">
                    {AMENITY_OPTIONS.map((a) => (
                      <label
                        key={a}
                        className={`apt-form__amenity-chip ${aptForm.amenities.includes(a) ? 'apt-form__amenity-chip--active' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={aptForm.amenities.includes(a)}
                          onChange={() => handleAmenityToggle(a)}
                        />
                        {a}
                      </label>
                    ))}
                  </div>
                </div>

                {/* ── Options ── */}
                <div className="apt-form__section">
                  <h4 className="apt-form__section-title">Listing Options</h4>
                  <div className="apt-form__options">
                    <label className="apt-form__option">
                      <input
                        type="checkbox"
                        checked={aptForm.is_featured}
                        onChange={(e) =>
                          setAptForm((p) => ({
                            ...p,
                            is_featured: e.target.checked,
                          }))
                        }
                      />
                      <FaStar className="apt-form__option-icon apt-form__option-icon--gold" />
                      <div>
                        <strong>Mark as Featured</strong>
                        <span>Appears on the homepage featured section</span>
                      </div>
                    </label>
                    <label className="apt-form__option">
                      <input
                        type="checkbox"
                        checked={aptForm.is_available}
                        onChange={(e) =>
                          setAptForm((p) => ({
                            ...p,
                            is_available: e.target.checked,
                          }))
                        }
                      />
                      <FaToggleOn className="apt-form__option-icon apt-form__option-icon--green" />
                      <div>
                        <strong>Make Available (Live)</strong>
                        <span>Visible to all visitors on the website</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="apt-form__submit-row">
                  <button
                    type="submit"
                    className="btn btn-gold btn-lg"
                    disabled={aptLoading}
                  >
                    {aptLoading ? (
                      <span className="auth-spinner" />
                    ) : (
                      <>
                        <FaPlus /> Post Apartment
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-gold"
                    onClick={() => {
                      setAptForm(BLANK_APT);
                      setAptError('');
                      setAptSuccess('');
                    }}
                  >
                    Reset Form
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ══════════ PARTNERS TAB ══════════ */}
        {tab === 'partners' && (
          <div className="dashboard__table-card">
            <div className="dashboard__toolbar">
              <h3 className="dashboard__table-title">
                <FaUsers /> Partner Applications
                <span className="dashboard__table-count">
                  {filteredPartners.length} records
                </span>
              </h3>
              <div className="dashboard__toolbar-right">
                <div className="dashboard__search-wrap">
                  <FaSearch className="dashboard__search-icon" />
                  <input
                    className="dashboard__search"
                    placeholder="Search name, email, company..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <button
                      className="dashboard__search-clear"
                      onClick={() => setSearch('')}
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
                <select
                  className="dashboard__filter-select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            <div className="dashboard__table-wrap">
              <table className="dashboard__table">
                <thead>
                  <tr>
                    <th className="tbl-th">NAME</th>
                    <th className="tbl-th">EMAIL</th>
                    <th className="tbl-th">PHONE</th>
                    <th className="tbl-th">COMPANY</th>
                    <th className="tbl-th">EXPERIENCE</th>
                    <th className="tbl-th">MESSAGE</th>
                    <th className="tbl-th">APPLIED</th>
                    <th className="tbl-th">STATUS</th>
                    <th className="tbl-th">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="tbl-loading">
                        <div className="tbl-spinner" />
                        Loading...
                      </td>
                    </tr>
                  ) : filteredPartners.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="tbl-empty">
                        No partner applications found.
                      </td>
                    </tr>
                  ) : (
                    filteredPartners.map((p, i) => {
                      const st = PARTNER_STATUS[p.status];
                      return (
                        <tr
                          key={p.id}
                          className={`tbl-row ${i % 2 === 0 ? 'tbl-row--even' : ''}`}
                        >
                          <td className="tbl-td tbl-td--bold">{p.full_name}</td>
                          <td className="tbl-td">{p.email}</td>
                          <td className="tbl-td">{p.phone}</td>
                          <td className="tbl-td">{p.company || '—'}</td>
                          <td className="tbl-td">{p.experience || '—'}</td>
                          <td className="tbl-td">
                            {p.message ? (
                              <button
                                className="tbl-msg-btn"
                                onClick={() => setSelectedPartner(p)}
                                title="Read message"
                              >
                                <FaComment />{' '}
                                <span className="tbl-msg-preview">
                                  {p.message.slice(0, 40)}
                                  {p.message.length > 40 ? '…' : ''}
                                </span>
                              </button>
                            ) : (
                              <span className="tbl-td--muted">—</span>
                            )}
                          </td>
                          <td className="tbl-td">
                            {new Date(p.created_at).toLocaleDateString()}
                          </td>
                          <td className="tbl-td">
                            <span
                              className="tbl-status"
                              style={{ background: st.bg, color: st.color }}
                            >
                              {st.label}
                            </span>
                          </td>
                          <td className="tbl-td">
                            <div className="tbl-actions">
                              <button
                                className="tbl-action-btn tbl-action-btn--view"
                                onClick={() => setSelectedPartner(p)}
                                title="View full details"
                              >
                                <FaEye />
                              </button>
                              {p.status !== 'approved' && (
                                <button
                                  className="tbl-action-btn tbl-action-btn--approve"
                                  onClick={() =>
                                    handlePartnerStatus(p.id, 'approved')
                                  }
                                  disabled={actionLoading === p.id + 'approved'}
                                >
                                  <FaCheck /> Approve
                                </button>
                              )}
                              {p.status !== 'rejected' && (
                                <button
                                  className="tbl-action-btn tbl-action-btn--reject"
                                  onClick={() =>
                                    handlePartnerStatus(p.id, 'rejected')
                                  }
                                  disabled={actionLoading === p.id + 'rejected'}
                                >
                                  <FaTimes /> Reject
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="dashboard__table-footer">
              {filteredPartners.length} of {partners.length} shown
            </div>
          </div>
        )}

        {/* ══════════ SALES TAB ══════════ */}
        {tab === 'sales' && (
          <div className="dashboard__table-card">
            <div className="dashboard__toolbar">
              <h3 className="dashboard__table-title">
                <FaBuilding /> Sales Records
                <span className="dashboard__table-count">
                  {sales.length} records
                </span>
              </h3>
              <div className="dashboard__toolbar-right">
                <button className="dashboard__export-btn" onClick={exportCSV}>
                  <FaFileExcel /> Export CSV
                </button>
                <button
                  className="dashboard__add-btn"
                  onClick={() => setShowAddSale((v) => !v)}
                >
                  <FaPlus />
                  {showAddSale ? ' Cancel' : ' Add Record'}
                </button>
              </div>
            </div>

            {showAddSale && (
              <div className="dashboard__add-form">
                <div className="dashboard__add-form-header">
                  <h4>Add Sales Record</h4>
                  <button
                    onClick={() => {
                      setShowAddSale(false);
                      setSaleError('');
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>
                {saleError && (
                  <div className="auth-error" style={{ margin: '0 0 12px' }}>
                    {saleError}
                  </div>
                )}
                <form
                  onSubmit={handleAddSale}
                  className="dashboard__add-form-grid"
                >
                  <div className="form-group">
                    <label className="form-label">Place *</label>
                    <input
                      className="form-input"
                      value={newSale.place}
                      onChange={(e) =>
                        setNewSale((p) => ({ ...p, place: e.target.value }))
                      }
                      placeholder="e.g. BOLE, ATLAS"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Type *</label>
                    <select
                      className="form-select"
                      value={newSale.property_type}
                      onChange={(e) =>
                        setNewSale((p) => ({
                          ...p,
                          property_type: e.target.value,
                        }))
                      }
                    >
                      {[
                        'Apartment',
                        'Duplex',
                        'Penthouse',
                        'Villa',
                        'Townhouse',
                        'Commercial',
                        'Land',
                      ].map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={newSale.listing_status}
                      onChange={(e) =>
                        setNewSale((p) => ({
                          ...p,
                          listing_status: e.target.value,
                        }))
                      }
                    >
                      <option value="active">Active</option>
                      <option value="sold">Sold</option>
                      <option value="pending">Pending</option>
                      <option value="off-market">Off Market</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price (ETB) *</label>
                    <input
                      type="number"
                      className="form-input"
                      value={newSale.price_etb}
                      onChange={(e) =>
                        setNewSale((p) => ({ ...p, price_etb: e.target.value }))
                      }
                      placeholder="15000000"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Area (sqm) *</label>
                    <input
                      type="number"
                      className="form-input"
                      value={newSale.area_sqm}
                      onChange={(e) =>
                        setNewSale((p) => ({ ...p, area_sqm: e.target.value }))
                      }
                      placeholder="120"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bedrooms</label>
                    <input
                      type="number"
                      className="form-input"
                      value={newSale.bedrooms}
                      onChange={(e) =>
                        setNewSale((p) => ({ ...p, bedrooms: e.target.value }))
                      }
                      placeholder="2"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bathrooms</label>
                    <input
                      type="number"
                      className="form-input"
                      value={newSale.bathrooms}
                      onChange={(e) =>
                        setNewSale((p) => ({ ...p, bathrooms: e.target.value }))
                      }
                      placeholder="2"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Agent Name</label>
                    <input
                      className="form-input"
                      value={newSale.agent_name}
                      onChange={(e) =>
                        setNewSale((p) => ({
                          ...p,
                          agent_name: e.target.value,
                        }))
                      }
                      placeholder="Agent name"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sold Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={newSale.sold_date}
                      onChange={(e) =>
                        setNewSale((p) => ({ ...p, sold_date: e.target.value }))
                      }
                    />
                  </div>
                  <div className="form-group dashboard__add-form-full">
                    <label className="form-label">Notes</label>
                    <textarea
                      className="form-textarea"
                      rows={2}
                      value={newSale.notes}
                      onChange={(e) =>
                        setNewSale((p) => ({ ...p, notes: e.target.value }))
                      }
                      placeholder="Optional notes..."
                    />
                  </div>
                  <div className="dashboard__add-form-actions">
                    <button
                      type="submit"
                      className="btn btn-gold"
                      disabled={saleLoading}
                    >
                      {saleLoading ? (
                        <span className="auth-spinner" />
                      ) : (
                        <>
                          <FaPlus /> Add Record
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-gold"
                      onClick={() => setShowAddSale(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="dashboard__table-wrap">
              <table className="dashboard__table">
                <thead>
                  <tr>
                    <th
                      className="tbl-th tbl-th--sortable"
                      onClick={() => handleSort('place')}
                    >
                      PLACE{' '}
                      <SortIcon
                        col="place"
                        sortCol={sortCol}
                        sortDir={sortDir}
                      />
                    </th>
                    <th className="tbl-th">TYPE</th>
                    <th className="tbl-th">STATUS</th>
                    <th
                      className="tbl-th tbl-th--sortable tbl-th--num"
                      onClick={() => handleSort('price_etb')}
                    >
                      PRICE{' '}
                      <SortIcon
                        col="price_etb"
                        sortCol={sortCol}
                        sortDir={sortDir}
                      />
                    </th>
                    <th
                      className="tbl-th tbl-th--sortable tbl-th--num"
                      onClick={() => handleSort('area_sqm')}
                    >
                      AREA (SQM){' '}
                      <SortIcon
                        col="area_sqm"
                        sortCol={sortCol}
                        sortDir={sortDir}
                      />
                    </th>
                    <th
                      className="tbl-th tbl-th--sortable tbl-th--num"
                      onClick={() => handleSort('per_sqm_birr')}
                    >
                      PER SQM{' '}
                      <SortIcon
                        col="per_sqm_birr"
                        sortCol={sortCol}
                        sortDir={sortDir}
                      />
                    </th>
                    <th className="tbl-th tbl-th--num">BEDS</th>
                    <th className="tbl-th tbl-th--num">BATHS</th>
                    <th className="tbl-th">AGENT</th>
                    <th className="tbl-th">DEL</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={10} className="tbl-loading">
                        <div className="tbl-spinner" />
                        Loading...
                      </td>
                    </tr>
                  ) : sortedSales.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="tbl-empty">
                        No records yet.
                      </td>
                    </tr>
                  ) : (
                    sortedSales.map((s, i) => {
                      const st =
                        STATUS_COLORS[s.listing_status] || STATUS_COLORS.active;
                      return (
                        <tr
                          key={s.id}
                          className={`tbl-row ${i % 2 === 0 ? 'tbl-row--even' : ''}`}
                        >
                          <td className="tbl-td tbl-td--place">{s.place}</td>
                          <td className="tbl-td">{s.property_type}</td>
                          <td className="tbl-td">
                            <span
                              className="tbl-status"
                              style={{ background: st.bg, color: st.color }}
                            >
                              {s.listing_status}
                            </span>
                          </td>
                          <td className="tbl-td tbl-td--num">
                            <span className="tbl-price">
                              {fmt(s.price_etb)}
                            </span>
                            <span className="tbl-price-unit"> ETB</span>
                          </td>
                          <td className="tbl-td tbl-td--num">
                            {Number(s.area_sqm).toFixed(2)}
                          </td>
                          <td className="tbl-td tbl-td--num tbl-td--bold">
                            {fmt(s.per_sqm_birr)}
                          </td>
                          <td className="tbl-td tbl-td--num">
                            {s.bedrooms || '—'}
                          </td>
                          <td className="tbl-td tbl-td--num">
                            {s.bathrooms || '—'}
                          </td>
                          <td className="tbl-td tbl-td--agent">
                            {s.agent_name || '—'}
                          </td>
                          <td className="tbl-td">
                            <button
                              className="tbl-action-btn tbl-action-btn--delete"
                              onClick={() => handleDeleteSale(s.id)}
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="dashboard__table-footer">
              {sales.length} records · Click headers to sort
            </div>
          </div>
        )}
      </div>

      {/* Partner detail modal */}
      {selectedPartner && (
        <div
          className="dash-modal-overlay"
          onClick={() => setSelectedPartner(null)}
        >
          <div
            className="dash-modal dash-modal--wide"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dash-modal__header">
              <h3>{selectedPartner.full_name}</h3>
              <button onClick={() => setSelectedPartner(null)}>
                <FaTimes />
              </button>
            </div>
            <div className="dash-modal__body">
              <div className="dash-modal__grid">
                <div className="dash-modal__row">
                  <span>Email</span>
                  <strong>{selectedPartner.email}</strong>
                </div>
                <div className="dash-modal__row">
                  <span>Phone</span>
                  <strong>{selectedPartner.phone}</strong>
                </div>
                <div className="dash-modal__row">
                  <span>Company</span>
                  <strong>{selectedPartner.company || '—'}</strong>
                </div>
                <div className="dash-modal__row">
                  <span>Experience</span>
                  <strong>{selectedPartner.experience || '—'}</strong>
                </div>
                <div className="dash-modal__row">
                  <span>Applied</span>
                  <strong>
                    {new Date(selectedPartner.created_at).toLocaleDateString()}
                  </strong>
                </div>
                <div className="dash-modal__row">
                  <span>Status</span>
                  <span
                    className="tbl-status"
                    style={{
                      background: PARTNER_STATUS[selectedPartner.status].bg,
                      color: PARTNER_STATUS[selectedPartner.status].color,
                    }}
                  >
                    {PARTNER_STATUS[selectedPartner.status].label}
                  </span>
                </div>
              </div>
              {selectedPartner.message && (
                <div className="dash-modal__message">
                  <span>
                    <FaComment style={{ marginRight: '6px' }} />
                    Why they want to join MILEVIA
                  </span>
                  <p>{selectedPartner.message}</p>
                </div>
              )}
            </div>
            <div className="dash-modal__footer">
              {selectedPartner.status !== 'approved' && (
                <button
                  className="tbl-action-btn tbl-action-btn--approve"
                  onClick={() => {
                    handlePartnerStatus(selectedPartner.id, 'approved');
                    setSelectedPartner(null);
                  }}
                >
                  <FaCheck /> Approve
                </button>
              )}
              {selectedPartner.status !== 'rejected' && (
                <button
                  className="tbl-action-btn tbl-action-btn--reject"
                  onClick={() => {
                    handlePartnerStatus(selectedPartner.id, 'rejected');
                    setSelectedPartner(null);
                  }}
                >
                  <FaTimes /> Reject
                </button>
              )}
              <button
                className="tbl-action-btn"
                style={{
                  marginLeft: 'auto',
                  background: '#F3F4F6',
                  color: '#374151',
                  border: '1px solid #E5E7EB',
                }}
                onClick={() => setSelectedPartner(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
