# Nepal Flood Response Dashboard

A live, full-stack disaster-response coordination tool — built in response to
the August 2026 Nepal floods, where communication breakdowns and damaged
infrastructure made it difficult to coordinate real-time relief efforts.

**Live demo:** https://disaster-response-dashboard.onrender.com

## What it does
- Submit field reports (medical, water, shelter, missing person) with a
  location on an interactive map
- Color-coded, filterable markers by need type
- Status workflow: open → in progress → resolved
- Live polling — dashboard auto-refreshes every 10 seconds for multi-user
  coordination

## Tech stack
- **Backend:** Node.js, Express, REST API
- **Frontend:** Leaflet.js, vanilla JavaScript
- **Deployment:** Render, with GitHub-integrated CI

## Running it locally
```
git clone https://github.com/Shayan7555/disaster-response-dashboard.git
cd disaster-response-dashboard
npm install
node server.js
```
Then open http://localhost:3000

## Project structure
```
disaster-response/
├── server.js          # Express backend + REST API
├── data/reports.json  # simple file-based "database"
├── public/index.html  # frontend: map + form (Leaflet.js)
└── package.json       # dependencies
```

## What I learned building this
- Designing and testing a REST API (GET/POST/PATCH) with curl before
  building any UI, to isolate backend bugs from frontend bugs
- Debugging real-world deployment issues — dynamic PORT assignment,
  environment differences between local and production
- Git/GitHub workflow: staging, committing, pushing, and connecting a repo
  to a live deployment pipeline

## Known limitations
- Data is stored in a JSON file, which resets whenever the server restarts
  on Render's free tier (no persistent disk). A future version would move
  to a real database (e.g. PostgreSQL).

## Possible next steps
- Real SMS/WhatsApp intake via Twilio (a stub endpoint is already
  scaffolded at `/api/sms-webhook`)
- Persistent database instead of file-based storage
- User authentication for coordinators
