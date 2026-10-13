// ⚠️ ลิงก์ Google Apps Script Backend
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxp7RJqJIajrEx8J9IVnJC75saIt_FeiQDUxNgxnP7vrYOy7xcYy77RqXljRUXv_xHm/exec";

const HARDCODED_LOGO = "https://i.postimg.cc/wBN5btrp/rong-re-yn-kham-wng.png";
const HARDCODED_NAME = "STUDENT COUNCIL • KHAMMUANG SCHOOL";
const ADMIN_AVATAR_URL = "https://i.postimg.cc/K8nwK3rc/att-t8x-q-Ucw-G9JVKpv-Lq-G9t-GAMr-Hq-Ma-Gedads-WR6q-Lut-Yw.jpg";
const DEFAULT_GEMINI_KEY = ["AQ.Ab8RN6IYK", "_MZisi6uunj98GG", "OCNmmzHLofcgqJY", "zNyt6k6YfkQ"].join("");

const SESSION_TIMEOUT_MS = 5 * 60 * 1000;

const safeGetItem = (key) => { try { return localStorage.getItem(key); } catch(e) { return null; } };
const safeSetItem = (key, val) => { try { localStorage.setItem(key, val); } catch(e) {} };
const safeRemoveItem = (key) => { try { localStorage.removeItem(key); } catch(e) {} };
const safeSessionGet = (key) => { try { return sessionStorage.getItem(key); } catch(e) { return null; } };
const safeSessionSet = (key, val) => { try { sessionStorage.setItem(key, val); } catch(e) {} };
const safeSessionRemove = (key) => { try { sessionStorage.removeItem(key); } catch(e) {} };

const getValidSessionState = () => {
    try {
        const raw = safeSessionGet('zc26_active_session');
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || !parsed.mode || parsed.mode === 'guest') return null;
        const now = Date.now();
        if (parsed.lastActive && (now - parsed.lastActive) > SESSION_TIMEOUT_MS) {
            safeSessionRemove('zc26_active_session');
            return null;
        }
        return parsed;
    } catch (e) { return null; }
};

const initialSettings = {
    passcode: "1234", master_passcode: "9999", is_maintenance: "false",
    app_logo_url: "", logo_url: "", school_logo_url: "", zone_map_url: "", room_map_url: "",
    banner_url: "", main_banner_url: "", popup_banner_url: "",
    announcement_title: "", announcement_msg: "",
    visibility_main_banner: "public", visibility_popup_banner: "public", visibility_announce_banner: "public",
    inspector_avatars_json: "{}",
    signers_json: "[]",
    signature_presets_json: "[]",
    default_signature_preset: "none",
    admin_avatar_url: ADMIN_AVATAR_URL,
    admin_name: "นายภูธนากร หงษ์ทอง (พี่ภีม)",
    admin_role: "เลขานุการสภานักเรียนโรงเรียนคำม่วง",
    admin_line_url: "https://line.me/ti/p/~470aijh",
    app_title: "ZoneCheck",
    app_version: "V3.0",
    map_pins_json: "{}",
    gemini_api_key: DEFAULT_GEMINI_KEY,
    ai_bot_name: "น้องสภาฯ"
};

const ROOM_CRITERIA = [
    { id: 'c1', name: "โต๊ะ" }, { id: 'c2', name: "ขยะ" },
    { id: 'c3', name: "ไฟ/หน้าต่าง" }, { id: 'c4', name: "พื้น" }, { id: 'c5', name: "กระดาน" }
];
