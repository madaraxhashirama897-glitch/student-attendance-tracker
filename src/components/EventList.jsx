import { formatDistanceToNow } from 'date-fns'
import './EventList.css'

function EventList({ events, onSelectEvent }) {
  if (events.length === 0) {
    return <div className="empty-state">No events created yet. Create one to get started!</div>
  }

  return (
    <div className="event-list">
      {events.map(event => (
        <div key={event.id} className="event-card">
          <div className="event-header">
            <h3>{event.name}</h3>
            <span className="event-date">
              {new Date(event.date).toLocaleDateString()} {new Date(event.date).toLocaleTimeString()}
            </span>
          </div>
          <p className="event-location">📍 {event.location}</p>
          <p className="event-meta">
            Created {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
          </p>
          <button
            className="action-button"
            onClick={() => onSelectEvent(event)}
          >
            Start Scanning →
          </button>
        </div>
      ))}
    </div>
  )
}

export default EventList
