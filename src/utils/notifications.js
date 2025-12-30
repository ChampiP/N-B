// Utilidad para manejar notificaciones push
export const NotificationService = {
  // Verificar si las notificaciones están soportadas
  isSupported: () => {
    return 'Notification' in window && 'serviceWorker' in navigator;
  },

  // Solicitar permiso para notificaciones
  requestPermission: async () => {
    if (!NotificationService.isSupported()) {
      console.log('Las notificaciones no están soportadas en este navegador');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  },

  // Registrar el Service Worker
  registerServiceWorker: async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registrado:', registration);
        return registration;
      } catch (error) {
        console.error('Error registrando Service Worker:', error);
        return null;
      }
    }
    return null;
  },

  // Enviar notificación local
  sendLocalNotification: (title, options = {}) => {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        vibrate: [100, 50, 100],
        ...options
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    }
    return null;
  },

  // Verificar si hay mensajes secretos nuevos y notificar
  checkSecretMessages: () => {
    const secretMessages = [
      { id: 1, unlockDate: '2025-12-25', title: '🎄 Navidad Juntos' },
      { id: 2, unlockDate: '2025-12-31', title: '🎆 Año Nuevo' },
      { id: 3, unlockDate: '2026-01-13', title: '💜 Un Mes Juntos' },
      { id: 4, unlockDate: '2026-02-14', title: '💝 San Valentín' },
      { id: 5, unlockDate: '2026-06-13', title: '🎊 6 Meses' },
      { id: 6, unlockDate: '2026-12-13', title: '🎂 Un Año de Amor' }
    ];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const viewedMessages = JSON.parse(localStorage.getItem('nb_viewed_secrets') || '[]');
    const lastNotified = JSON.parse(localStorage.getItem('nb_notified_secrets') || '[]');

    // Buscar mensajes recién desbloqueados que no han sido notificados
    const newUnlocked = secretMessages.filter(msg => {
      const unlockDate = new Date(msg.unlockDate);
      unlockDate.setHours(0, 0, 0, 0);
      return unlockDate.getTime() === today.getTime() && 
             !viewedMessages.includes(msg.id) && 
             !lastNotified.includes(msg.id);
    });

    if (newUnlocked.length > 0) {
      newUnlocked.forEach(msg => {
        NotificationService.sendLocalNotification(
          '💜 ¡Nuevo mensaje secreto!',
          {
            body: `${msg.title} - ¡Se ha desbloqueado un mensaje especial para ti! 💕`,
            tag: `secret-${msg.id}`,
            requireInteraction: true
          }
        );
        
        // Marcar como notificado
        lastNotified.push(msg.id);
      });
      
      localStorage.setItem('nb_notified_secrets', JSON.stringify(lastNotified));
    }

    return newUnlocked;
  },

  // Programar verificación periódica
  startPeriodicCheck: (intervalMinutes = 60) => {
    // Verificar inmediatamente
    NotificationService.checkSecretMessages();
    
    // Verificar periódicamente
    setInterval(() => {
      NotificationService.checkSecretMessages();
    }, intervalMinutes * 60 * 1000);
  }
};

export default NotificationService;
