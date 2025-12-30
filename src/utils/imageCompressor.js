// Comprimir imagen antes de subir
export const compressImage = (file, maxWidth = 1920, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        
        // Calcular nuevas dimensiones manteniendo proporción
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir a blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Crear un nuevo archivo con el blob comprimido
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              
              console.log(`Imagen comprimida: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
              resolve(compressedFile);
            } else {
              reject(new Error('Error al comprimir imagen'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = () => reject(new Error('Error al cargar imagen'));
      img.src = e.target.result;
    };
    
    reader.onerror = () => reject(new Error('Error al leer archivo'));
    reader.readAsDataURL(file);
  });
};

// Comprimir con ajuste automático de calidad para archivos muy grandes
export const smartCompress = async (file, targetSizeMB = 5) => {
  const targetSize = targetSizeMB * 1024 * 1024;
  
  // Si ya es menor al tamaño objetivo, solo redimensionar
  if (file.size <= targetSize) {
    return compressImage(file, 1920, 0.9);
  }
  
  // Para archivos grandes, comprimir más agresivamente
  let quality = 0.8;
  let maxWidth = 1920;
  
  // Ajustar según el tamaño
  if (file.size > 20 * 1024 * 1024) {
    quality = 0.6;
    maxWidth = 1600;
  } else if (file.size > 10 * 1024 * 1024) {
    quality = 0.7;
    maxWidth = 1800;
  }
  
  return compressImage(file, maxWidth, quality);
};
