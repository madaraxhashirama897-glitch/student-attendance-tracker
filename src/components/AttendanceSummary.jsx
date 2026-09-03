import { useState, useEffect } from 'react'
import './AttendanceSummary.css'

function AttendanceSummary({ eventId }) {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSummary()
    const interval = setInterval(fetchSummary, 5000)
    return () => clearInterval(interval)
  }, [eventId])

  const fetchSummary = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/events/${eventId}/summary`)
      const data = await response.json()
      setSummary(data)
    } catch (error) {
      console.error('Error fetching summary:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="summary">Loading...</div>

  return (
    <div className="summary">
      <h4>Attendance Summary</h4>
      <div className="summary-stats">
        <div className="stat-card">
          <span className="stat-label">Total Attendees</span>
          <span className="stat-value">{summary?.totalAttendees || 0}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Scans</span>
          <span className="stat-value">{summary?.totalScans || 0}</span>
        </div>
      </div>
    </div>
  )
}

export default AttendanceSummary
