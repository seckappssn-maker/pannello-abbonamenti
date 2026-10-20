// Pannello abbonamenti : riceve gli avvisi delle nuove iscrizioni (anche con il pannello chiuso)
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Seck Apps', {
    body: d.body || '', tag: d.tag || 'iscrizione', renotify: true,
    icon: './apple-touch-icon.png', badge: './apple-touch-icon.png', data: { url: d.url || './' }
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil((async () => {
    const scope = self.registration.scope;
    const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const w of wins) if (w.url.startsWith(scope)) { await w.focus(); return; }
    await self.clients.openWindow(scope);
  })());
});
