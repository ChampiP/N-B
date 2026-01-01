// Configuración de Cloudinary
export const cloudinaryConfig = {
  cloudName: 'dg6dlnbj5',
  uploadPreset: 'shamira_fotos', // Debes crear este preset en Cloudinary
};

// URL base para imágenes
export const getImageUrl = (publicId, options = {}) => {
  const { width, height, crop = 'fill' } = options;
  
  let transformations = '';
  if (width || height) {
    transformations = `/c_${crop}`;
    if (width) transformations += `,w_${width}`;
    if (height) transformations += `,h_${height}`;
  }
  
  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload${transformations}/${publicId}`;
};

// Subir imagen a Cloudinary
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);
  
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }
    
    return {
      publicId: data.public_id,
      url: data.secure_url,
      width: data.width,
      height: data.height,
    };
  } catch (error) {
    console.error('Error subiendo imagen:', error);
    throw error;
  }
};
