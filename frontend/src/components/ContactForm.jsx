import { useState } from 'react'
import axios from 'axios'
import { FaPaperPlane, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'
import './ContactForm.css'

export default function ContactForm({ apartments = [], preselectedId = null, preselectedTitle = null }) {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    apartment_id: preselectedId || '',
    message: preselectedTitle ? `I'm interested in: ${preselectedTitle}` : '',
  })
  const [status, setStatus] = useState(null) // 'loading' | 'success' | 'error'
  const [error, setError] = useState('')

  const handleChange = e => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.full_name || !form.email || !form.message) {
      setError('Please fill in all required fields.')
      return
    }
    setStatus('loading')
    setError('')
    try {
      await axios.post('/api/inquiries', form)
      setStatus('success')
      setForm({ full_name: '', email: '', phone: '', apartment_id: '', message: '' })
    } catch {
      setStatus('error')
      setError('Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="contact-form__success">
        <FaCheckCircle className="contact-form__success-icon" />
        <h3>Inquiry Sent!</h3>
        <p>Thank you for reaching out. Our team will contact you within 24 hours.</p>
        <button className="btn btn-gold btn-sm" onClick={() => setStatus(null)}>
          Send Another
        </button>
      </div>
    )
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="contact-form__error">
          <FaExclamationCircle /> {error}
        </div>
      )}

      <div className="contact-form__row">
        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input
            type="text"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            placeholder="Your full name"
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email Address *</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className="form-input"
            required
          />
        </div>
      </div>

      <div className="contact-form__row">
        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+251 9XX XXX XXX"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Property of Interest</label>
          <select name="apartment_id" value={form.apartment_id} onChange={handleChange} className="form-select">
            <option value="">Select a property (optional)</option>
            {apartments.map(apt => (
              <option key={apt.id} value={apt.id}>{apt.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Message *</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Tell us about your requirements..."
          className="form-textarea"
          rows={4}
          required
        />
      </div>

      <button type="submit" className="btn btn-gold btn-lg contact-form__submit" disabled={status === 'loading'}>
        {status === 'loading' ? (
          <span className="contact-form__spinner" />
        ) : (
          <><FaPaperPlane /> Send Inquiry</>
        )}
      </button>
    </form>
  )
}
