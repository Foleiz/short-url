import { useState } from "react";
import QrModal from "./QrModal";

export default function UrlTable({ urls, onDelete, onDeleteSelected, onEdit }) {
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  // ฟังก์ชันเลือกทั้งหมด / ยกเลิกทั้งหมด
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(urls.map((u) => u._id));
    } else {
      setSelectedIds([]);
    }
  };

  // ฟังก์ชันเลือกทีละรายการ
  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <>
      {onDeleteSelected && (
        <div style={{ marginBottom: "15px", display: "flex", justifyContent: "flex-end" }}>
          <button 
            onClick={() => { if (selectedIds.length > 0) { onDeleteSelected(selectedIds); setSelectedIds([]); } }} 
            disabled={selectedIds.length === 0}
            style={{ backgroundColor: selectedIds.length > 0 ? "#ef4444" : "#cbd5e1", cursor: selectedIds.length > 0 ? "pointer" : "not-allowed" }}
          >
            Delete Selected ({selectedIds.length})
          </button>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Full URL</th>
            <th>Short URL</th>
            <th>Clicks</th>
            <th>Action</th>
            <th>
              <input type="checkbox" onChange={handleSelectAll} checked={urls.length > 0 && selectedIds.length === urls.length} />
            </th>
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
                  {onEdit && (
                    <button 
                      onClick={() => onEdit(u)} 
                      style={{ padding: "8px 12px", fontSize: "0.85rem", backgroundColor: "#f59e0b", whiteSpace: "nowrap" }}
                    >
                      Edit
                    </button>
                  )}
                </div>
              </td>
              <td>
                <input 
                  type="checkbox" 
                  checked={selectedIds.includes(u._id)} 
                  onChange={() => handleSelectOne(u._id)} 
                />
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
