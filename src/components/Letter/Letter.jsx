import { getTodayMessage, getFormattedDate } from '../../data/messages';
import './Letter.css';

const Letter = ({ onContinue, isVisible }) => {
  const todayMessage = getTodayMessage();
  const formattedDate = getFormattedDate();

  return (
    <div className={`letter ${isVisible ? 'visible' : ''}`}>
      <div className="letter-paper">
        <div className="letter-header">
          <span className="letter-date">{formattedDate}</span>
          <h2 className="letter-title">{todayMessage.title}</h2>
        </div>
        
        <div className="letter-body">
          <p className="letter-message">{todayMessage.message}</p>
        </div>
        
        <div className="letter-footer">
          <p className="letter-signature">Con todo mi amor,</p>
          <p className="letter-heart">💜</p>
        </div>

        <button className="continue-btn" onClick={onContinue}>
          <span>Continuar</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
      
      {/* Decoración de esquinas */}
      <div className="corner-decoration top-left"></div>
      <div className="corner-decoration top-right"></div>
      <div className="corner-decoration bottom-left"></div>
      <div className="corner-decoration bottom-right"></div>
    </div>
  );
};

export default Letter;
