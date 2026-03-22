import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('doctorToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Doctor Authentication
export const doctorLogin = async (email, password) => {
  try {
    const response = await apiClient.post('/doctors/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('doctorToken', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Login failed';
  }
};

export const doctorLogout = () => {
  localStorage.removeItem('doctorToken');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('doctorToken');
};

// Appointment APIs
export const getAvailableSlots = async (date) => {
  try {
    const response = await apiClient.get('/appointments/available-slots', {
      params: { date },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch slots';
  }
};

export const bookAppointment = async (appointmentData) => {
  try {
    const response = await apiClient.post('/appointments/book', appointmentData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to book appointment';
  }
};

export const getAllAppointments = async () => {
  try {
    const response = await apiClient.get('/appointments/all');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch appointments';
  }
};

export const getAppointmentDetails = async (appointmentId) => {
  try {
    const response = await apiClient.get(`/appointments/${appointmentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch appointment details';
  }
};

export const updateAppointmentDetails = async (appointmentId, details) => {
  try {
    const response = await apiClient.put(`/appointments/${appointmentId}`, details);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update appointment';
  }
};

export const getPatientHistory = async (phoneNumber) => {
  try {
    const response = await apiClient.get(`/appointments/patient-history/${phoneNumber}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch patient history';
  }
};
