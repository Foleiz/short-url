import { QRCodeCanvas } from "qrcode.react";

export default function CreateQr({ shortUrl }) {
  let qrValue = shortUrl;

  try {
    if (shortUrl) {
      // ตรวจสอบและเติม http ถ้าไม่มี
      const urlObj = new URL(shortUrl.startsWith("http") ? shortUrl : `http://${shortUrl}`);
      
      // ถ้า URL เป็น localhost ให้เปลี่ยนเป็น IP ของเครื่องที่เปิดเว็บอยู่ (window.location.hostname)
      // เพื่อให้มือถือสแกนแล้ววิ่งมาที่คอมพิวเตอร์ได้
      if (urlObj.hostname === "localhost" || urlObj.hostname === "127.0.0.1") {
        urlObj.hostname = window.location.hostname;
      }
      qrValue = urlObj.toString();
    }
  } catch (e) {
    console.error("Invalid URL for QR", e);
  }

  return (
    <div className="qr-wrapper">
      <h3>สแกน QR Code</h3>
      <QRCodeCanvas value={qrValue} size={150} />
      <p style={{ marginTop: "10px", fontSize: "0.85rem", color: "#666", wordBreak: "break-all" }}>
        {qrValue}
      </p>
    </div>
  );
}
