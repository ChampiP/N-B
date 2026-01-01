import { useState } from 'react';
import { uploadImage } from '../../config/imageUpload';
import { smartCompress } from '../../utils/imageCompressor';
import './PhotoUploader.css';

const PhotoUploader = ({ onUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona una imagen');
      return;
    }

    setIsUploading(true);
    setError(null);
    setStatus('Comprimiendo imagen...');

    try {
      // Comprimir imagen primero
      const compressedFile = await smartCompress(file, 5);
      
      // Mostrar preview del archivo comprimido
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(compressedFile);

      setStatus('Subiendo a la nube...');

      // Subir a Cloudinary
      const result = await uploadImage(compressedFile);
      console.log('Foto subida:', result);
      
      setStatus('¡Listo! 💜');
      
      if (onUploadComplete) {
        onUploadComplete(result);
      }
      
      // Limpiar después de subir
      setTimeout(() => {
        setPreview(null);
        setIsUploading(false);
        setStatus('');
      }, 1500);
      
    } catch (err) {
      setError('Error al subir la foto. Intenta de nuevo.');
      setIsUploading(false);
      setStatus('');
      console.error(err);
    }
  };

  return (
    <div className="photo-uploader">
      <label className="upload-label">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="upload-input"
        />
        
        {preview ? (
          <div className="upload-preview">
            <img src={preview} alt="Preview" />
            {isUploading && (
              <div className="upload-overlay">
                <div className="upload-spinner"></div>
                <span>{status}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="upload-placeholder">
            <span className="upload-icon">📷</span>
            <span className="upload-text">Agregar foto</span>
          </div>
        )}
      </label>
      
      {error && <p className="upload-error">{error}</p>}
    </div>
  );
};

export default PhotoUploader;
