// server.js — the backend. This process stays running and listens for
// HTTP requests (from a browser, or later, from Twilio's SMS webhook).

const express = require('express');
const cors = require('cors');
const fs = require('fs');       // Node's built-in file system module
const path = require('path');   // helps build file paths safely across OSes

const app = express();
// Render (and most hosting platforms) assign a port dynamically via an
// environment variable called PORT. process.env.PORT reads that value.
// If it's not set (e.g. running locally on your own machine), we fall
// back to 3000, same as before.
const PORT = process.env.PORT || 3000;

// Where our "database" lives for now — just a JSON file.
const DATA_FILE = path.join(__dirname, 'data', 'reports.json');

// --- Middleware ---
app.use(cors());                       // allow the frontend to call this API
app.use(express.json());               // parse incoming JSON bodies into req.body
app.use(express.static('public'));     // serve our frontend files (index.html etc.)

// --- Helper functions to read/write our "database" ---

function readReports() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

function writeReports(reports) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(reports, null, 2));
}

// --- Routes ---

app.get('/api/reports', (req, res) => {
  const reports = readReports();
  res.json(reports);
});

app.post('/api/reports', (req, res) => {
  const { type, description, lat, lng, contact } = req.body;

  if (!type || !lat || !lng) {
    return res.status(400).json({ error: 'type, lat, and lng are required' });
  }

  const reports = readReports();

  const newReport = {
    id: Date.now().toString(),
    type,
    description: description || '',
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    contact: contact || '',
    status: 'open',
    createdAt: new Date().toISOString(),
  };

  reports.push(newReport);
  writeReports(reports);

  res.status(201).json(newReport);
});

app.patch('/api/reports/:id', (req, res) => {
  const reports = readReports();
  const report = reports.find(r => r.id === req.params.id);

  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  if (req.body.status) report.status = req.body.status;
  writeReports(reports);
  res.json(report);
});

// --- Stub for future SMS integration (Twilio) ---
app.post('/api/sms-webhook', (req, res) => {
  console.log('Incoming SMS (simulated):', req.body);
  res.status(200).send('<Response></Response>');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
