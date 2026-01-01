import { useState, useMemo } from 'react';
import './Envelope.css';
import Letter from '../Letter/Letter';

// Generar estilos de partículas una sola vez
const generateParticleStyles = () => {
  return [...Array(20)].map(() => ({
    delay: `${Math.random() * 5}s`,
    x: `${Math.random() * 100}%`,
    duration: `${3 + Math.random() * 4}s`
  }));
};

const Envelope = ({ onContinue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [letterOut, setLetterOut] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Estilos de partículas generados una sola vez
  const particleStyles = useMemo(() => generateParticleStyles(), []);

  const handleEnvelopeClick = () => {
    if (!isOpen) {
      setIsOpen(true);
      // Después de abrir, sacar la carta
      setTimeout(() => setLetterOut(true), 600);
    }
  };

  const handleContinue = () => {
    setIsExiting(true);
    // Esperar a que termine la animación de remolino
    setTimeout(() => {
      onContinue();
    }, 1000);
  };

  return (
    <div className={`envelope-scene ${isExiting ? 'exit-swirl' : ''}`}>
      {/* Partículas de fondo */}
      <div className="particles">
        {particleStyles.map((style, i) => (
          <div key={i} className="particle" style={{
            '--delay': style.delay,
            '--x': style.x,
            '--duration': style.duration
          }}></div>
        ))}
      </div>

      <div className="envelope-wrapper">
        <div 
          className={`envelope ${isOpen ? 'open' : ''} ${letterOut ? 'letter-out' : ''}`}
          onClick={handleEnvelopeClick}
        >
          {/* Parte trasera del sobre */}
          <div className="envelope-back"></div>
          
          {/* Solapa superior */}
          <div className="envelope-flap"></div>
          
          {/* Carta */}
          <div className={`letter-container ${letterOut ? 'show' : ''}`}>
            <Letter onContinue={handleContinue} isVisible={letterOut} />
          </div>
          
          {/* Parte frontal del sobre */}
          <div className="envelope-front">
            <div className="envelope-heart">💜</div>
            <p className="envelope-name">Para: Shamira</p>
          </div>
        </div>

        {!isOpen && (
          <p className="instruction">
            ✨ Toca el sobre para abrirlo ✨
          </p>
        )}
      </div>
    </div>
  );
};

export default Envelope;
