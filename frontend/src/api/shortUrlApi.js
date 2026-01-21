import axios from "axios";

const API = "http://localhost:5000/api"; // เปลี่ยนเป็น URL backend ตอน deploy

export const createShortUrl = async (fullUrl) => {
  const res = await axios.post(`${API}/shorten`, { fullUrl });
  return res.data;
};

export const getHistory = async () => {
  const res = await axios.get(`${API}/urls`);
  return res.data;
};
