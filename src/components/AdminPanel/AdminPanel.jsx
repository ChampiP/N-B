import { useState } from 'react';
import './AdminPanel.css';
import PhotoUploader from '../PhotoUploader/PhotoUploader';
import { getImageUrl } from '../../config/imageUpload';

const AdminPanel = ({ 
  isOpen, 
  onClose, 
  photos, 
  onAddPhoto, 
  onDeletePhoto,
  heroPhoto,
  onSetHeroPhoto,
  timelineEvents,
  onAddTimelineEvent,
  onDeleteTimelineEvent,
  onEditTimelineEvent
}) => {
  const [activeTab, setActiveTab] = useState('photos');
  const [newEvent, setNewEvent] = useState({ date: '', title: '', description: '' });
  const [editingEvent, setEditingEvent] = useState(null);

  if (!isOpen) return null;

  const handleAddEvent = () => {
    if (newEvent.date && newEvent.title) {
      onAddTimelineEvent({
        id: Date.now(),
        ...newEvent
      });
      setNewEvent({ date: '', title: '', description: '' });
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent({ ...event });
  };

  const handleSaveEdit = () => {
    if (editingEvent && editingEvent.date && editingEvent.title) {
      onEditTimelineEvent(editingEvent);
      setEditingEvent(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingEvent(null);
  };

  return (
    <div className="admin-overlay" onClick={onClose}>
      <div className="admin-panel" onClick={(e) => e.stopPropagation()}>
        <div className="admin-header">
          <h2>💜 Panel de Control</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="admin-tabs">
          <button 
            className={`tab ${activeTab === 'photos' ? 'active' : ''}`}
            onClick={() => setActiveTab('photos')}
          >
            📷 Fotos
          </button>
          <button 
            className={`tab ${activeTab === 'hero' ? 'active' : ''}`}
            onClick={() => setActiveTab('hero')}
          >
            ⭐ Foto Principal
          </button>
          <button 
            className={`tab ${activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            📅 Línea del Tiempo
          </button>
        </div>

        <div className="admin-content">
          {/* Tab de Fotos */}
          {activeTab === 'photos' && (
            <div className="tab-content">
              <h3>Galería de Fotos</h3>
              <p className="tab-description">Sube y administra las fotos de recuerdos</p>
              
              <div className="admin-photo-grid">
                <PhotoUploader onUploadComplete={onAddPhoto} />
                
                {photos.map((photo) => (
                  <div key={photo.id} className="admin-photo-item">
                    <img 
                      src={getImageUrl(photo.publicId, { width: 150, height: 150 })} 
                      alt={photo.title || "Foto"}
                    />
                    <div className="photo-actions">
                      <button 
                        className="set-hero-btn"
                        onClick={() => onSetHeroPhoto(photo)}
                        title="Establecer como foto principal"
                      >
                        ⭐
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => onDeletePhoto(photo.id)}
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab de Foto Principal */}
          {activeTab === 'hero' && (
            <div className="tab-content">
              <h3>Foto Principal</h3>
              <p className="tab-description">Esta foto aparece grande en la página principal</p>
              
              <div className="hero-preview">
                {heroPhoto ? (
                  <div className="current-hero">
                    <img 
                      src={getImageUrl(heroPhoto.publicId, { width: 300, height: 300 })} 
                      alt="Foto principal"
                    />
                    <p>Foto actual</p>
                  </div>
                ) : (
                  <div className="no-hero">
                    <span>📸</span>
                    <p>No hay foto principal seleccionada</p>
                  </div>
                )}
              </div>

              <h4>Selecciona una foto:</h4>
              <div className="hero-options">
                {photos.map((photo) => (
                  <div 
                    key={photo.id} 
                    className={`hero-option ${heroPhoto?.id === photo.id ? 'selected' : ''}`}
                    onClick={() => onSetHeroPhoto(photo)}
                  >
                    <img 
                      src={getImageUrl(photo.publicId, { width: 100, height: 100 })} 
                      alt={photo.title || "Foto"}
                    />
                    {heroPhoto?.id === photo.id && <span className="selected-badge">✓</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab de Línea del Tiempo */}
          {activeTab === 'timeline' && (
            <div className="tab-content">
              <h3>Línea del Tiempo</h3>
              <p className="tab-description">Agrega momentos especiales de su historia</p>
              
              <div className="add-event-form">
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  placeholder="Fecha"
                />
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="Título del momento"
                />
                <input
                  type="text"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  placeholder="Descripción (opcional)"
                />
                <button onClick={handleAddEvent} className="add-event-btn">
                  + Agregar Momento
                </button>
              </div>

              <div className="timeline-list">
                {timelineEvents.length === 0 ? (
                  <p className="empty-message">No hay momentos agregados aún</p>
                ) : (
                  timelineEvents.map((event) => (
                    <div key={event.id} className="timeline-item">
                      {editingEvent && editingEvent.id === event.id ? (
                        // Modo edición
                        <div className="edit-event-form">
                          <input
                            type="date"
                            value={editingEvent.date}
                            onChange={(e) => setEditingEvent({...editingEvent, date: e.target.value})}
                          />
                          <input
                            type="text"
                            value={editingEvent.title}
                            onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})}
                            placeholder="Título"
                          />
                          <input
                            type="text"
                            value={editingEvent.description || ''}
                            onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})}
                            placeholder="Descripción"
                          />
                          <div className="edit-actions">
                            <button className="save-btn" onClick={handleSaveEdit}>💾 Guardar</button>
                            <button className="cancel-btn" onClick={handleCancelEdit}>✕ Cancelar</button>
                          </div>
                        </div>
                      ) : (
                        // Modo visualización
                        <>
                          <div className="event-info">
                            <span className="event-date">{event.date}</span>
                            <span className="event-title">{event.title}</span>
                            {event.description && (
                              <span className="event-desc">{event.description}</span>
                            )}
                          </div>
                          <div className="event-buttons">
                            <button 
                              className="edit-event-btn"
                              onClick={() => handleEditEvent(event)}
                              title="Editar"
                            >
                              ✏️
                            </button>
                            <button 
                              className="delete-event-btn"
                              onClick={() => onDeleteTimelineEvent(event.id)}
                              title="Eliminar"
                            >
                              ✕
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
