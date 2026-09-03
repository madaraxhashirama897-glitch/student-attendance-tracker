import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

const DATA_FILE = 'attendance_data.json';

// Initialize data file
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ events: [], records: [] }));
}

// Read data
const readData = () => {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
};

// Write data
const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// API Routes

// Get all events
app.get('/api/events', (req, res) => {
  const data = readData();
  res.json(data.events);
});

// Create event
app.post('/api/events', (req, res) => {
  const { name, date, location } = req.body;
  const data = readData();
  const event = {
    id: Date.now(),
    name,
    date,
    location,
    createdAt: new Date().toISOString(),
  };
  data.events.push(event);
  writeData(data);
  res.json(event);
});

// Get attendance records for an event
app.get('/api/events/:eventId/attendance', (req, res) => {
  const { eventId } = req.params;
  const data = readData();
  const records = data.records.filter(r => r.eventId === parseInt(eventId));
  res.json(records);
});

// Add attendance record
app.post('/api/attendance', (req, res) => {
  const { eventId, studentId, studentName, timestamp } = req.body;
  const data = readData();
  
  // Check for duplicate (same student, same event, within 10 seconds)
  const isDuplicate = data.records.some(r => 
    r.eventId === eventId && 
    r.studentId === studentId &&
    Math.abs(new Date(r.timestamp) - new Date(timestamp)) < 10000
  );
  
  if (isDuplicate) {
    return res.status(400).json({ error: 'Duplicate scan detected' });
  }
  
  const record = {
    id: Date.now(),
    eventId,
    studentId,
    studentName,
    timestamp,
  };
  data.records.push(record);
  writeData(data);
  res.json(record);
});

// Get attendance summary for an event
app.get('/api/events/:eventId/summary', (req, res) => {
  const { eventId } = req.params;
  const data = readData();
  const records = data.records.filter(r => r.eventId === parseInt(eventId));
  const uniqueStudents = [...new Set(records.map(r => r.studentId))];
  
  res.json({
    totalAttendees: uniqueStudents.length,
    totalScans: records.length,
    records,
  });
});

// Delete attendance record
app.delete('/api/attendance/:recordId', (req, res) => {
  const { recordId } = req.params;
  const data = readData();
  data.records = data.records.filter(r => r.id !== parseInt(recordId));
  writeData(data);
  res.json({ success: true });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});