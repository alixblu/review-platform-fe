import axiosInstance from '../Util/axios';

/**
 * Product Service
 * Handles all product-related API calls
 */

// Get all products
export const getAllProducts = async () => {
  try {
    const response = await axiosInstance.get('/api/product');
    // Backend returns { message, data }
    if (response.data && response.data.data) {
      return response.data.data;
    }
    // Fallback for old format { code, message, result }
    if (response.data && response.data.result) {
      return response.data.result;
    }
    return [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Get product by ID
export const getProductById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/product/${id}`);
    if (response.data && response.data.data) {
      return response.data.data;
    }
    // Fallback for old format
    if (response.data && response.data.result) {
      return response.data.result;
    }
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

// Create new product
export const createProduct = async (productData) => {
  try {
    const response = await axiosInstance.post('/api/product', productData);
    
    // Return full response for flexibility
    if (response.data && (response.data.result || response.data.data)) {
      return response.data;
    }
    
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Update product
export const updateProduct = async (id, productData) => {
  try {
    const response = await axiosInstance.put(`/api/product/${id}`, productData);
    
    // Return full response for flexibility
    if (response.data && (response.data.result || response.data.data)) {
      return response.data;
    }
    
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

