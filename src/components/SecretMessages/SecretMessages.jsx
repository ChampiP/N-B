import { useState } from 'react';
import './SecretMessages.css';
import NotificationService from '../../utils/notifications';

// Mensajes secretos con fechas de desbloqueo
// ¡Personaliza las fechas y mensajes!
const secretMessages = [
  {
    id: 1,
    unlockDate: '2025-12-25',
    title: '🎄 Navidad Juntos',
    message: 'Esta es nuestra primera Navidad juntos. Gracias por hacer este día tan especial. Eres el mejor regalo que pude haber pedido. Te amo infinitamente 💜',
    emoji: '🎄'
  },
  {
    id: 2,
    unlockDate: '2025-12-31',
    title: '🎆 Año Nuevo',
    message: 'Un nuevo año comienza y no puedo estar más feliz de empezarlo contigo. Que este 2026 esté lleno de amor, risas y muchas aventuras juntos. ¡Feliz año mi amor! 💕',
    emoji: '🎆'
  },
  {
    id: 3,
    unlockDate: '2026-01-13',
    title: '💜 Un Mes Juntos',
    message: '¡Ya llevamos un mes! Parece que fue ayer cuando empezamos esta aventura. Cada día me enamoro más de ti. Gracias por estos 30 días increíbles. ¡Por muchos más! 💜',
    emoji: '💜'
  },
  {
    id: 4,
    unlockDate: '2026-02-14',
    title: '💝 San Valentín',
    message: 'Feliz día del amor, mi Shamira. No necesito un día especial para decirte cuánto te amo, pero aprovecho para recordarte que eres lo mejor de mi vida. Te amo más que ayer y menos que mañana 💝',
    emoji: '💝'
  },
  {
    id: 5,
    unlockDate: '2026-06-13',
    title: '🎊 6 Meses',
    message: '¡Medio año juntos! 6 meses de risas, amor, y crecimiento juntos. Eres mi persona favorita y cada día confirmo que elegirte fue la mejor decisión. Te amo, mi vida 💜',
    emoji: '🎊'
  },
  {
    id: 6,
    unlockDate: '2026-12-13',
    title: '🎂 Un Año de Amor',
    message: '¡UN AÑO! No puedo creer lo rápido que pasó. 365 días de amor puro. Gracias por cada momento, cada risa, cada abrazo. Eres mi todo, Shamira. Te amo infinitamente. ¡Por una eternidad más! 💜🎂💕',
    emoji: '🎂'
  }
];

const SecretMessages = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Función para parsear fecha sin problemas de zona horaria
  const parseDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Calcular fecha de hoy una vez
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isUnlocked = (unlockDate) => {
    const unlock = parseDate(unlockDate);
    unlock.setHours(0, 0, 0, 0);
    return today >= unlock;
  };

  // Calcular valores iniciales sin useEffect
  const viewedMessages = JSON.parse(localStorage.getItem('nb_viewed_secrets') || '[]');
  const unlockedMessages = secretMessages.filter(m => isUnlocked(m.unlockDate));
  const hasNewUnlocked = unlockedMessages.some(m => !viewedMessages.includes(m.id));
  
  // Estado de notificaciones calculado directamente
  const notificationsEnabled = typeof Notification !== 'undefined' && Notification.permission === 'granted';

  const enableNotifications = async () => {
    const granted = await NotificationService.requestPermission();
    if (granted) {
      NotificationService.sendLocalNotification(
        '🔔 ¡Notificaciones activadas!',
        { body: 'Te avisaremos cuando se desbloqueen mensajes secretos 💜' }
      );
      // Forzar re-render
      window.location.reload();
    }
  };

  const getDaysUntil = (unlockDate) => {
    const unlock = parseDate(unlockDate);
    unlock.setHours(0, 0, 0, 0);
    const diff = unlock - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const openMessage = (message) => {
    setSelectedMessage(message);
    
    // Marcar como visto
    const currentViewed = JSON.parse(localStorage.getItem('nb_viewed_secrets') || '[]');
    if (!currentViewed.includes(message.id)) {
      currentViewed.push(message.id);
      localStorage.setItem('nb_viewed_secrets', JSON.stringify(currentViewed));
    }
  };

  const closeMessage = () => {
    setSelectedMessage(null);
  };

  return (
    <section className="secrets-section">
      <h2 className="section-title">
        <span className="title-line"></span>
        🔐 Mensajes Secretos
        <span className="title-line"></span>
      </h2>

      <p className="secrets-intro">
        Cartas especiales que se desbloquean en fechas importantes 💜
        {hasNewUnlocked && <span className="new-badge">¡NUEVO!</span>}
      </p>

      {/* Botón para activar notificaciones */}
      {NotificationService.isSupported() && !notificationsEnabled && (
        <button className="enable-notifications-btn" onClick={enableNotifications}>
          🔔 Activar notificaciones
          <span className="btn-hint">Te avisaré cuando se desbloqueen mensajes</span>
        </button>
      )}
      
      {notificationsEnabled && (
        <p className="notifications-active">
          🔔 Notificaciones activadas - Te avisaremos cuando haya mensajes nuevos 💜
        </p>
      )}

      <div className="secrets-grid">
        {secretMessages.map((msg) => {
          const unlocked = isUnlocked(msg.unlockDate);
          const isNew = unlocked && !viewedMessages.includes(msg.id);
          const daysLeft = getDaysUntil(msg.unlockDate);

          return (
            <div
              key={msg.id}
              className={`secret-card ${unlocked ? 'unlocked' : 'locked'} ${isNew ? 'is-new' : ''}`}
              onClick={() => unlocked && openMessage(msg)}
            >
              {isNew && <span className="card-new-badge">✨ NUEVO</span>}
              
              <div className="secret-icon">
                {unlocked ? msg.emoji : '🔒'}
              </div>
              
              <h4 className="secret-title">
                {unlocked ? msg.title : '???'}
              </h4>
              
              <p className="secret-date">
                {parseDate(msg.unlockDate).toLocaleDateString('es-ES', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
              
              {!unlocked && (
                <p className="secret-countdown">
                  Se desbloquea en {daysLeft} día{daysLeft !== 1 ? 's' : ''} 🕐
                </p>
              )}
              
              {unlocked && (
                <p className="secret-hint">Toca para leer 💌</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal del mensaje */}
      {selectedMessage && (
        <div className="secret-modal-overlay" onClick={closeMessage}>
          <div className="secret-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeMessage}>✕</button>
            
            <div className="modal-emoji">{selectedMessage.emoji}</div>
            <h3 className="modal-title">{selectedMessage.title}</h3>
            <p className="modal-date">
              {parseDate(selectedMessage.unlockDate).toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
            
            <div className="modal-divider">💜</div>
            
            <p className="modal-message">{selectedMessage.message}</p>
            
            <div className="modal-footer">
              <span>Con todo mi amor,</span>
              <span className="modal-signature">Tu amor 💜</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SecretMessages;
