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
        icon: '/icon-192.png',
        badge: '/icon-192.png',
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

  // Mensajes de amor para notificaciones diarias
  loveMessages: [
    "💜 Buenos días mi amor, tu carta de hoy te espera...",
    "💕 Tengo algo especial para ti hoy...",
    "✨ Un nuevo mensaje de amor te aguarda...",
    "🌸 Hoy te escribí algo bonito...",
    "💌 Tu carta diaria está lista...",
    "🥰 Abre tu regalo de hoy...",
    "💜 Un pedacito de mi corazón te espera...",
    "🌟 Hay algo esperándote con mucho amor..."
  ],

  // Programar notificación diaria
  scheduleDailyNotification: (hour = 8, minute = 0) => {
    // Guardar la hora configurada
    localStorage.setItem('nb_notification_hour', hour);
    localStorage.setItem('nb_notification_minute', minute);
    localStorage.setItem('nb_notifications_enabled', 'true');
    
    // Calcular tiempo hasta la próxima notificación
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hour, minute, 0, 0);
    
    // Si ya pasó la hora hoy, programar para mañana
    if (now > scheduledTime) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }
    
    const timeUntilNotification = scheduledTime - now;
    
    console.log(`⏰ Notificación programada para: ${scheduledTime.toLocaleString()}`);
    console.log(`⏱️ Tiempo restante: ${Math.round(timeUntilNotification / 1000 / 60)} minutos`);
    
    // Programar la notificación
    setTimeout(() => {
      NotificationService.sendDailyLoveNotification();
      // Reprogramar para el día siguiente
      NotificationService.scheduleDailyNotification(hour, minute);
    }, timeUntilNotification);
    
    return scheduledTime;
  },

  // Enviar notificación de amor diaria
  sendDailyLoveNotification: () => {
    const lastNotificationDate = localStorage.getItem('nb_last_daily_notification');
    const today = new Date().toDateString();
    
    // Solo enviar una notificación por día
    if (lastNotificationDate === today) {
      console.log('Ya se envió la notificación de hoy');
      return;
    }
    
    const randomMessage = NotificationService.loveMessages[
      Math.floor(Math.random() * NotificationService.loveMessages.length)
    ];
    
    NotificationService.sendLocalNotification('💜 Samirita', {
      body: randomMessage,
      tag: 'daily-love',
      requireInteraction: true,
      actions: [
        { action: 'open', title: 'Ver mi carta 💌' }
      ]
    });
    
    localStorage.setItem('nb_last_daily_notification', today);
    console.log('💜 Notificación diaria enviada:', randomMessage);
  },

  // Inicializar notificaciones diarias si están habilitadas
  initDailyNotifications: () => {
    const enabled = localStorage.getItem('nb_notifications_enabled') === 'true';
    if (enabled && Notification.permission === 'granted') {
      const hour = parseInt(localStorage.getItem('nb_notification_hour') || '8');
      const minute = parseInt(localStorage.getItem('nb_notification_minute') || '0');
      NotificationService.scheduleDailyNotification(hour, minute);
      return true;
    }
    return false;
  },

  // Desactivar notificaciones diarias
  disableDailyNotifications: () => {
    localStorage.removeItem('nb_notifications_enabled');
    localStorage.removeItem('nb_notification_hour');
    localStorage.removeItem('nb_notification_minute');
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
    
    // Inicializar notificaciones diarias
    NotificationService.initDailyNotifications();
    
    // Verificar periódicamente
    setInterval(() => {
      NotificationService.checkSecretMessages();
    }, intervalMinutes * 60 * 1000);
  }
};

export default NotificationService;
