# YouTube Companion Dashboard

This is a **YouTube Companion Dashboard** project. It allows you to:

- View YouTube video details and top comments (read-only)
- Add, view, and delete your own notes
- Add, view, and delete mock comments
- Track events using logs

The backend is hosted on Render, and the frontend is deployed on Vercel.

---

## Base URL (Backend)

https://youtube-backend-un6n.onrender.com

yaml
---

## API Endpoints

### 1. Notes

- **Get all notes**
GET /notes
**Response:**
```json
[
  {
    "id": 1695328000000,
    "text": "Sample note"
  }
]
Add a new note

bash
POST /notes
Request Body:

json
{
  "text": "Your note text"
}
Response:

json
{
  "id": 1695328000000,
  "text": "Your note text"
}
Delete a note

bash
DELETE /notes/:id
Response:

json
{
  "success": true
}
2. Comments (Mock)
Get all comments

bash
GET /comments
Response:

json
[
  {
    "id": 1695328100000,
    "text": "Sample comment"
  }
]
Add a new comment

bash
POST /comments
Request Body:

json
{
  "text": "Your comment text"
}
Response:

json
{
  "id": 1695328100000,
  "text": "Your comment text"
}
Delete a comment

bash
DELETE /comments/:id
Response:

json
{
  "success": true
}
3. Logs
Get all logs

bash
GET /logs
Response:

json
[
  {
    "event": "note_added",
    "timestamp": 1695328000000
  }
]
Add a log event (optional)

bash
POST /logs
Request Body:

json
{
  "action": "ADD_NOTE",
  "details": "Sample note added",
  "timestamp": "2025-09-21T10:00:00.000Z"
}
Database Schema (In-Memory)
Notes
Field	Type	Description
id	Number	Unique note ID
text	String	Note content

Comments
Field	Type	Description
id	Number	Unique comment ID
text	String	Comment content

Logs
Field	Type	Description
event	String	Event name (note_added, etc)
timestamp	Number	Event timestamp (ms)

⚠️ Note: This backend uses in-memory arrays for storage. All data will reset on server restart. For production, we can use a database like MongoDB.

Run Locally
Install dependencies:

nginx

npm install
Start the server:

nginx

node server.js
Backend will run at http://localhost:5000.

Frontend Deployment
Set your backend URL in App.js or via environment variable:

js

const BACKEND_URL = "https://youtube-backend-un6n.onrender.com";
Deploy the frontend to Vercel or any hosting service.
Ensure CORS is enabled on the backend to allow communication.

Features
Display video title, description, and embedded YouTube video

Fetch YouTube comments (read-only)

Add, view, delete notes

Add, view, delete mock comments

Log user actions for auditing