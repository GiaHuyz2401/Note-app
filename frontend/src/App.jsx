import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/notes";

function NoteApp() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Lay danh sach ghi chu khi component render lan dau
  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Khong the lay danh sach ghi chu.");
      }

      const data = await response.json();
      setNotes(data);
    } catch (err) {
      setError(
        "Khong ket noi duoc Backend. Hay kiem tra server port 5000."
      );
    } finally {
      setLoading(false);
    }
  }

  // Them ghi chu moi
  async function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Vui long nhap tieu de ghi chu.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Khong them duoc ghi chu.");
      }

      // Cap nhat giao dien ngay, khong reload trang
      setNotes((previousNotes) => [data, ...previousNotes]);

      setTitle("");
      setContent("");
    } catch (err) {
      setError(err.message || "Da xay ra loi khi them ghi chu.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="app">
      <header className="header">
        <h1>📝 Note App</h1>
        <p>Quan ly ghi chu cua ban</p>
      </header>

      <section className="form-card">
        <h2>Them ghi chu moi</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Tieu de</label>
          <input
            id="title"
            type="text"
            placeholder="Nhap tieu de..."
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />

          <label htmlFor="content">Noi dung</label>
          <textarea
            id="content"
            placeholder="Nhap noi dung ghi chu..."
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows="4"
          />

          <button type="submit" disabled={submitting}>
            {submitting ? "Dang them..." : "Them Ghi Chu"}
          </button>
        </form>
      </section>

      {error && <p className="error">{error}</p>}

      <section className="notes-section">
        <h2>Danh sach ghi chu ({notes.length})</h2>

        {loading ? (
          <p>Dang tai ghi chu...</p>
        ) : notes.length === 0 ? (
          <p>Chua co ghi chu nao. Hay tao ghi chu dau tien!</p>
        ) : (
          <div className="notes-list">
            {notes.map((note) => (
              <article className="note-card" key={note._id}>
                <h3>{note.title}</h3>
                <p className="note-content">
                  {note.content || "Khong co noi dung"}
                </p>
                <small>
                  Ngay tao:{" "}
                  {note.createdAt
                    ? new Date(note.createdAt).toLocaleString("vi-VN")
                    : "Chua co thong tin"}
                </small>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default NoteApp;
