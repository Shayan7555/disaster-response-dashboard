# Nepal Flood Response Dashboard (learning project)

## What this is
A minimal full-stack app: a map where field reports (medical/water/shelter/
missing person needs) can be submitted and viewed live. Built step-by-step
as a learning project covering Node.js, Express, REST APIs, and Leaflet.js.

## How to run it on your machine

1. **Install Node.js** if you don't have it: https://nodejs.org (LTS version)

2. **Unzip this project**, then open a terminal inside the folder:
   ```
   cd disaster-response
   ```

3. **Install dependencies** (this recreates the node_modules folder,
   which we intentionally didn't include in the zip):
   ```
   npm install
   ```

4. **Start the server**:
   ```
   node server.js
   ```
   You should see: `Server running at http://localhost:3000`

5. **Open your browser** to http://localhost:3000 — you'll see the map
   and the report form.

6. Click on the map to auto-fill coordinates, fill in the form, and submit —
   watch the marker appear immediately.

## Project structure
```
disaster-response/
├── server.js          # Express backend + REST API
├── data/reports.json  # simple file-based "database"
├── public/index.html  # frontend: map + form (Leaflet.js)
└── package.json        # dependencies
```

## What's next (see the roadmap in chat)
- Color-code/filter markers by type
- Status workflow (open → in progress → resolved)
- Live polling for multi-user updates
- Real SMS intake via Twilio
- Deployment + swapping JSON file for a real database
