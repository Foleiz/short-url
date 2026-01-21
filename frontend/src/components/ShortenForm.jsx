import { useState } from "react";
import { createShortUrl } from "../api/shortUrlApi";
import QrModal from "./QrModal";

export default function ShortenForm() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await createShortUrl(url);
    setResult(data);
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
        <button type="submit">Create Short URL</button>
      </form>

      {result && (
        <div>
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
