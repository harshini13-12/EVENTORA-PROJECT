// admin.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'shreya@2005', // replace with your DB password
  database: 'eventsDB'
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection failed:', err);
    return;
  }
  console.log('Connected to MySQL Database!');
});

// Create events table if not exists
db.query(`
  CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    eventName VARCHAR(255),
    category VARCHAR(100),
    club VARCHAR(100),
    venue VARCHAR(255),
    time DATETIME,
    regLink TEXT,
    description TEXT
  )
`);

// Example student email list (can replace with DB query later)
const studentEmails = [
  'E23CSEU0537@bennett.edu.in',
  'student2@example.com',
  'student3@example.com'
];

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
   user: 'teameventora@gmail.com',         // ✅ Replace with your email
      pass: 'khnn haci zhmn onii'           // use an app password (not your Gmail login)
  }
});

// Get all events
app.get('/api/events', (req, res) => {
  db.query('SELECT * FROM events ORDER BY time ASC', (err, results) => {
    if (err) {
      console.error('Error fetching events:', err);
      return res.status(500).send('Server error');
    }
    res.json(results);
  });
});

// Add new event and send email
app.post('/api/events', (req, res) => {
  const { eventName, category, club, venue, time, regLink, description } = req.body;
  const sql = 'INSERT INTO events (eventName, category, club, venue, time, regLink, description) VALUES (?, ?, ?, ?, ?, ?, ?)';

  db.query(sql, [eventName, category, club, venue, time, regLink, description], (err, result) => {
    if (err) {
      console.error('Error inserting event:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    // Prepare the email
    const mailOptions = {
      from: 'teameventora@gmail.com', // same as above
      to: studentEmails.join(','),
      subject: `New Event: ${eventName}`,
      text: `There is a new event!\n\nEvent: ${eventName}\nCategory: ${category}\nClub: ${club}\nVenue: ${venue}\nTime: ${time}\n\nCheck the portal for details.`
    };

    // Send the email
    transporter.sendMail(mailOptions, (emailErr, info) => {
      if (emailErr) {
        console.error('Email error:', emailErr);
        return res.status(201).json({ message: 'Event added, but email failed to send.', id: result.insertId });
      } else {
        console.log('Email sent: ' + info.response);
        return res.status(201).json({ message: 'Event added and email sent.', id: result.insertId });
      }
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
