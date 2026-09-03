# Student Attendance Tracker

A modern web application for tracking student attendance at events and activities with barcode scanning support.

## Features

✅ **Event Management**
- Create and manage events with name, date, location
- View all existing events

✅ **Barcode Scanning**
- Scan student ID barcodes for quick attendance recording
- Manual ID entry if barcode scanning unavailable
- Duplicate scan detection (within 10 seconds)

✅ **Real-time Tracking**
- Live attendance records display
- Attendance summary statistics
- Delete records if needed

✅ **User-friendly Interface**
- Responsive design for all devices
- Clean, modern UI with gradient design
- Real-time feedback messages
- Auto-focus on barcode input for seamless scanning

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Express.js
- **Styling**: CSS3 with gradients and animations
- **Data Storage**: JSON file (local)

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/madaraxhashirama897-glitch/student-attendance-tracker.git
   cd student-attendance-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## Running the Application

### Development Mode

1. **Terminal 1 - Start the backend server**
   ```bash
   npm run server
   ```
   The API will run on `http://localhost:3001`

2. **Terminal 2 - Start the frontend development server**
   ```bash
   npm run dev
   ```
   The app will run on `http://localhost:3000`

### Production Build

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Start the server**
   ```bash
   npm run server
   ```

## Usage

### Creating an Event
1. Enter the event name, date/time, and location
2. Click "Create Event"
3. The event will appear in the events list

### Recording Attendance
1. Click "Start Scanning" on an event
2. Enter the student's name
3. Scan the barcode (or manually enter the ID)
4. Click "Record Attendance" or press Enter
5. Confirmation message will appear
6. The record will be added to the list and summary updated

### Managing Records
- View all attendance records in real-time
- Delete records by clicking the ✕ button
- View attendance statistics in the summary panel

## API Endpoints

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `GET /api/events/:eventId/summary` - Get attendance summary

### Attendance
- `GET /api/events/:eventId/attendance` - Get attendance records for an event
- `POST /api/attendance` - Record attendance
- `DELETE /api/attendance/:recordId` - Delete attendance record

## Data Storage

The application stores data in a JSON file (`attendance_data.json`) with the following structure:

```json
{
  "events": [
    {
      "id": 1234567890,
      "name": "Event Name",
      "date": "2026-09-03T10:00:00",
      "location": "Room 101",
      "createdAt": "2026-09-03T09:00:00Z"
    }
  ],
  "records": [
    {
      "id": 1234567891,
      "eventId": 1234567890,
      "studentId": "2024001",
      "studentName": "John Doe",
      "timestamp": "2026-09-03T10:05:00Z"
    }
  ]
}
```

## Features to Implement (Future)

- 📊 Advanced reporting and analytics
- 📱 Mobile app version
- 🔐 User authentication and authorization
- 📧 Email notifications
- 📥 CSV/Excel export functionality
- 📱 Camera-based QR code scanning (instead of manual barcode)
- 🎯 Geolocation-based attendance
- 📱 Student check-in via mobile app

## Troubleshooting

### Barcode scanner not working?
- Make sure the barcode is in a supported format
- Try manual entry if scanning fails
- Check that the barcode scanner is configured to send keyboard input

### Port already in use?
- Backend: Change PORT in `server.js`
- Frontend: Modify the port in `vite.config.js`

### Data not persisting?
- Check file permissions for `attendance_data.json`
- Ensure the application has write access to the directory

## License

MIT License - feel free to use this project for educational purposes.

## Support

For issues or questions, please open an issue on GitHub.
