import { useState, useEffect } from 'react';
import './LandingPage.css';
import PhotoUploader from '../PhotoUploader/PhotoUploader';
import { getImageUrl } from '../../config/cloudinary';

// Fecha de inicio: 13 de diciembre 2025 a las 3:00 PM
const START_DATE = new Date('2025-12-13T15:00:00');

const LandingPage = () => {
  const [timeTogether, setTimeTogether] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Estado para las fotos (por ahora guardadas localmente)
  const [photos, setPhotos] = useState(() => {
    const saved = localStorage.getItem('samirita_photos');
    return saved ? JSON.parse(saved) : [];
  });

  // Guardar fotos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('samirita_photos', JSON.stringify(photos));
  }, [photos]);

  const handlePhotoUpload = (result) => {
    const newPhoto = {
      id: Date.now(),
      publicId: result.publicId,
      url: result.url,
      uploadedAt: new Date().toISOString()
    };
    setPhotos(prev => [...prev, newPhoto]);
  };

  const handleDeletePhoto = (photoId) => {
    if (confirm('¿Eliminar esta foto?')) {
      setPhotos(prev => prev.filter(p => p.id !== photoId));
    }
  };

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const diff = now - START_DATE;
      
      // Si la fecha de inicio es en el futuro, mostrar 0
      if (diff < 0) {
        setTimeTogether({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      setTimeTogether({
        days: days,
        hours: hours % 24,
        minutes: minutes % 60,
        seconds: seconds % 60
      });
    };

    // Calcular inmediatamente
    calculateTime();
    
    // Actualizar cada segundo
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing-page">
      {/* Fondo animado */}
      <div className="bg-hearts">
        {[...Array(15)].map((_, i) => (
          <span key={i} className="floating-heart" style={{
            '--delay': `${Math.random() * 10}s`,
            '--x': `${Math.random() * 100}%`,
            '--size': `${1 + Math.random() * 1.5}rem`,
            '--duration': `${10 + Math.random() * 10}s`
          }}>💜</span>
        ))}
      </div>

      {/* Header */}
      <header className="landing-header">
        <div className="header-content">
          <h1 className="main-title">
            <span className="title-heart">💜</span>
            Nuestra Historia
            <span className="title-heart">💜</span>
          </h1>
          <p className="subtitle">Un espacio para nuestros recuerdos</p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-frame">
          <div className="hero-placeholder">
            <span className="placeholder-icon">📸</span>
            <p>Nuestra foto favorita irá aquí</p>
          </div>
        </div>
        <div className="hero-text">
          <h2>Samirita & Yo</h2>
          <p className="hero-quote">"Cada momento contigo es un tesoro"</p>
        </div>
      </section>

      {/* Secciones de navegación */}
      <section className="nav-cards">
        <div className="nav-card" data-section="memories">
          <div className="card-icon">📷</div>
          <h3>Recuerdos</h3>
          <p>Nuestras fotos juntos</p>
          <span className="card-arrow">→</span>
        </div>

        <div className="nav-card" data-section="timeline">
          <div className="card-icon">📅</div>
          <h3>Nuestra Línea del Tiempo</h3>
          <p>Momentos especiales</p>
          <span className="card-arrow">→</span>
        </div>

        <div className="nav-card" data-section="reasons">
          <div className="card-icon">💕</div>
          <h3>Razones</h3>
          <p>Por qué te amo</p>
          <span className="card-arrow">→</span>
        </div>

        <div className="nav-card" data-section="music">
          <div className="card-icon">🎵</div>
          <h3>Nuestras Canciones</h3>
          <p>La playlist de nosotros</p>
          <span className="card-arrow">→</span>
        </div>
      </section>

      {/* Galería de fotos preview */}
      <section className="gallery-preview">
        <h2 className="section-title">
          <span className="title-line"></span>
          Galería de Recuerdos
          <span className="title-line"></span>
        </h2>
        
        <div className="gallery-grid">
          {/* Botón para agregar foto */}
          <PhotoUploader onUploadComplete={handlePhotoUpload} />
          
          {/* Fotos subidas */}
          {photos.slice(0, 5).map((photo) => (
            <div key={photo.id} className="gallery-item">
              <img 
                src={getImageUrl(photo.publicId, { width: 300, height: 300 })} 
                alt="Recuerdo"
                className="gallery-photo"
              />
              <button 
                className="delete-photo-btn"
                onClick={() => handleDeletePhoto(photo.id)}
              >
                ✕
              </button>
            </div>
          ))}
          
          {/* Placeholders si hay menos de 5 fotos */}
          {photos.length < 5 && [...Array(5 - photos.length)].map((_, i) => (
            <div key={`placeholder-${i}`} className="gallery-item">
              <div className="gallery-placeholder">
                <span>📸</span>
                <small>Foto {photos.length + i + 2}</small>
              </div>
            </div>
          ))}
        </div>
        
        {photos.length > 5 && (
          <button className="view-all-btn">
            Ver todas las fotos ({photos.length})
            <span>→</span>
          </button>
        )}
      </section>

      {/* Contador de tiempo juntos */}
      <section className="time-together">
        <div className="time-card">
          <h3>Tiempo juntos</h3>
          <div className="time-display">
            <div className="time-unit">
              <span className="time-number">{timeTogether.days}</span>
              <span className="time-label">Días</span>
            </div>
            <div className="time-separator">:</div>
            <div className="time-unit">
              <span className="time-number">{String(timeTogether.hours).padStart(2, '0')}</span>
              <span className="time-label">Horas</span>
            </div>
            <div className="time-separator">:</div>
            <div className="time-unit">
              <span className="time-number">{String(timeTogether.minutes).padStart(2, '0')}</span>
              <span className="time-label">Minutos</span>
            </div>
            <div className="time-separator">:</div>
            <div className="time-unit">
              <span className="time-number">{String(timeTogether.seconds).padStart(2, '0')}</span>
              <span className="time-label">Segundos</span>
            </div>
          </div>
          <p className="time-message">¡Y contando! 💜</p>
          <p className="time-start-date">Desde el 13 de diciembre de 2025</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>Hecho con 💜 para Samirita</p>
        <p className="footer-year">2025</p>
      </footer>
    </div>
  );
};

export default LandingPage;
