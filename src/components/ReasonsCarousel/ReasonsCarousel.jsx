import { useState, useEffect } from 'react';
import './ReasonsCarousel.css';

// Lista de razones - ¡Personalízalas!
const reasons = [
  "Tu sonrisa ilumina mis días más oscuros ☀️",
  "La forma en que me miras hace que mi corazón vuele 💕",
  "Tu risa es mi canción favorita 🎵",
  "Eres mi mejor amiga y mi amor 💜",
  "Me haces querer ser mejor persona cada día ✨",
  "Tu abrazo es mi lugar seguro 🏠",
  "La manera en que me cuidas cuando estoy mal 🤒",
  "Tu paciencia infinita conmigo 😅",
  "Amo cómo hueles (siempre) 🌸",
  "Tus ocurrencias random que me hacen reír 😂",
  "La forma en que dices mi nombre 💗",
  "Tu creatividad y tu mente brillante 🧠",
  "Cómo te emocionas con las cosas pequeñas 🎁",
  "Tu valentía para enfrentar todo 💪",
  "Eres mi compañera de aventuras perfecta 🗺️",
  "La forma en que bailas cuando crees que nadie ve 💃",
  "Tu corazón bondadoso con todos 💝",
  "Cómo me apoyas en todo lo que hago 🌟",
  "Tus mensajes buenos días que alegran mi mañana ☀️",
  "Simplemente porque eres TÚ, mi Samirita 💜"
];

const ReasonsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % reasons.length);
        setIsAnimating(false);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const goToNext = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % reasons.length);
        setIsAnimating(false);
      }, 500);
    }
  };

  const goToPrev = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev - 1 + reasons.length) % reasons.length);
        setIsAnimating(false);
      }, 500);
    }
  };

  return (
    <section className="reasons-section">
      <h2 className="section-title">
        <span className="title-line"></span>
        💕 Razones Por Las Que Te Amo
        <span className="title-line"></span>
      </h2>

      <div className="reasons-carousel">
        <button className="carousel-btn prev" onClick={goToPrev}>
          ←
        </button>

        <div className="reason-card-container">
          <div className={`reason-card ${isAnimating ? 'fade-out' : 'fade-in'}`}>
            <div className="reason-number">#{currentIndex + 1}</div>
            <div className="reason-heart">💜</div>
            <p className="reason-text">{reasons[currentIndex]}</p>
            <div className="reason-decoration">
              <span>✨</span>
              <span>💕</span>
              <span>✨</span>
            </div>
          </div>
        </div>

        <button className="carousel-btn next" onClick={goToNext}>
          →
        </button>
      </div>

      <div className="reasons-dots">
        {reasons.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => {
              if (!isAnimating) {
                setIsAnimating(true);
                setTimeout(() => {
                  setCurrentIndex(index);
                  setIsAnimating(false);
                }, 500);
              }
            }}
          />
        ))}
      </div>

      <p className="reasons-counter">
        {currentIndex + 1} de {reasons.length} razones (y contando...)
      </p>
    </section>
  );
};

export default ReasonsCarousel;
