import axiosInstance from '../Util/axios';

/**
 * Upload Service
 * Handles file upload to AWS S3
 */

/**
 * Upload image to S3
 * @param {File} file - File object from input
 * @param {string} type - Type of upload: 'product', 'brand', or 'review'
 * @returns {Promise<string>} URL of uploaded image
 */
export const uploadImage = async (file, type = 'product') => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post(`/api/upload/${type}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Handle different response formats
    // Format 1: { code, message, result: { url } }
    if (response.data && response.data.result && response.data.result.url) {
      return response.data.result.url;
    }
    
    // Format 2: { message, data: { url } }
    if (response.data && response.data.data && response.data.data.url) {
      return response.data.data.url;
    }

    console.error('Invalid upload response:', response.data);
    throw new Error('Invalid response from upload API');
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Delete image from S3
 * @param {string} imageUrl - Full URL of the image to delete
 * @returns {Promise<void>}
 */
export const deleteImage = async (imageUrl) => {
  try {
    const response = await axiosInstance.delete('/api/upload', {
      params: { url: imageUrl },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

/**
 * Validate file before upload
 * @param {File} file - File to validate
 * @param {number} maxSizeMB - Maximum file size in MB (default 50MB)
 * @returns {Object} { valid: boolean, error: string }
 */
export const validateImageFile = (file, maxSizeMB = 50) => {
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: 'Invalid file type. Please upload JPG, PNG, GIF, or WebP images.' 
    };
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { 
      valid: false, 
      error: `File size exceeds ${maxSizeMB}MB limit.` 
    };
  }

  return { valid: true, error: null };
};

/**
 * Preview image before upload
 * @param {File} file - File to preview
 * @returns {Promise<string>} Data URL for preview
 */
export const previewImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

