import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaHandshake, FaCheckCircle, FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa'
import './AuthPages.css'

const perks = [
  'Access to full sold & active property database',
  'Real-time price per sqm analytics',
  'Earn up to 75% buyer commission',
  'Dedicated partner support team',
  'Excel-style property reports',
]

export default function PartnerRegister() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', company: '',
    experience: '', message: '', password: '', confirm_password: ''
  })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm_password) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      await axios.post('/api/partners/register', form)
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-success">
          <div className="auth-success__icon"><FaCheckCircle /></div>
          <h2>Application Submitted!</h2>
          <p>Thank you for applying to become a MILEVIA Estates partner. Our team will review your application and notify you by email within 1–2 business days.</p>
          <div className="auth-success__actions">
            <Link to="/partner/login" className="btn btn-gold">Go to Partner Login</Link>
            <Link to="/" className="btn btn-outline-gold">Back to Home</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-page__inner">
        {/* Left panel */}
        <div className="auth-panel auth-panel--dark">
          <div className="auth-panel__logo">
            <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" width="48" height="48">
              <rect x="1" y="1" width="42" height="42" rx="3" stroke="#C9A84C" strokeWidth="1.5"/>
              <path d="M10 32V12L22 26L34 12V32" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <span className="auth-panel__logo-main">MILEVIA</span>
              <span className="auth-panel__logo-sub">ESTATES</span>
            </div>
          </div>

          <div className="auth-panel__icon"><FaHandshake /></div>
          <h2 className="auth-panel__title">Become a Partner</h2>
          <p className="auth-panel__desc">
            Join Addis Ababa's most trusted real estate network. Get access to exclusive property data and earn top commissions.
          </p>

          <ul className="auth-panel__perks">
            {perks.map((p, i) => (
              <li key={i}><FaCheckCircle className="auth-panel__perk-icon" />{p}</li>
            ))}
          </ul>

          <p className="auth-panel__login-hint">
            Already a partner? <Link to="/partner/login">Sign in here <FaArrowRight /></Link>
          </p>
        </div>

        {/* Right panel — form */}
        <div className="auth-panel auth-panel--light">
          <h3 className="auth-form__title">Partner Registration</h3>
          <p className="auth-form__subtitle">Fill in your details to apply. Admin approval required.</p>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-form__row">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input name="full_name" value={form.full_name} onChange={handleChange}
                  className="form-input" placeholder="Abebe Girma" required />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange}
                  className="form-input" placeholder="you@email.com" required />
              </div>
            </div>

            <div className="auth-form__row">
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input name="phone" value={form.phone} onChange={handleChange}
                  className="form-input" placeholder="+251 9XX XXX XXX" required />
              </div>
              <div className="form-group">
                <label className="form-label">Company / Agency</label>
                <input name="company" value={form.company} onChange={handleChange}
                  className="form-input" placeholder="Your company (optional)" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Years of Experience in Real Estate</label>
              <select name="experience" value={form.experience} onChange={handleChange} className="form-select">
                <option value="">Select experience level</option>
                <option value="0-1 years">0–1 years (New to real estate)</option>
                <option value="1-3 years">1–3 years</option>
                <option value="3-5 years">3–5 years</option>
                <option value="5-10 years">5–10 years</option>
                <option value="10+ years">10+ years</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Why do you want to join MILEVIA?</label>
              <textarea name="message" value={form.message} onChange={handleChange}
                className="form-textarea" rows={3}
                placeholder="Tell us about yourself and your goals..." />
            </div>

            <div className="auth-form__row">
              <div className="form-group">
                <label className="form-label">Password *</label>
                <div className="auth-form__pw-wrap">
                  <input name="password" type={showPw ? 'text' : 'password'} value={form.password}
                    onChange={handleChange} className="form-input" placeholder="Min. 6 characters" required />
                  <button type="button" className="auth-form__pw-toggle" onClick={() => setShowPw(p => !p)}>
                    {showPw ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <input name="confirm_password" type={showPw ? 'text' : 'password'} value={form.confirm_password}
                  onChange={handleChange} className="form-input" placeholder="Repeat password" required />
              </div>
            </div>

            <button type="submit" className="btn btn-gold auth-form__submit" disabled={loading}>
              {loading ? <span className="auth-spinner" /> : <><FaHandshake /> Submit Application</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
