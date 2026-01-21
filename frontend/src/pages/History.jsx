import { useEffect, useState } from "react";
import UrlTable from "../components/UrlTable";
import EditModal from "../components/EditLink"; // แก้ไขการ import ตรงนี้

export default function History() {
  const [urls, setUrls] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUrl, setEditingUrl] = useState(null);

  useEffect(() => {
    fetch("https://short-url-515v.onrender.com/urls")
      .then((res) => res.json())
      .then((data) => setUrls(data))
      .catch((err) => console.error("Error fetching history:", err));
  }, []);

  // Filter URLs based on search term
  const filteredUrls = urls.filter(u => 
    u.Full_Url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.Short_Url?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this URL?")) return;

    try {
      const response = await fetch(`https://short-url-515v.onrender.com/urls/${id}`, { method: "DELETE" });
      if (response.ok) {
        setUrls(urls.filter((u) => u._id !== id));
      } else {
        alert("ลบข้อมูลไม่สำเร็จ กรุณาตรวจสอบ Backend Server");
      }
    } catch (err) {
      console.error("Failed to delete", err);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    }
  };

  const handleDeleteMultiple = async (ids) => {
    if (!confirm(`Are you sure you want to delete ${ids.length} items?`)) return;

    try {
      // ยิง API ลบทีละตัวแบบ Parallel
      await Promise.all(ids.map((id) => fetch(`https://short-url-515v.onrender.com/urls/${id}`, { method: "DELETE" })));
      setUrls(urls.filter((u) => !ids.includes(u._id)));
    } catch (err) {
      console.error("Failed to delete multiple", err);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  const handleUpdate = async (id, updatedData) => {
    const response = await fetch(`https://short-url-515v.onrender.com/urls/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Update failed");
    }

    const updatedUrl = await response.json();
    setUrls(urls.map(u => u._id === id ? { ...u, ...updatedUrl, shortUrl: `https://short-url-515v.onrender.com/${updatedUrl.Short_Url}` } : u));
  };

  return (
    <div>
      <h1>URL History</h1>
      
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center" }}>
        <input 
          type="text" 
          placeholder="Search URL or Short Code" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "100%", maxWidth: "400px", padding: "10px" }}
        />
      </div>

      <UrlTable urls={filteredUrls} onDelete={handleDelete} onDeleteSelected={handleDeleteMultiple} onEdit={setEditingUrl} />
      
      {editingUrl && (
        <EditModal 
          url={editingUrl} 
          onSave={handleUpdate} 
          onClose={() => setEditingUrl(null)} 
        />
      )}
    </div>
  );
}
