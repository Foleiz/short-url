export default function UrlTable({ urls }) {
  return (
    <table border="1">
      <thead>
        <tr>
          <th>Full URL</th>
          <th>Short URL</th>
          <th>Clicks</th>
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
          </tr>
        ))}
      </tbody>
    </table>
  );
}
