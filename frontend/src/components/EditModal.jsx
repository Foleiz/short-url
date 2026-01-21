import { useState } from "react";

export default function EditModal({ url, onSave, onClose }) {
  const [fullUrl, setFullUrl] = useState(url.fullUrl);
  const [shortCode, setShortCode] = useState(url.shortCode);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await onSave(url._id, { fullUrl, shortCode });
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ width: "400px" }}>
        <h3>Edit URL</h3>
        <form onSubmit={handleSubmit} style={{ flexDirection: "column", gap: "15px" }}>
          <div>
            <label style={{ display: "block", textAlign: "left", marginBottom: "5px", fontSize: "0.9rem" }}>Full URL</label>
            <input
              value={fullUrl}
              onChange={(e) => setFullUrl(e.target.value)}
              required
              style={{ width: "100%", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ display: "block", textAlign: "left", marginBottom: "5px", fontSize: "0.9rem" }}>Short Code</label>
            <input
              value={shortCode}
              onChange={(e) => setShortCode(e.target.value)}
              required
              style={{ width: "100%", boxSizing: "border-box" }}
            />
          </div>
          
          {error && <p style={{ color: "#ef4444", fontSize: "0.9rem" }}>{error}</p>}
          
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "10px" }}>
            <button type="submit">Save</button>
            <button type="button" onClick={onClose} style={{ backgroundColor: "#64748b" }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}