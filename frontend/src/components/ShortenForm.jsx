import { useState } from "react";
import QrModal from "./QrModal";

export default function ShortenForm() {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://localhost:5000/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullUrl: url, customAlias: alias }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
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
          placeholder="https://example.com"
          required
        />
        <input
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          placeholder="Custom Alias (Optional)"
          style={{ flex: "0 0 150px" }} 
        />
        <button type="submit">Create Short URL</button>
      </form>

      {error && (
        <div style={{ color: "#ef4444", marginBottom: "20px", textAlign: "center" }}>⚠️ {error}</div>
      )}

      {result && (
        <div className="result-card">
          <p>
            Short URL:{" "}
            <a href={result.shortUrl} target="_blank">
              {result.shortUrl}
            </a>
          </p>
          <QrModal shortUrl={result.shortUrl} />
        </div>
      )}
    </>
  );
}
