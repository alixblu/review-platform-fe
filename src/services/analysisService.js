import axiosInstance from '../Util/axios';

/**
 * Analysis Service
 * Handles ingredient analysis API calls
 */

// Get all analyses
export const getAllAnalyses = async () => {
  try {
    const response = await axiosInstance.get('/api/analysis');
    
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
    console.error('Error fetching analyses:', error);
    return [];
  }
};

// Get analysis by product ID
export const getAnalysisByProduct = async (productId) => {
  try {
    const response = await axiosInstance.get(`/api/analysis/${productId}`);
    
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
    console.error('Error fetching analysis:', error);
    return null;
  }
};

// Create new analysis
export const createAnalysis = async (analysisData) => {
  try {
    const response = await axiosInstance.post('/api/analysis', analysisData);
    return response.data;
  } catch (error) {
    console.error('Error creating analysis:', error);
    throw error;
  }
};

// Update analysis
export const updateAnalysis = async (productId, analysisData) => {
  try {
    const response = await axiosInstance.put(`/api/analysis/${productId}`, analysisData);
    return response.data;
  } catch (error) {
    console.error('Error updating analysis:', error);
    throw error;
  }
};

