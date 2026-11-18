import { useState, useEffect } from "react";
import "./App.css";

function App() {
  // notes are loaded from localStorage so they survive a page refresh
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("notes");
    return saved ? JSON.parse(saved) : [];
  });
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null); // null = adding, otherwise = editing

  // save notes whenever they change
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // ADD or UPDATE
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editId !== null) {
      setNotes(
        notes.map((n) => (n.id === editId ? { ...n, title, content } : n))
      );
      setEditId(null);
    } else {
      setNotes([...notes, { id: Date.now(), title, content }]);
    }
    setTitle("");
    setContent("");
  };

  // load a note into the form for editing
  const handleEdit = (note) => {
    setEditId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  // DELETE
  const handleDelete = (id) => {
    setNotes(notes.filter((n) => n.id !== id));
    if (editId === id) handleCancel();
  };

  const handleCancel = () => {
    setEditId(null);
    setTitle("");
    setContent("");
  };

  return (
    <div className="container">
      <h1>Notes App</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="form-buttons">
          <button type="submit">{editId !== null ? "Update Note" : "Add Note"}</button>
          {editId !== null && (
            <button type="button" className="cancel" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="notes">
        {notes.length === 0 && <p className="empty">No notes yet. Add one above!</p>}
        {notes.map((note) => (
          <div className="note" key={note.id}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <div className="note-buttons">
              <button onClick={() => handleEdit(note)}>Edit</button>
              <button className="delete" onClick={() => handleDelete(note.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;