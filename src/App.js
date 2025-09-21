import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const BACKEND_URL = "https://youtube-backend-un6n.onrender.com";

  // YouTube API
  const VIDEO_ID = "YOCIyUu6rVI";
  const API_KEY = "AIzaSyCM94znEqq4Z1OK2W-0oIUZve9oYSBUCNE";

  const [video, setVideo] = useState(null);
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [comments, setComments] = useState([]);
  const [localComments, setLocalComments] = useState([]); // Mock comments in DB
  const [newComment, setNewComment] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  // helper to log events
  const logEvent = (action, details) => {
    fetch(`${BACKEND_URL}/logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, details, timestamp: new Date() }),
    }).catch((err) => console.error("Log error:", err));
  };

  // Fetch YouTube comments (read-only)
  useEffect(() => {
    fetch(
      `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${VIDEO_ID}&key=${API_KEY}&maxResults=5`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          setComments(data.items);
          logEvent("FETCH_COMMENTS", "Fetched comments from YouTube");
        }
      });
  }, []);

  // Fetch video details from YouTube API
  useEffect(() => {
    fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${VIDEO_ID}&key=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.items && data.items.length > 0) {
          setVideo(data.items[0].snippet);
          setEditTitle(data.items[0].snippet.title);
          setEditDesc(data.items[0].snippet.description);
          logEvent("FETCH_VIDEO", "Fetched video details");
        }
      });
  }, []);

  // Fetch notes from backend
  useEffect(() => {
    fetch(`${BACKEND_URL}/notes`)
      .then((res) => res.json())
      .then((data) => {
        setNotes(data);
        logEvent("FETCH_NOTES", "Fetched notes");
      });
  }, []);

  // Fetch local comments (mock DB)
  useEffect(() => {
    fetch(`${BACKEND_URL}/comments`)
      .then((res) => res.json())
      .then(setLocalComments);
  }, []);

  // Add note
  const addNote = () => {
    if (!noteText.trim()) return;
    fetch(`${BACKEND_URL}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: noteText }),
    })
      .then((res) => res.json())
      .then((newNote) => {
        setNotes([...notes, newNote]);
        setNoteText("");
        logEvent("ADD_NOTE", newNote.text);
      });
  };

  // Delete note
  const deleteNote = (id) => {
    fetch(`${BACKEND_URL}/notes/${id}`, { method: "DELETE" }).then(() => {
      setNotes(notes.filter((n) => n.id !== id));
      logEvent("DELETE_NOTE", id);
    });
  };

  // Add local comment (mock)
  const addLocalComment = () => {
    if (!newComment.trim()) return;
    fetch(`${BACKEND_URL}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newComment }),
    })
      .then((res) => res.json())
      .then((saved) => {
        setLocalComments([...localComments, saved]);
        setNewComment("");
        logEvent("ADD_COMMENT", saved.text);
      });
  };

  // Delete local comment
  const deleteLocalComment = (id) => {
    fetch(`${BACKEND_URL}/comments/${id}`, { method: "DELETE" }).then(() => {
      setLocalComments(localComments.filter((c) => c.id !== id));
      logEvent("DELETE_COMMENT", id);
    });
  };

  // Save edited title/description (mock DB)
  const saveVideoEdits = () => {
    fetch(`${BACKEND_URL}/video`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, description: editDesc }),
    }).then(() => {
      logEvent("EDIT_VIDEO", { title: editTitle, description: editDesc });
      alert("Video details saved (mock DB)");
    });
  };

  return (
    <div className="App">
      <h1>YouTube Companion Dashboard</h1>
      <div className="dashboard-container">
        {/* Video Section */}
        <div className="video-details">
          {video && (
            <>
              <h2>{editTitle}</h2>
              <p>{editDesc}</p>
              <iframe
                src={`https://www.youtube.com/embed/${VIDEO_ID}`}
                title="YouTube Video"
                frameBorder="0"
                allowFullScreen
              ></iframe>

              <div className="edit-video">
                <h3>Edit Video (Mock)</h3>
                <input
                  className="edit-input"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Edit title"
                />
                <textarea
                  className="edit-textarea"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="Edit description"
                />
                <button className="edit-save-btn" onClick={saveVideoEdits}>
                  Save
                </button>
              </div>
            </>
          )}
        </div>

        {/* Comments Section */}
        <div className="comments-section">
          <h2>Comments (YouTube Read-only)</h2>
          {comments.length === 0 && <p>No comments found.</p>}
          {comments.map((item) => {
            const comment = item.snippet.topLevelComment.snippet;
            return (
              <div key={item.id} className="comment">
                <p>
                  <strong>{comment.authorDisplayName}</strong>:{" "}
                  {comment.textDisplay}
                </p>
              </div>
            );
          })}

          <h2>My Comments (Mock)</h2>
          <div className="comment-input">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
            />
            <button onClick={addLocalComment}>Add</button>
          </div>
          <div className="comment-list">
            {localComments.map((c) => (
              <div key={c.id} className="comment-item">
                <p>{c.text}</p>
                <button onClick={() => deleteLocalComment(c.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>

        {/* Notes Section */}
        <div className="notes-section">
          <h2>Notes</h2>
          <div className="note-input">
            <input
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add a note..."
            />
            <button onClick={addNote}>Add Note</button>
          </div>

          <div className="notes-list">
            {notes.map((note) => (
              <div key={note.id} className="note">
                <p>{note.text}</p>
                <button onClick={() => deleteNote(note.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
