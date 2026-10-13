// ⚠️ ลิงก์ Google Apps Script Backend
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxp7RJqJIajrEx8J9IVnJC75saIt_FeiQDUxNgxnP7vrYOy7xcYy77RqXljRUXv_xHm/exec";

const DEFAULT_GEMINI_KEY = ["AQ.Ab8RN6IYK", "_MZisi6uunj98GG", "OCNmmzHLofcgqJY", "zNyt6k6YfkQ"].join("");

const SESSION_TIMEOUT_MS = 5 * 60 * 1000;

// localStorage / sessionStorage แบบไม่พังถ้าเบราว์เซอร์บล็อก
const safeGetItem = (key) => { try { return localStorage.getItem(key); } catch(e) { return null; } };
const safeSetItem = (key, val) => { try { localStorage.setItem(key, val); } catch(e) {} };
const safeRemoveItem = (key) => { try { localStorage.removeItem(key); } catch(e) {} };
const safeSessionRemove = (key) => { try { sessionStorage.removeItem(key); } catch(e) {} };
