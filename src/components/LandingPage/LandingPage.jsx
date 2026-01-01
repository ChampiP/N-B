import { useState, useEffect, useMemo } from 'react';
import './LandingPage.css';
import PhotoUploader from '../PhotoUploader/PhotoUploader';
import AdminPanel from '../AdminPanel/AdminPanel';
import DailyMessage from '../DailyMessage/DailyMessage';
import SpotifyPlaylist from '../SpotifyPlaylist/SpotifyPlaylist';
import ReasonsCarousel from '../ReasonsCarousel/ReasonsCarousel';
import SecretMessages from '../SecretMessages/SecretMessages';
import InstallApp from '../InstallApp/InstallApp';
import { getImageUrl } from '../../config/imageUpload';
import { galleryPhotos } from '../../data/photos';
import useScrollReveal, { useParallax } from '../../hooks/useScrollReveal';
import { 
  savePhoto, deletePhoto as deletePhotoFromDB, subscribeToPhotos,
  saveHeroPhoto, subscribeToHeroPhoto,
  saveTimelineEvent, deleteTimelineEvent as deleteEventFromDB, subscribeToTimeline
} from '../../config/firebase';

// Fecha de inicio: 13 de diciembre 2025 a las 3:00 PM
const START_DATE = new Date('2025-12-13T15:00:00');

// Generar valores aleatorios una sola vez fuera del render
const generateHeartStyles = () => {
  return [...Array(15)].map(() => ({
    delay: `${Math.random() * 10}s`,
    x: `${Math.random() * 100}%`,
    size: `${1 + Math.random() * 1.5}rem`,
    duration: `${10 + Math.random() * 10}s`
  }));
};

