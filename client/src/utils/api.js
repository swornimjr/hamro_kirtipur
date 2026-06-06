import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api` : '/api',
});

// Listings
export const getListings = (params) => api.get('/listings', { params });
export const getListing = (id) => api.get(`/listings/${id}`);
export const suggestListing = (data) => api.post('/listings/suggest', data);

// Wards
export const getWards = () => api.get('/wards');
export const getWard = (number) => api.get(`/wards/${number}`);

// Emergency
export const getEmergencyContacts = () => api.get('/emergency');

export default api;
