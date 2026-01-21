import { useEffect, useState } from "react";
import { getHistory } from "../api/shortUrlApi";
import UrlTable from "../components/UrlTable";

export default function History() {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    getHistory().then(setUrls);
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this URL?")) return;

    try {
      const response = await fetch(`http://localhost:5000/urls/${id}`, { method: "DELETE" });
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

  return (
    <div>
      <h1>URL History</h1>
      <UrlTable urls={urls} onDelete={handleDelete} />
    </div>
  );
}