const LandingPage = () => {
  const [timeTogether, setTimeTogether] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Scroll reveal para cada sección
  const [heroRef, heroVisible] = useScrollReveal(0.2);
  const [navRef, navVisible] = useScrollReveal(0.1);
  const [timelineRef, timelineVisible] = useScrollReveal(0.1);
  const [galleryRef, galleryVisible] = useScrollReveal(0.1);
  const [timeRef, timeVisible] = useScrollReveal(0.2);
  
  // Parallax
  const scrollY = useParallax();

  // Estilos de corazones generados una sola vez
  const heartStyles = useMemo(() => generateHeartStyles(), []);

  // Estado para el panel de admin
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  // Estado para lightbox de fotos
  const [lightboxPhoto, setLightboxPhoto] = useState(null);

  // Estado para fotos (sincronizadas con Firebase)
  const [sessionPhotos, setSessionPhotos] = useState([]);

  // Estado para foto principal
  const [heroPhoto, setHeroPhoto] = useState(null);

  // Estado para línea del tiempo
  const [timelineEvents, setTimelineEvents] = useState([]);

  // Estado de carga
  const [isLoading, setIsLoading] = useState(true);

  // Suscribirse a Firebase en tiempo real
  useEffect(() => {
    // Suscribirse a fotos
    const unsubPhotos = subscribeToPhotos((photos) => {
      setSessionPhotos(photos);
    });

    // Suscribirse a foto principal
    const unsubHero = subscribeToHeroPhoto((photo) => {
      setHeroPhoto(photo);
    });

    // Suscribirse a timeline
    const unsubTimeline = subscribeToTimeline((events) => {
      setTimelineEvents(events.length > 0 ? events : [
        { id: 1, date: '2025-12-13', title: 'Empezamos a ser novios', description: 'El mejor día 💜' }
      ]);
      setIsLoading(false);
    });

    // Limpiar suscripciones
    return () => {
      unsubPhotos();
      unsubHero();
      unsubTimeline();
    };
  }, []);

  // Combinar fotos guardadas en código + fotos de Firebase
  const allPhotos = [...galleryPhotos, ...sessionPhotos];

  const handlePhotoUpload = async (result) => {
    const newPhoto = {
      id: Date.now(),
      publicId: result.publicId,
      url: result.url,
      title: 'Nueva foto',
      date: new Date().toISOString().split('T')[0]
    };
    
    // Guardar en Firebase
    await savePhoto(newPhoto);
    console.log('📸 ¡Foto subida y guardada en Firebase!');
  };

  const handleDeletePhoto = async (photoId) => {
    await deletePhotoFromDB(photoId);
  };

  const handleSetHeroPhoto = async (photo) => {
    await saveHeroPhoto(photo);
  };

  const handleAddTimelineEvent = async (event) => {
    await saveTimelineEvent(event);
  };

  const handleDeleteTimelineEvent = async (eventId) => {
    await deleteEventFromDB(eventId);
  };

  const handleEditTimelineEvent = async (editedEvent) => {
    await saveTimelineEvent(editedEvent);
  };

  // Función para scroll suave a secciones
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      {/* Fondo animado con gradiente */}
      <div className="animated-bg"></div>
      
      {/* Fondo parallax */}
      <div className="parallax-bg" style={{ transform: `translateY(${scrollY * 0.3}px)` }}></div>
      
      {/* Corazones flotantes */}
      <div className="bg-hearts">
        {heartStyles.map((style, i) => (
          <span key={i} className="floating-heart" style={{
            '--delay': style.delay,
            '--x': style.x,
            '--size': style.size,
            '--duration': style.duration
          }}>💜</span>
        ))}
      </div>

      {/* Header con parallax */}
      <header className="landing-header" style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
        <div className="header-content">
          <h1 className="main-title">
            <span className="title-heart">💜</span>
            Nuestra Historia
            <span className="title-heart">💜</span>
          </h1>
          <p className="subtitle">Un espacio para nuestros recuerdos</p>
        </div>
      </header>

      {/* Hero Section con scroll reveal */}
      <section ref={heroRef} className={`hero-section scroll-reveal ${heroVisible ? 'visible' : ''}`}>
        <div className="hero-frame">
          {heroPhoto ? (
            <img 
              src={getImageUrl(heroPhoto.publicId, { width: 400, height: 400 })} 
              alt="Nuestra foto favorita"
              className="hero-image"
            />
          ) : (
            <div className="hero-placeholder">
              <span className="placeholder-icon">📸</span>
              <p>Nuestra foto favorita irá aquí</p>
            </div>
          )}
        </div>
        <div className="hero-text">
          <h2>Shamira & Yo</h2>
          <p className="hero-quote">"Cada momento contigo es un tesoro"</p>
        </div>
      </section>

      {/* Secciones de navegación con scroll reveal y hover 3D */}
      <section ref={navRef} className={`nav-cards scroll-reveal ${navVisible ? 'visible' : ''}`}>
        <div className="nav-card card-3d" onClick={() => setIsAdminOpen(true)}>
          <div className="card-icon">⚙️</div>
          <h3>Editar Página</h3>
          <p>Agregar fotos y momentos</p>
          <span className="card-arrow">→</span>
        </div>

        <div className="nav-card card-3d" onClick={() => scrollToSection('timeline-section')}>
          <div className="card-icon">📅</div>
          <h3>Nuestra Línea del Tiempo</h3>
          <p>Momentos especiales</p>
          <span className="card-arrow">→</span>
        </div>

        <div className="nav-card card-3d" onClick={() => scrollToSection('reasons-section')}>
          <div className="card-icon">💕</div>
          <h3>Razones</h3>
          <p>Por qué te amo</p>
          <span className="card-arrow">→</span>
        </div>

        <div className="nav-card card-3d" onClick={() => scrollToSection('spotify-section')}>
          <div className="card-icon">🎵</div>
          <h3>Nuestras Canciones</h3>
          <p>La playlist de nosotros</p>
          <span className="card-arrow">→</span>
        </div>
      </section>

      {/* Razones por las que te amo */}
      <div id="reasons-section">
        <ReasonsCarousel />
      </div>

      {/* Mensajes Secretos */}
      <SecretMessages />

      {/* Línea del Tiempo */}
      <section id="timeline-section" ref={timelineRef} className={`timeline-section scroll-reveal ${timelineVisible ? 'visible' : ''}`}>
        <h2 className="section-title">
          <span className="title-line"></span>
          Nuestra Historia
          <span className="title-line"></span>
        </h2>
        
        <div className="timeline">
          {timelineEvents.map((event, index) => {
            // Parsear fecha sin problemas de zona horaria
            const [year, month, day] = event.date.split('-').map(Number);
            const eventDate = new Date(year, month - 1, day);
            
            return (
              <div key={event.id} className={`timeline-event ${index % 2 === 0 ? 'left' : 'right'}`}>
                <div className="event-content">
                  <span className="event-date">{eventDate.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <h4 className="event-title">{event.title}</h4>
                  {event.description && <p className="event-description">{event.description}</p>}
                </div>
                <div className="event-dot">💜</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Spotify Playlist */}
      <div id="spotify-section">
        <SpotifyPlaylist />
      </div>

      {/* Galería de fotos preview */}
      <section id="gallery-section" ref={galleryRef} className={`gallery-preview scroll-reveal ${galleryVisible ? 'visible' : ''}`}>
        <h2 className="section-title">
          <span className="title-line"></span>
          Galería de Recuerdos
          <span className="title-line"></span>
        </h2>
        
        <div className="gallery-grid">
          {/* Botón para agregar foto */}
          <PhotoUploader onUploadComplete={handlePhotoUpload} />
          
          {/* Fotos subidas */}
          {allPhotos.slice(0, 5).map((photo) => (
            <div key={photo.id} className="gallery-item" onClick={() => setLightboxPhoto(photo)}>
              <img 
                src={getImageUrl(photo.publicId, { width: 300, height: 300 })} 
                alt={photo.title || "Recuerdo"}
                className="gallery-photo"
              />
              <button 
                className="delete-photo-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePhoto(photo.id);
                }}
                title="Eliminar foto"
              >
                ✕
              </button>
              <div className="photo-overlay">
                <span>🔍 Ver</span>
              </div>
            </div>
          ))}
          
          {/* Placeholders si hay menos de 5 fotos */}
          {allPhotos.length < 5 && [...Array(5 - allPhotos.length)].map((_, i) => (
            <div key={`placeholder-${i}`} className="gallery-item">
              <div className="gallery-placeholder">
                <span>📸</span>
                <small>Foto {allPhotos.length + i + 2}</small>
              </div>
            </div>
          ))}
        </div>
        
        {allPhotos.length > 5 && (
          <button className="view-all-btn">
            Ver todas las fotos ({allPhotos.length})
            <span>→</span>
          </button>
        )}
      </section>

      {/* Contador de tiempo juntos con animación */}
      <section ref={timeRef} className={`time-together scroll-reveal ${timeVisible ? 'visible' : ''}`}>
        <div className="time-card card-3d">
          <h3>Tiempo juntos 💓</h3>
          <div className="time-display">
            <div className="time-unit">
              <span className="time-number animated-number">{timeTogether.days}</span>
              <span className="time-label">Días</span>
            </div>
            <div className="time-separator">:</div>
            <div className="time-unit">
              <span className="time-number animated-number">{String(timeTogether.hours).padStart(2, '0')}</span>
              <span className="time-label">Horas</span>
            </div>
            <div className="time-separator">:</div>
            <div className="time-unit">
              <span className="time-number animated-number">{String(timeTogether.minutes).padStart(2, '0')}</span>
              <span className="time-label">Minutos</span>
            </div>
            <div className="time-separator">:</div>
            <div className="time-unit">
              <span className="time-number animated-number pulse-seconds">{String(timeTogether.seconds).padStart(2, '0')}</span>
              <span className="time-label">Segundos</span>
            </div>
          </div>
          <p className="time-message">¡Y contando! <span className="heartbeat">💓</span></p>
          <p className="time-start-date">Desde el 13 de diciembre de 2025</p>
        </div>
      </section>

      {/* Instalar App y Notificaciones */}
      <InstallApp />

      {/* Footer */}
      <footer className="landing-footer">
        <p>Hecho con 💜 para Shamira</p>
        <p className="footer-year">2025</p>
      </footer>

      {/* Mensaje del día flotante */}
      <DailyMessage />

      {/* Lightbox para fotos */}
      {lightboxPhoto && (
        <div className="lightbox-overlay" onClick={() => setLightboxPhoto(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightboxPhoto(null)}>✕</button>
            <img 
              src={getImageUrl(lightboxPhoto.publicId, { width: 1200, height: 1200 })} 
              alt={lightboxPhoto.title || "Foto"}
              className="lightbox-image"
            />
            {lightboxPhoto.title && (
              <p className="lightbox-title">{lightboxPhoto.title}</p>
            )}
          </div>
        </div>
      )}

      {/* Panel de administración */}
      <AdminPanel 
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        photos={allPhotos}
        onAddPhoto={handlePhotoUpload}
        onDeletePhoto={handleDeletePhoto}
        heroPhoto={heroPhoto}
        onSetHeroPhoto={handleSetHeroPhoto}
        timelineEvents={timelineEvents}
        onAddTimelineEvent={handleAddTimelineEvent}
        onDeleteTimelineEvent={handleDeleteTimelineEvent}
        onEditTimelineEvent={handleEditTimelineEvent}
      />
    </div>
  );
};

export default LandingPage;
