import axios from 'axios';

export const analyzeResume = async (formData, hasJobDesc) => {
  const endpoint = hasJobDesc ? '/api/resume/analyze-with-job' : '/api/resume/analyze';
  const response = await axios.post(endpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const getJobSuggestions = async (query) => {
  const response = await axios.get('/api/jobs/suggestions', { params: { query } });
  return response.data;
};

export const getCompanies = async (query) => {
  const response = await axios.get('/api/jobs/companies', { params: { query } });
  return response.data;
};
