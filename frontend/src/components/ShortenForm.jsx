import { useState } from "react";
import CreateQr from "./CreateQr";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function CreateLink() {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_url: url,
          custom_code: alias,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "เกิดข้อผิดพลาด");
      }
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="ตัวอย่าง: https://example.com"
          required
        />
        <input
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          placeholder="ตั้งชื่อย่อเอง"
          style={{ flex: "0 0 150px" }}
        />
        <button type="submit">Create Short URL</button>
      </form>

      {error && (
        <div style={{ color: "#ef4444", marginBottom: 20, textAlign: "center" }}>
          ⚠️ {error}
        </div>
      )}

      {result && (
        <div className="result-card">
          <p>
            ลิงก์ย่อของคุณ:{" "}
            <a href={result.shortUrl} target="_blank" rel="noreferrer">
              {result.shortUrl}
            </a>
          </p>
          <CreateQr shortUrl={result.shortUrl} />
        </div>
      )}
    </>
  );
}
