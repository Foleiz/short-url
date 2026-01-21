import { QRCodeCanvas } from "qrcode.react";

export default function QrModal({ shortUrl }) {
  return (
    <div>
      <h3>QR Code</h3>
      <QRCodeCanvas value={shortUrl} size={150} />
    </div>
  );
}
