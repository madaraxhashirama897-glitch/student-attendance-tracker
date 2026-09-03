import { useState, useEffect, useRef } from 'react'
import './AttendanceScanner.css'
import AttendanceSummary from './AttendanceSummary'

function AttendanceScanner({ event }) {
  const [barcodeInput, setBarcodeInput] = useState('')
  const [studentName, setStudentName] = useState('')
  const [records, setRecords] = useState([])
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const barcodeInputRef = useRef(null)

  useEffect(() => {
    fetchRecords()
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus()
    }
  }, [event])

  const fetchRecords = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/events/${event.id}/attendance`)
      const data = await response.json()
      setRecords(data)
    } catch (error) {
      console.error('Error fetching records:', error)
    }
  }

  const showMessage = (text, type) => {
    setMessage(text)
    setMessageType(type)
    setTimeout(() => setMessage(''), 3000)
  }

  const handleBarcodeSubmit = async (e) => {
    e.preventDefault()

    if (!barcodeInput.trim() || !studentName.trim()) {
      showMessage('Please enter both barcode and student name', 'error')
      return
    }

    try {
      const response = await fetch('http://localhost:3001/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: event.id,
          studentId: barcodeInput,
          studentName: studentName,
          timestamp: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to record attendance')
      }

      await fetchRecords()
      setBarcodeInput('')
      setStudentName('')
      showMessage(`✓ ${studentName} marked present!`, 'success')
      barcodeInputRef.current?.focus()
    } catch (error) {
      showMessage(error.message, 'error')
    }
  }

  const handleDeleteRecord = async (recordId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/attendance/${recordId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete record')

      await fetchRecords()
      showMessage('Record deleted', 'info')
    } catch (error) {
      showMessage(error.message, 'error')
    }
  }

  return (
    <div className="scanner-container">
      <div className="scanner-header">
        <h2>{event.name}</h2>
        <p>{new Date(event.date).toLocaleDateString()} • {event.location}</p>
      </div>

      <div className="scanner-layout">
        <div className="scanner-panel">
          <form onSubmit={handleBarcodeSubmit} className="barcode-form">
            <h3>Scan Student ID</h3>
            
            <div className="form-group">
              <label htmlFor="studentName">Student Name</label>
              <input
                type="text"
                id="studentName"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter student name"
                autoComplete="off"
              />
            </div>

            <div className="form-group">
              <label htmlFor="barcode">Barcode / ID Number</label>
              <input
                ref={barcodeInputRef}
                type="text"
                id="barcode"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder="Scan barcode or enter ID"
                autoComplete="off"
                className="barcode-input"
              />
            </div>

            <button type="submit" className="scan-button">
              📸 Record Attendance
            </button>
          </form>

          {message && (
            <div className={`message ${messageType}`}>
              {message}
            </div>
          )}

          <AttendanceSummary eventId={event.id} />
        </div>

        <div className="records-panel">
          <h3>Recent Scans</h3>
          {records.length === 0 ? (
            <p className="empty-records">No attendance records yet</p>
          ) : (
            <div className="records-list">
              {records.slice().reverse().map((record) => (
                <div key={record.id} className="record-item">
                  <div className="record-info">
                    <strong>{record.studentName}</strong>
                    <span className="record-id">ID: {record.studentId}</span>
                    <span className="record-time">
                      {new Date(record.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteRecord(record.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AttendanceScanner
