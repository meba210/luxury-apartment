import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaEye, FaEyeSlash, FaSignInAlt } from 'react-icons/fa'
import './AuthPages.css'

export default function PartnerLogin() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/partners/login`,
        form
      );
      localStorage.setItem('partner_token', res.data.token)
      localStorage.setItem('partner_info', JSON.stringify(res.data.partner))
      navigate('/partner/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page auth-page--centered">
      <div className="auth-card">
        <div className="auth-card__header">
          <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" width="44" height="44">
            <rect x="1" y="1" width="42" height="42" rx="3" stroke="#C9A84C" strokeWidth="1.5"/>
            <path d="M10 32V12L22 26L34 12V32" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h2>Partner Login</h2>
          <p>Sign in to access the MILEVIA partner dashboard</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="form-input"
              placeholder="your@email.com"
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
                onChange={handleChange}
                className="form-input"
                placeholder="Your password"
                required
              />
              <button type="button" className="auth-form__pw-toggle" onClick={() => setShowPw(p => !p)}>
                {showPw ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-gold auth-form__submit" disabled={loading}>
            {loading ? <span className="auth-spinner" /> : <><FaSignInAlt /> Sign In</>}
          </button>
        </form>

        <div className="auth-card__footer">
          <p>Not a partner yet? <Link to="/partner/register">Apply now</Link></p>
          <p style={{ marginTop: '8px' }}>
            <Link to="/admin/login" style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Admin login →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
