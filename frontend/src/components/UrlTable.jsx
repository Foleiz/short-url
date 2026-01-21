import { useState } from "react";
import QrModal from "./QrModal";

export default function UrlTable({ urls, onDelete }) {
  const [selectedUrl, setSelectedUrl] = useState(null);

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Full URL</th>
            <th>Short URL</th>
            <th>Clicks</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((u) => (
            <tr key={u._id}>
              <td>{u.fullUrl}</td>
              <td>
                <a href={u.shortUrl} target="_blank">
                  {u.shortUrl}
                </a>
              </td>
              <td>{u.clickCount}</td>
              <td>
                <div style={{ display: "flex", gap: "8px", justifyContent: "center", alignItems: "center" }}>
                  <button onClick={() => setSelectedUrl(u.shortUrl)} style={{ padding: "8px 12px", fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                    QR Code
                  </button>
                  {onDelete && (
                    <button 
                      onClick={() => onDelete(u._id)} 
                      style={{ padding: "8px 12px", fontSize: "0.85rem", backgroundColor: "#ef4444", whiteSpace: "nowrap" }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUrl && (
        <div className="modal-overlay" onClick={() => setSelectedUrl(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <QrModal shortUrl={selectedUrl} />
            <button onClick={() => setSelectedUrl(null)} style={{ marginTop: "20px", backgroundColor: "#64748b" }}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
