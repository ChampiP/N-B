import { getTodayMessage, getFormattedDate } from '../../data/messages';
import './DailyMessage.css';

const DailyMessage = () => {
  const todayMessage = getTodayMessage();
  const formattedDate = getFormattedDate();

  return (
    <div className="daily-message">
      <div className="message-envelope">
        <span className="envelope-icon">💌</span>
      </div>
      <div className="message-content">
        <p className="message-date">{formattedDate}</p>
        <p className="message-text">"{todayMessage.message}"</p>
        <p className="message-signature">- Tu carta de hoy 💜</p>
      </div>
    </div>
  );
};

export default DailyMessage;
