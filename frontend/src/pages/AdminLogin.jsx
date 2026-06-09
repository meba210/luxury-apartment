import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import './AuthPages.css'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ username: '', password: '' })
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/login`,
        form
      );
      localStorage.setItem('admin_token', res.data.token)
      localStorage.setItem('admin_info', JSON.stringify(res.data.admin))
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page auth-page--centered auth-page--admin">
      <div className="auth-card auth-card--admin">
        <div className="auth-card__header">
          <div className="auth-card__admin-icon"><FaLock /></div>
          <h2>Admin Portal</h2>
          <p>MILEVIA Estates — Restricted Access</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
              className="form-input"
              placeholder="Enter your username"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="auth-form__pw-wrap">
              <input
                name="password"
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className="form-input"
                placeholder="Enter your password"
                required
              />
              <button type="button" className="auth-form__pw-toggle" onClick={() => setShowPw(p => !p)}>
                {showPw ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-gold auth-form__submit" disabled={loading}>
            {loading ? <span className="auth-spinner" /> : <><FaLock /> Sign In</>}
          </button>
        </form>

        <div className="auth-card__footer">
          <p><Link to="/partner/login">← Partner login</Link></p>
        </div>
      </div>
    </div>
  )
}
