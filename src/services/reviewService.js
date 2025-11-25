import axiosInstance from '../Util/axios';

/**
 * Review Service
 * Handles all review-related API calls
 */

// Get all reviews
export const getAllReviews = async () => {
  try {
    const response = await axiosInstance.get('/api/review');
    
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
    console.error('Error fetching reviews:', error);
    return [];
  }
};

// Get reviews by product ID
export const getReviewsByProduct = async (productId) => {
  try {
    const response = await axiosInstance.get(`/api/review/product/${productId}`);
    
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
    console.error('Error fetching product reviews:', error);
    return [];
  }
};

// Get reviews by user ID
export const getReviewsByUser = async (userId) => {
  try {
    const response = await axiosInstance.get(`/api/review/user/${userId}`);
    
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
    console.error('Error fetching user reviews:', error);
    return [];
  }
};

// Create new review
export const createReview = async (reviewData) => {
  try {
    const response = await axiosInstance.post('/api/review', reviewData);
    return response.data;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

// Update review
export const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await axiosInstance.put(`/api/review/${reviewId}`, reviewData);
    return response.data;
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

