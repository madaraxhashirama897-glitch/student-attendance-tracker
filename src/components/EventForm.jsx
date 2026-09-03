import { useState } from 'react'
import './EventForm.css'

function EventForm({ onEventCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:3001/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to create event')

      setFormData({ name: '', date: '', location: '' })
      onEventCreated()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Event Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Computer Science Seminar"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="date">Date & Time *</label>
        <input
          type="datetime-local"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="location">Location *</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g., Room 101, Building A"
          required
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <button type="submit" disabled={loading} className="submit-button">
        {loading ? 'Creating...' : 'Create Event'}
      </button>
    </form>
  )
}

export default EventForm
