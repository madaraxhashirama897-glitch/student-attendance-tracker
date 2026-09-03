import { useState, useEffect } from 'react'
import './App.css'
import EventList from './components/EventList'
import EventForm from './components/EventForm'
import AttendanceScanner from './components/AttendanceScanner'
import AttendanceSummary from './components/AttendanceSummary'

function App() {
  const [currentView, setCurrentView] = useState('events')
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/events')
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      console.error('Error fetching events:', error)
    }
  }

  const handleCreateEvent = async (event) => {
    await fetchEvents()
    setCurrentView('events')
  }

  const handleSelectEvent = (event) => {
    setSelectedEvent(event)
    setCurrentView('scanner')
  }

  const handleBackToEvents = () => {
    setCurrentView('events')
    setSelectedEvent(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>📋 Student Attendance Tracker</h1>
        <p>Track attendance with barcode scanning</p>
      </header>

      {currentView === 'events' && (
        <div className="main-content">
          <div className="content-section">
            <h2>Create New Event</h2>
            <EventForm onEventCreated={handleCreateEvent} />
          </div>
          <div className="content-section">
            <h2>Existing Events</h2>
            <EventList events={events} onSelectEvent={handleSelectEvent} />
          </div>
        </div>
      )}

      {currentView === 'scanner' && selectedEvent && (
        <div className="main-content">
          <button className="back-button" onClick={handleBackToEvents}>← Back to Events</button>
          <AttendanceScanner event={selectedEvent} />
        </div>
      )}
    </div>
  )
}

export default App
