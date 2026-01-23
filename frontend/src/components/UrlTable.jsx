import { useState } from "react";
import CreateQr from "./CreateQr";

export default function UrlTable({ urls, onDelete, onDeleteSelected, onEdit }) {
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "Create_Date", direction: "desc" });

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

  const handleDeleteSelected = () => {
    if (selectedIds.length > 0) {
      onDeleteSelected(selectedIds);
      setSelectedIds([]);
    }
  };

  // ฟังก์ชันจัดเรียงข้อมูล
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // จัดเรียงข้อมูล
  const sortedUrls = [...urls].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    // จัดการสำหรับ Date
    if (sortConfig.key === "Create_Date" || sortConfig.key === "Update_Date") {
      const aTime = new Date(aValue).getTime();
      const bTime = new Date(bValue).getTime();
      return sortConfig.direction === "asc" ? aTime - bTime : bTime - aTime;
    }

    // จัดการสำหรับ Number
    if (sortConfig.key === "Click_Count") {
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    // จัดการสำหรับ String
    if (typeof aValue === "string") {
      return sortConfig.direction === "asc" 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  // Component สำหรับ Sortable Header
  const SortableHeader = ({ label, sortKey }) => (
    <th 
      onClick={() => handleSort(sortKey)}
      style={{ 
        cursor: "pointer", 
        userSelect: "none",
        backgroundColor: sortConfig.key === sortKey ? "#e2e8f0" : "transparent",
        transition: "background-color 0.2s"
      }}
      title={`คลิกเพื่อเรียงข้อมูล (${label})`}
    >
      {label} 
      {sortConfig.key === sortKey && (
        <span style={{ marginLeft: "8px", fontSize: "0.8em" }}>
          {sortConfig.direction === "asc" ? "↑" : "↓"}
        </span>
      )}
    </th>
  );

  return (
    <>
      {onDeleteSelected && (
        <div style={{ marginBottom: "15px", display: "flex", justifyContent: "flex-end" }}>
          <button 
            onClick={handleDeleteSelected}
            disabled={selectedIds.length === 0}
            style={{ backgroundColor: selectedIds.length > 0 ? "#ef4444" : "#cbd5e1", cursor: selectedIds.length > 0 ? "pointer" : "not-allowed" }}
          >
            ลบที่เลือก ({selectedIds.length})
          </button>
        </div>
      )}

      <div style={{ width: "100%", overflowX: "auto" }}>
      <table style={{ width: "100%", minWidth: "1000px" }}>
        <thead>
          <tr>
            <SortableHeader label="ลิงก์เต็ม" sortKey="Full_Url" />
            <SortableHeader label="ลิงก์ย่อ" sortKey="Short_Url" />
            <SortableHeader label="จำนวนการเข้าชม" sortKey="Click_Count" />
            <SortableHeader label="วันที่สร้าง" sortKey="Create_Date" />
            <SortableHeader label="วันที่แก้ไข" sortKey="Update_Date" />
            <th>การจัดการ</th>
            <th>
              <input type="checkbox" onChange={handleSelectAll} checked={urls.length > 0 && selectedIds.length === urls.length} />
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedUrls.map((u) => (
            <tr key={u._id}>
              <td title={u.Full_Url}>{u.Full_Url}</td>
              <td title={u.shortUrl}>
                <a href={u.shortUrl} target="_blank">
                  {u.shortUrl}
                </a>
              </td>
              <td>{u.Click_Count}</td>
              <td title={u.Create_Date ? new Date(u.Create_Date).toLocaleString('th-TH') : ""}>{u.Create_Date ? new Date(u.Create_Date).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' }) : "-"}</td>
              <td title={u.Update_Date ? new Date(u.Update_Date).toLocaleString('th-TH') : ""}>{u.Update_Date ? new Date(u.Update_Date).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' }) : "-"}</td>
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
                      แก้ไข
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
      </div>

      {selectedUrl && (
        <div className="modal-overlay" onClick={() => setSelectedUrl(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <CreateQr shortUrl={selectedUrl} />
            <button onClick={() => setSelectedUrl(null)} style={{ marginTop: "20px", backgroundColor: "#64748b" }}>ปิด</button>
          </div>
        </div>
      )}
    </>
  );
}
