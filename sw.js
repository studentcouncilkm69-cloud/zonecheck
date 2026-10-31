// ZoneCheck service worker: ไม่แคชหน้าเว็บ/ข้อมูลใดๆ (โหลดจากอินเทอร์เน็ตเสมอ) ผู้ใช้จึงได้เวอร์ชันล่าสุดทุกครั้ง
// มีไว้เพื่อให้เบราว์เซอร์ถือว่าเว็บนี้ติดตั้งเป็นแอปได้
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request, { cache: 'no-store' }).catch(() => fetch(e.request)));
});
