// server.js — the backend. This process stays running and listens for
// HTTP requests (from a browser, or later, from Twilio's SMS webhook).

const express = require('express');
const cors = require('cors');
const fs = require('fs');       // Node's built-in file system module
const path = require('path');   // helps build file paths safely across OSes

const app = express();
const PORT = 3000;

// Where our "database" lives for now — just a JSON file.
const DATA_FILE = path.join(__dirname, 'data', 'reports.json');

// --- Middleware ---
// "Middleware" = functions that run on EVERY request before it reaches
// your route handlers. Order matters — they run top to bottom.

app.use(cors());                       // allow the frontend to call this API
app.use(express.json());               // parse incoming JSON bodies into req.body
                                        // (this replaces the separate body-parser
                                        // package — Express added it natively)
app.use(express.static('public'));     // serve our frontend files (index.html etc.)
                                        // directly, so we don't need a second server

// --- Helper functions to read/write our "database" ---

function readReports() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8'); // read file as text
  return JSON.parse(raw);                          // text -> JS array
}

function writeReports(reports) {
  // null, 2 just makes the saved JSON file human-readable (indented)
  fs.writeFileSync(DATA_FILE, JSON.stringify(reports, null, 2));
}

// --- Routes ---

// GET /api/reports — return every report as JSON
app.get('/api/reports', (req, res) => {
  const reports = readReports();
  res.json(reports);
});

// POST /api/reports — create a new report
app.post('/api/reports', (req, res) => {
  const { type, description, lat, lng, contact } = req.body;

  // Basic validation — never trust incoming data blindly.
  if (!type || !lat || !lng) {
    // 400 = "Bad Request" — the standard HTTP status code for invalid input
    return res.status(400).json({ error: 'type, lat, and lng are required' });
  }

  const reports = readReports();

  const newReport = {
    id: Date.now().toString(),   // quick unique-ish ID for a prototype
    type,                        // e.g. "medical", "water", "shelter", "missing_person"
    description: description || '',
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    contact: contact || '',
    status: 'open',              // could later become "in_progress" / "resolved"
    createdAt: new Date().toISOString(),
  };

  reports.push(newReport);
  writeReports(reports);

  // 201 = "Created" — the correct status code when a POST successfully
  // creates a new resource
  res.status(201).json(newReport);
});

// PATCH /api/reports/:id — update a report's status (e.g. mark resolved)
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
// Twilio would POST here whenever someone texts your number.
// We can't actually receive real texts inside this sandbox (needs a public
// URL + Twilio account), but this shows the shape of how it plugs into
// the exact same reports system.
app.post('/api/sms-webhook', (req, res) => {
  // Twilio sends fields like req.body.From (phone number) and req.body.Body (text)
  console.log('Incoming SMS (simulated):', req.body);
  res.status(200).send('<Response></Response>'); // Twilio expects TwiML/XML back
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
