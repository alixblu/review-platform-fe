import axiosInstance from '../Util/axios';

/**
 * Brand Service
 * Handles all brand-related API calls
 */

// Get all brands
export const getAllBrands = async () => {
  try {
    const response = await axiosInstance.get('/api/brand/all');
    
    // Format 1: { code, message, result }
    if (response.data && response.data.result) {
      return response.data.result;
    }
    
    // Format 2: { message, data }
    if (response.data && response.data.data) {
      return response.data.data;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
};

// Get brand by ID
export const getBrandById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/brand/${id}`);
    
    // Format 1: { code, message, result }
    if (response.data && response.data.result) {
      return response.data.result;
    }
    
    // Format 2: { message, data }
    if (response.data && response.data.data) {
      return response.data.data;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching brand:', error);
    return null;
  }
};

// Create new brand
export const createBrand = async (brandData) => {
  try {
    const response = await axiosInstance.post('/api/brand', brandData);
    
    // Return the full response for flexibility
    if (response.data && (response.data.result || response.data.data)) {
      return response.data;
    }
    
    return response.data;
  } catch (error) {
    console.error('Error creating brand:', error);
    throw error;
  }
};

// Update brand
export const updateBrand = async (id, brandData) => {
  try {
    const response = await axiosInstance.put(`/api/brand/${id}`, brandData);
    
    // Return the full response for flexibility
    if (response.data && (response.data.result || response.data.data)) {
      return response.data;
    }
    
    return response.data;
  } catch (error) {
    console.error('Error updating brand:', error);
    throw error;
  }
};

// Delete brand
export const deleteBrand = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/brand/${id}`);
    
    // Return the full response for flexibility
    if (response.data && (response.data.result || response.data.data)) {
      return response.data;
    }
    
    return response.data;
  } catch (error) {
    console.error('Error deleting brand:', error);
    throw error;
  }
};

