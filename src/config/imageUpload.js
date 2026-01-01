// Configuración de ImgBB - Servicio gratuito de hosting de imágenes
// Obtén tu API key gratis en: https://api.imgbb.com/

const IMGBB_API_KEY = '4a922c18a7d545a018238e30f2c04208';

// Subir imagen a ImgBB
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  
  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error?.message || 'Error al subir imagen');
    }
    
    return {
      publicId: data.data.id,
      url: data.data.url,
      displayUrl: data.data.display_url,
      thumbnail: data.data.thumb?.url || data.data.url,
      width: data.data.width,
      height: data.data.height,
    };
  } catch (error) {
    console.error('Error subiendo imagen:', error);
    throw error;
  }
};

// Obtener URL de imagen (para ImgBB, simplemente devuelve la URL directa)
export const getImageUrl = (urlOrId, options = {}) => {
  // Si ya es una URL completa, devolverla
  if (urlOrId && urlOrId.startsWith('http')) {
    return urlOrId;
  }
  // Si es un ID antiguo de Cloudinary, intentar construir URL
  if (urlOrId) {
    return `https://res.cloudinary.com/dg6dlnbj5/image/upload/${urlOrId}`;
  }
  return '';
};
