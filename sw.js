// Finanzas: permite instalar la app y abrirla aunque no haya señal.
// Siempre intenta traer la versión más nueva; solo usa la copia guardada si no hay internet.
const CACHE = 'finanzas-v6';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./Finanzas.html', './manifest.webmanifest', './icono-192.png', './icono-512.png'])).catch(() => {}));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;   // los datos (Sheets) nunca pasan por aquí
  e.respondWith(
    fetch(req).then(res => {
      const copia = res.clone();
      caches.open(CACHE).then(c => c.put(req, copia)).catch(() => {});
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('./Finanzas.html')))
  );
});
