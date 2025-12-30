/* global clients */

const CACHE_NAME = 'samirita-v1';

// Mensajes de amor para las notificaciones diarias
const loveMessages = [
  "💜 Buenos días mi amor, tu carta de hoy te espera...",
  "💕 Tengo algo especial para ti hoy...",
  "✨ Un nuevo mensaje de amor te aguarda...",
  "🌸 Hoy te escribí algo bonito...",
  "💌 Tu carta diaria está lista...",
  "🥰 Abre tu regalo de hoy...",
  "💜 Un pedacito de mi corazón te espera...",
  "🌟 Hay algo esperándote con mucho amor..."
];

// Obtener mensaje random
const getRandomMessage = () => {
  return loveMessages[Math.floor(Math.random() * loveMessages.length)];
};

// Archivos a cachear para funcionamiento offline
const urlsToCache = [
  '/',
  '/index.html'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Manejar notificaciones push
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : '¡Tienes un mensaje secreto desbloqueado! 💜',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      url: '/'
    },
    actions: [
      { action: 'open', title: 'Ver ahora 💕' },
      { action: 'close', title: 'Más tarde' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('💜 Samirita', options)
  );
});

// Manejar clic en notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
