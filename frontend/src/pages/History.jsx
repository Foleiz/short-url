import { useEffect, useState } from "react";
import { getHistory } from "../api/shortUrlApi";
import UrlTable from "../components/UrlTable";

export default function History() {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    getHistory().then(setUrls);
  }, []);

  return (
    <div>
      <h1>URL History</h1>
      <UrlTable urls={urls} />
    </div>
  );
}
