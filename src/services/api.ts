import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Fee constants
export const COLLECTION_FEE = 500; // TSH - for delivery to location
export const SELF_PICKUP_FEE = 200; // TSH - for self pickup from stationary

// Mock data generators
export const mockDocuments = Array.from({ length: 10 }, (_, i) => {
  const deliveryType = Math.random() > 0.5 ? 'delivery' : 'self-pickup';
  return {
    id: `doc-${i + 1}`,
    fileName: `Document_${i + 1}.pdf`,
    pages: Math.floor(Math.random() * 50) + 1,
    printType: Math.random() > 0.5 ? 'color' : 'bw',
    cost: Math.floor(Math.random() * 5000) + 1000,
    paymentStatus: ['pending', 'paid'][Math.floor(Math.random() * 2)],
    printStatus: ['pending', 'printed', 'collected'][Math.floor(Math.random() * 3)],
    uploadedAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    studentId: `student-${Math.floor(Math.random() * 100) + 1}`,
    studentName: `Student ${Math.floor(Math.random() * 100) + 1}`,
    classId: `class-${Math.floor(Math.random() * 5) + 1}`,
    className: `Class ${Math.floor(Math.random() * 5) + 1}`,
    runnerId: Math.random() > 0.5 ? `runner-${Math.floor(Math.random() * 5) + 1}` : null,
    deliveryType,
    location: deliveryType === 'delivery' ? `Block ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}, Room ${Math.floor(Math.random() * 200) + 100}` : null,
  };
});

export const mockUsers = Array.from({ length: 50 }, (_, i) => ({
  id: `user-${i + 1}`,
  name: `User ${i + 1}`,
  email: `user${i + 1}@college.edu`,
  role: ['student', 'admin', 'runner', 'stationary'][Math.floor(Math.random() * 4)],
  classId: Math.random() > 0.3 ? `class-${Math.floor(Math.random() * 5) + 1}` : null,
  className: Math.random() > 0.3 ? `Class ${Math.floor(Math.random() * 5) + 1}` : null,
  status: Math.random() > 0.1 ? 'active' : 'inactive',
  createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
}));

export const mockInventory = Array.from({ length: 20 }, (_, i) => ({
  id: `item-${i + 1}`,
  name: ['A4 Paper', 'A3 Paper', 'Toner Cartridge', 'Ink Cartridge', 'Binding Covers', 'Binding Coils', 'Staples', 'Paper Clips'][i % 8],
  category: ['paper', 'toner', 'binding', 'supplies'][Math.floor(Math.random() * 4)],
  quantity: Math.floor(Math.random() * 1000),
  minThreshold: 100,
  unit: ['sheets', 'pieces', 'boxes'][Math.floor(Math.random() * 3)],
  lastUpdated: new Date(Date.now() - Math.random() * 10000000).toISOString(),
}));

export default api;
