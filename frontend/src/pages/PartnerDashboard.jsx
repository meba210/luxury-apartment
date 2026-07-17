
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import {
  FaSignOutAlt,
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaFileExcel,
  FaBuilding,
  FaChartBar,
  FaTimes,
  FaFilter,
  FaHome,
  FaPlayCircle,
  FaTelegramPlane,
  FaUser,
  FaEdit,
  FaLock,
  FaCheckCircle,
  FaExclamationCircle,
  FaPhone,
  FaEnvelope,
  FaBriefcase,
  FaMapMarkerAlt,
  FaEye,
  FaEyeSlash,
  FaBell,
} from 'react-icons/fa';
import Logo from '../components/Logo'
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

function getVideoLinks(apt) {
  const value = apt?.video_links ?? apt?.videoLinks ?? apt?.videos ?? []
  const cleanLinks = (links) =>
    links
      .map((url) =>
        String(url)
          .trim()
          .replace(/^[\s[\]"']+|[\s[\]"']+$/g, '')
      )
      .filter((url) => /^https?:\/\//i.test(url))

  if (Array.isArray(value)) return cleanLinks(value)
  if (typeof value !== 'string') return []

  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) return cleanLinks(parsed)
  } catch {
 
    // Fall back to a plain URL or comma-separated text saved by older data.
  }

  return cleanLinks(value.split(','))
}

function SortIcon({ col, sortCol, sortDir }) {
  if (sortCol !== col) return <FaSort className="tbl-sort-icon tbl-sort-icon--inactive" />
  return sortDir === 'asc'
    ? <FaSortUp   className="tbl-sort-icon tbl-sort-icon--active" />
    : <FaSortDown className="tbl-sort-icon tbl-sort-icon--active" />
}

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

export default function PartnerDashboard() {
  const navigate = useNavigate()
  const [partner, setPartner]   = useState(null)
  const [sales, setSales]       = useState([])
  const [apartments, setApartments] = useState([])
  const [loading, setLoading]   = useState(true)
  const [aptLoading, setAptLoading] = useState(false)
  
 const tab = location.pathname.includes('/sales') ? 'sales' : 'apartments';
  const [error, setError]       = useState('')
  const [search, setSearch]     = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterType, setFilterType]     = useState('')
  const [filterBedrooms, setFilterBedrooms] = useState('');
  const [sortCol, setSortCol]   = useState('created_at')
  const [sortDir, setSortDir]   = useState('desc')
  const [local, setLocal] = useState({
    location_id: '',
    location_name: '',
  });


 const handleAuthError = useCallback(
   (err) => {
     if (err.response?.status === 401 || err.response?.status === 403) {
       localStorage.removeItem('partner_token');
       localStorage.removeItem('partner_info');
       navigate('/partner/login');
     }
   },
   [navigate]
 );

  const token = localStorage.getItem('partner_token')

//   useEffect(() => {
//   const interceptor = axios.interceptors.response.use(
//     response => response,
//     error => {
//       if (
//         error.response?.status === 401 ||
//         error.response?.status === 403
//       ) {
//         localStorage.removeItem('partner_token');
//         localStorage.removeItem('partner_info');
//         navigate('/partner/login');
//       }

//       return Promise.reject(error);
//     }
//   );

//   return () => {
//     axios.interceptors.response.eject(interceptor);
//   };
// }, [navigate]);

  const [locations, setLocations] = useState(fallbackLocations);

  // ── Profile Dropdown State ──
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // ── Profile state ──
  const [profileData, setProfileData]       = useState(null)
  const [profileLoading, setProfileLoading] = useState(false)
  
  // ── Edit Profile Form ──
  const [editForm, setEditForm] = useState({
    full_name: '', phone: '', additional_phone: '',
    telegram_username: '', address: '', company: '', about: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editMessage, setEditMessage] = useState({ type: '', text: '' });

  // ── Password Change ──
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  // ── Auth guard ──
  useEffect(() => {
    if (!token) { navigate('/partner/login'); return }
    const info = localStorage.getItem('partner_info')
    if (info) setPartner(JSON.parse(info))
  }, [token, navigate])

  // ── Close dropdown when clicking outside ──
  useEffect(() => {
    function handleClickOutside(event) {
      if (showProfileDropdown && !event.target.closest('.dashboard__profile-dropdown')) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileDropdown]);

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

  const fetchProfile = useCallback(async () => {
    if (!token) return;
    setProfileLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/partners/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfileData(res.data.data);
      setEditForm({
        full_name: res.data.data.full_name || '',
        phone: res.data.data.phone || '',
        additional_phone: res.data.data.additional_phone || '',
        telegram_username: res.data.data.telegram_username || '',
        address: res.data.data.address || '',
        company: res.data.data.company || '',
        about: res.data.data.about || '',
      });
    } catch (err) {
      console.log(err);
        handleAuthError(err);
    } finally {
      setProfileLoading(false);
    }
  }, [token, handleAuthError]);

  // ── Save Profile ──
  const saveProfileChanges = async () => {
    if (!editForm.full_name || !editForm.phone) {
      setEditMessage({ type: 'error', text: 'Full name and phone are required.' });
      return;
    }
    
    setEditSaving(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/partners/me`,
        editForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
      setShowEditProfile(false);
      fetchProfile();
      setTimeout(() => setEditMessage({ type: '', text: '' }), 3000);
    } catch (err) {
        handleAuthError(err);
      setEditMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setEditSaving(false);
    }
  };

  // ── Change Password ──
  const handlePasswordChange = async () => {
    if (!passwordForm.current_password || !passwordForm.new_password || !passwordForm.confirm_password) {
      setPasswordMessage({ type: 'error', text: 'All password fields are required.' });
      return;
    }
    if (passwordForm.new_password.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setPasswordLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/partners/me/password`,
        passwordForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
      setTimeout(() => {
        setPasswordMessage({ type: '', text: '' });
        setShowPasswordModal(false);
      }, 2000);
    } catch (err) {
        handleAuthError(err);
      setPasswordMessage({ type: 'error', text: err.response?.data?.message || 'Failed to change password.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  // ── Fetch sales ──
  const fetchApartments = useCallback(async () => {
    setAptLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/apartments`
      );
      setApartments(res.data.data || []);
    } catch (err) {
      handleAuthError(err);
      console.error('Failed to fetch live apartments', err);
    } finally {
      setAptLoading(false);
    }
  }, [handleAuthError]);

  const fetchSales = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (filterStatus) params.set('status', filterStatus);
      if (filterType) params.set('type', filterType);
      params.set('sort', sortCol);
      params.set('order', sortDir);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/partners/sales?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSales(res.data.data || []);
    } catch (err) {
      handleAuthError(err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('partner_token');
        navigate('/partner/login');
      } else {
        setError('Failed to load properties. Please refresh.');
      }
    } finally {
      setLoading(false);
    }
  }, [
    token,
    search,
    filterStatus,
    filterType,
    sortCol,
    sortDir,
    navigate,
    handleAuthError,
  ]);

  useEffect(() => {
    fetchSales();
    fetchApartments();
    fetchProfile();
  }, [fetchSales, fetchApartments, fetchProfile]);

  const handleSort = col => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('asc') }
  }

 const clearFilters = () => {
   setSearch('');
   setFilterStatus('');
   setFilterType('');
   setFilterBedrooms('');
   setLocal({
     location_name: '',
   });
 };
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
            <Logo size={32} color="#C9A84C" />
            <div>
              <span className="dashboard__topbar-name">MILEVIA ESTATES</span>
              <span className="dashboard__topbar-role">Partner Dashboard</span>
            </div>
          </div>

          <div className="dashboard__topbar-right">
            {/* Profile Dropdown */}
            <div className="dashboard__profile-dropdown">
              <button
                className="dashboard__profile-trigger"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                <div className="dashboard__profile-avatar-small">
                  {profileData?.full_name?.[0] || 'P'}
                </div>
                <div className="dashboard__profile-info">
                  <span className="dashboard__profile-name">
                    {profileData?.full_name || 'Partner'}
                  </span>
                  <span className="dashboard__profile-email">
                    {profileData?.email || ''}
                  </span>
                </div>
                <svg
                  className="dropdown-arrow"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                >
                  <path
                    d="M2 4l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showProfileDropdown && (
                <div className="dashboard__profile-menu">
                  <div className="profile-menu-header">
                    <div className="profile-menu-avatar">
                      {profileData?.full_name?.[0] || 'P'}
                    </div>
                    <div className="profile-menu-user">
                      <strong>{profileData?.full_name || 'Partner'}</strong>
                      <span>{profileData?.email || ''}</span>
                    </div>
                  </div>

                  <div className="profile-menu-divider"></div>

                  <div className="profile-menu-info">
                    <div className="profile-menu-item">
                      <FaPhone />
                      <span>{profileData?.phone || 'No phone'}</span>
                    </div>
                    <div className="profile-menu-item">
                      <FaBriefcase />
                      <span>{profileData?.company || 'No company'}</span>
                    </div>
                    {profileData?.telegram_username && (
                      <div className="profile-menu-item">
                        <FaTelegramPlane />
                        <span>@{profileData.telegram_username}</span>
                      </div>
                    )}
                    {profileData?.address && (
                      <div className="profile-menu-item">
                        <FaMapMarkerAlt />
                        <span>{profileData.address}</span>
                      </div>
                    )}
                  </div>

                  <div className="profile-menu-divider"></div>

                  <button
                    className="profile-menu-action"
                    onClick={() => {
                      setShowEditProfile(true);
                      setShowProfileDropdown(false);
                      setIsEditing(true);
                      setEditMessage({ type: '', text: '' });
                    }}
                  >
                    <FaEdit />
                    Edit Profile
                  </button>

                  <button
                    className="profile-menu-action"
                    onClick={() => {
                      setShowPasswordModal(true);
                      setShowProfileDropdown(false);
                      setPasswordMessage({ type: '', text: '' });
                      setPasswordForm({
                        current_password: '',
                        new_password: '',
                        confirm_password: '',
                      });
                    }}
                  >
                    <FaLock />
                    Change Password
                  </button>

                  <div className="profile-menu-divider"></div>

                  <button
                    className="profile-menu-action profile-menu-action--danger"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Edit Profile Modal ── */}
      {showEditProfile && (
        <div
          className="modal-overlay"
          onClick={() => {
            setShowEditProfile(false);
            setIsEditing(false);
            setEditMessage({ type: '', text: '' });
          }}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <FaEdit /> Edit Profile
              </h3>
              <button
                className="modal-close"
                onClick={() => {
                  setShowEditProfile(false);
                  setIsEditing(false);
                  setEditMessage({ type: '', text: '' });
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              {editMessage.text && (
                <div
                  className={`modal-message modal-message--${editMessage.type}`}
                >
                  {editMessage.type === 'success' ? (
                    <FaCheckCircle />
                  ) : (
                    <FaExclamationCircle />
                  )}
                  {editMessage.text}
                </div>
              )}

              <div className="edit-form">
                <div className="edit-form-group">
                  <label>
                    <FaUser /> Full Name *
                  </label>
                  <input
                    type="text"
                    value={editForm.full_name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, full_name: e.target.value })
                    }
                    placeholder="Full Name"
                  />
                </div>

                <div className="edit-form-group">
                  <label>
                    <FaPhone /> Phone *
                  </label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                    placeholder="Phone"
                  />
                </div>

                <div className="edit-form-group">
                  <label>
                    <FaPhone /> Additional Phone
                  </label>
                  <input
                    type="text"
                    value={editForm.additional_phone}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        additional_phone: e.target.value,
                      })
                    }
                    placeholder="Additional Phone"
                  />
                </div>

                <div className="edit-form-group">
                  <label>
                    <FaTelegramPlane /> Telegram Username
                  </label>
                  <input
                    type="text"
                    value={editForm.telegram_username}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        telegram_username: e.target.value,
                      })
                    }
                    placeholder="Telegram Username"
                  />
                </div>

                <div className="edit-form-group">
                  <label>
                    <FaBriefcase /> Company
                  </label>
                  <input
                    type="text"
                    value={editForm.company}
                    onChange={(e) =>
                      setEditForm({ ...editForm, company: e.target.value })
                    }
                    placeholder="Company"
                  />
                </div>

                <div className="edit-form-group">
                  <label>
                    <FaMapMarkerAlt /> Address
                  </label>
                  <input
                    type="text"
                    value={editForm.address}
                    onChange={(e) =>
                      setEditForm({ ...editForm, address: e.target.value })
                    }
                    placeholder="Address"
                  />
                </div>

                <div className="edit-form-group full-width">
                  <label>
                    <FaUser /> About
                  </label>
                  <textarea
                    value={editForm.about}
                    onChange={(e) =>
                      setEditForm({ ...editForm, about: e.target.value })
                    }
                    placeholder="Tell us about yourself..."
                    rows="4"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowEditProfile(false);
                  setIsEditing(false);
                  setEditMessage({ type: '', text: '' });
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={saveProfileChanges}
                disabled={editSaving}
              >
                {editSaving ? (
                  'Saving...'
                ) : (
                  <>
                    <FaCheckCircle /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Change Password Modal ── */}
      {showPasswordModal && (
        <div
          className="modal-overlay"
          onClick={() => {
            setShowPasswordModal(false);
            setPasswordMessage({ type: '', text: '' });
          }}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <FaLock /> Change Password
              </h3>
              <button
                className="modal-close"
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordMessage({ type: '', text: '' });
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              {passwordMessage.text && (
                <div
                  className={`modal-message modal-message--${passwordMessage.type}`}
                >
                  {passwordMessage.type === 'success' ? (
                    <FaCheckCircle />
                  ) : (
                    <FaExclamationCircle />
                  )}
                  {passwordMessage.text}
                </div>
              )}

              <div className="edit-form">
                <div className="edit-form-group full-width">
                  <label>Current Password</label>
                  <div className="password-input-group">
                    <input
                      type={showPassword.current ? 'text' : 'password'}
                      value={passwordForm.current_password}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          current_password: e.target.value,
                        })
                      }
                      placeholder="Enter current password"
                    />
                    <button
                      className="password-toggle-btn"
                      onClick={() =>
                        setShowPassword({
                          ...showPassword,
                          current: !showPassword.current,
                        })
                      }
                    >
                      {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="edit-form-group full-width">
                  <label>New Password</label>
                  <div className="password-input-group">
                    <input
                      type={showPassword.new ? 'text' : 'password'}
                      value={passwordForm.new_password}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          new_password: e.target.value,
                        })
                      }
                      placeholder="New password (min 6 characters)"
                    />
                    <button
                      className="password-toggle-btn"
                      onClick={() =>
                        setShowPassword({
                          ...showPassword,
                          new: !showPassword.new,
                        })
                      }
                    >
                      {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="edit-form-group full-width">
                  <label>Confirm Password</label>
                  <div className="password-input-group">
                    <input
                      type={showPassword.confirm ? 'text' : 'password'}
                      value={passwordForm.confirm_password}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirm_password: e.target.value,
                        })
                      }
                      placeholder="Confirm new password"
                    />
                    <button
                      className="password-toggle-btn"
                      onClick={() =>
                        setShowPassword({
                          ...showPassword,
                          confirm: !showPassword.confirm,
                        })
                      }
                    >
                      {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordMessage({ type: '', text: '' });
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handlePasswordChange}
                disabled={passwordLoading}
              >
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard__body">
        {/* ── Tabs ── */}
        <div className="dashboard__tabs">
          <Link
            to="/partner/dashboard/apartments"
            className={`dashboard__tab ${
              tab === 'apartments' ? 'dashboard__tab--active' : ''
            }`}
          >
            <FaHome /> Live Apartments
          </Link>

          <Link
            to="/partner/dashboard/sales"
            className={`dashboard__tab ${
              tab === 'sales' ? 'dashboard__tab--active' : ''
            }`}
          >
            <FaBuilding /> Sales Records
          </Link>
        </div>

        {/* ── Stats ── */}
        {tab === 'sales' && (
          <div className="dashboard__stats">
            <div className="dashboard__stat-card">
              <div className="dashboard__stat-icon dashboard__stat-icon--blue">
                <FaBuilding />
              </div>
              <div>
                <span className="dashboard__stat-value">{stats.total}</span>
                <span className="dashboard__stat-label">Total Properties</span>
              </div>
            </div>
            <div className="dashboard__stat-card">
              <div className="dashboard__stat-icon dashboard__stat-icon--green">
                <FaChartBar />
              </div>
              <div>
                <span className="dashboard__stat-value">{stats.active}</span>
                <span className="dashboard__stat-label">Active Listings</span>
              </div>
            </div>
            <div className="dashboard__stat-card">
              <div className="dashboard__stat-icon dashboard__stat-icon--red">
                <FaBuilding />
              </div>
              <div>
                <span className="dashboard__stat-value">{stats.sold}</span>
                <span className="dashboard__stat-label">Sold Properties</span>
              </div>
            </div>
            <div className="dashboard__stat-card">
              <div className="dashboard__stat-icon dashboard__stat-icon--gold">
                <FaChartBar />
              </div>
              <div>
                <span className="dashboard__stat-value">
                  ETB {fmt(stats.avgPrice)}
                </span>
                <span className="dashboard__stat-label">Average Price</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Table ── */}
        {tab === 'sales' && (
          <div className="dashboard__table-card">
            <div className="dashboard__toolbar">
              <div className="dashboard__toolbar-left">
                <h3 className="dashboard__table-title">
                  <FaBuilding /> Property Listings
                  <span className="dashboard__table-count">
                    {sales.length} records
                  </span>
                </h3>
              </div>
              <div className="dashboard__toolbar-right">
                <div className="dashboard__search-wrap">
                  <FaSearch className="dashboard__search-icon" />
                  <input
                    type="text"
                    className="dashboard__search"
                    placeholder="Search properties..."
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
                  <option value="active">Active</option>
                  <option value="sold">Sold</option>
                  <option value="pending">Pending</option>
                  <option value="off-market">Off Market</option>
                </select>
                <select
                  className="dashboard__filter-select"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="">All Types</option>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {hasFilters && (
                  <button
                    className="dashboard__clear-btn"
                    onClick={clearFilters}
                  >
                    <FaTimes /> Clear
                  </button>
                )}
                <button className="dashboard__export-btn" onClick={exportCSV}>
                  <FaFileExcel /> Export
                </button>
              </div>
            </div>

            {error && <div className="dashboard__error">{error}</div>}

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
                    <th className="tbl-th">PROPERTY TYPE</th>
                    <th className="tbl-th">LISTING STATUS</th>
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
                      PER SQM (BIRR){' '}
                      <SortIcon
                        col="per_sqm_birr"
                        sortCol={sortCol}
                        sortDir={sortDir}
                      />
                    </th>
                    <th className="tbl-th tbl-th--num">BEDS</th>
                    <th className="tbl-th tbl-th--num">BATHS</th>
                    <th className="tbl-th">AGENT</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="tbl-loading">
                        <div className="tbl-spinner" /> Loading properties...
                      </td>
                    </tr>
                  ) : sales.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="tbl-empty">
                        <FaFilter
                          style={{
                            fontSize: '2rem',
                            opacity: 0.3,
                            marginBottom: '8px',
                          }}
                        />
                        <div>No properties match your filters.</div>
                      </td>
                    </tr>
                  ) : (
                    sales.map((s, i) => {
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
                              {st.label}
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
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="dashboard__table-footer">
              Showing {sales.length} properties · Data visible to approved
              MILEVIA partners only
            </div>
          </div>
        )}

        {/* ── Live Apartments Table ── */}
        {tab === 'apartments' && (
          <div className="dashboard__table-card">
            <div className="dashboard__toolbar">
              <div className="dashboard__toolbar-left">
                <h3 className="dashboard__table-title">
                  <FaHome /> Live Apartments
                  <span className="dashboard__table-count">
                    {apartments.length} listings
                  </span>
                </h3>
              </div>
              <div className="dashboard__toolbar-right">
                <div className="dashboard__search-wrap">
                  <FaSearch className="dashboard__search-icon" />
                  <input
                    type="text"
                    className="dashboard__search"
                    placeholder="Search properties..."
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
                  value={local.location_name}
                  onChange={(e) =>
                    setLocal({
                      location_name: e.target.value,
                    })
                  }
                >
                  <option value="">All Locations</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.name}>
                      {loc.name}
                    </option>
                  ))}
                </select>
                <select
                  className="dashboard__filter-select"
                  value={filterBedrooms}
                  onChange={(e) => setFilterBedrooms(e.target.value)}
                >
                  <option value="">All Bedrooms</option>
                  <option value="1">1 Bedroom</option>
                  <option value="2">2 Bedrooms</option>
                  <option value="3">3 Bedrooms</option>
                  <option value="4">4 Bedrooms</option>
                  <option value="5">5+ Bedrooms</option>
                </select>
                <select
                  className="dashboard__filter-select"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="">All Types</option>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {hasFilters && (
                  <button
                    className="dashboard__clear-btn"
                    onClick={clearFilters}
                  >
                    <FaTimes /> Clear
                  </button>
                )}
                <button className="dashboard__export-btn" onClick={exportCSV}>
                  <FaFileExcel /> Export
                </button>
              </div>
            </div>
            <div className="dashboard__table-wrap">
              <table className="dashboard__table">
                <thead>
                  <tr>
                    <th className="tbl-th">TITLE</th>
                    <th className="tbl-th">LOCATION</th>
                    <th className="tbl-th">TYPE</th>
                    <th className="tbl-th tbl-th--num">BEDS</th>
                    <th className="tbl-th tbl-th--num">BATHS</th>
                    <th className="tbl-th tbl-th--num">PRICE (ETB)</th>
                    <th className="tbl-th tbl-th--num">SIZE (m²)</th>
                    <th className="tbl-th">MEDIA</th>
                    <th className="tbl-th">VIDEO LINKS</th>
                  </tr>
                </thead>
                <tbody>
                  {aptLoading ? (
                    <tr>
                      <td colSpan={9} className="tbl-loading">
                        <div className="tbl-spinner" /> Loading apartments...
                      </td>
                    </tr>
                  ) : apartments.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="tbl-empty">
                        No live apartments available at the moment.
                      </td>
                    </tr>
                  ) : (
                    apartments
                      .filter((a) => {
                        const matchesSearch =
                          !search ||
                          a.title
                            .toLowerCase()
                            .includes(search.toLowerCase()) ||
                          (a.location_name || '')
                            .toLowerCase()
                            .includes(search.toLowerCase());

                        const matchesType =
                          !filterType || a.property_type === filterType;

                        const matchesLocation =
                          !local.location_name ||
                          a.location_name === local.location_name;

                        const matchesBedrooms =
                          !filterBedrooms ||
                          (filterBedrooms === '5'
                            ? Number(a.bedrooms) >= 5
                            : Number(a.bedrooms) === Number(filterBedrooms));

                        return (
                          matchesSearch &&
                          matchesType &&
                          matchesLocation &&
                          matchesBedrooms
                        );
                      })
                      .map((a, i) => (
                        <tr
                          key={a.id}
                          className={`tbl-row ${i % 2 === 0 ? 'tbl-row--even' : ''}`}
                        >
                          <td className="tbl-td tbl-td--bold">{a.title}</td>
                          <td className="tbl-td">{a.location_name || '—'}</td>
                          <td className="tbl-td">{a.property_type || '—'}</td>
                          <td className="tbl-td tbl-td--num">{a.bedrooms}</td>
                          <td className="tbl-td tbl-td--num">{a.bathrooms}</td>
                          <td className="tbl-td tbl-td--num">
                            <span className="tbl-price">
                              {fmt(a.price_etb)}
                            </span>
                          </td>
                          <td className="tbl-td tbl-td--num">
                            {a.size_sqm ? Number(a.size_sqm).toFixed(0) : '—'}
                          </td>
                          <td className="tbl-td">
                            <div
                              style={{
                                display: 'flex',
                                gap: '8px',
                                alignItems: 'center',
                              }}
                            >
                              <span
                                style={{
                                  fontSize: '0.85rem',
                                  color: '#6B7280',
                                }}
                              >
                                {Array.isArray(a.images) ? a.images.length : 0}{' '}
                                Photos
                              </span>
                              {getVideoLinks(a).length > 0 && (
                                <span
                                  style={{
                                    fontSize: '0.85rem',
                                    color: '#10B981',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                  }}
                                >
                                  <FaPlayCircle /> {getVideoLinks(a).length}{' '}
                                  Video
                                  {getVideoLinks(a).length > 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="tbl-td tbl-td--links">
                            {getVideoLinks(a).length > 0 ? (
                              <div className="tbl-link-list">
                                {getVideoLinks(a).map((url, idx) => (
                                  <a
                                    key={`${url}-${idx}`}
                                    href={url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="tbl-video-link"
                                    title={url}
                                  >
                                    <FaTelegramPlane className="tbl-video-link__icon" />
                                    <span>video Link</span>
                                  </a>
                                ))}
                              </div>
                            ) : (
                              '-'
                            )}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}