import axios from 'axios';
import type {
  LoginRequest,
  LoginResponse,
  Order,
  OrderRequest,
  StatusChangeRequest,
  UserBasic,
  Customer,
  CustomerRequest
} from '../types';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token JWT a todas las peticiones
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

// Interceptor para manejar errores de autenticación
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

// Auth API
export const authAPI = {
  login: (data: LoginRequest) => api.post<LoginResponse>('/auth/login', data),
};

// Orders API
export const ordersAPI = {
  getAll: () => api.get<Order[]>('/orders'),
  getById: (id: number) => api.get<Order>(`/orders/${id}`),
  create: (data: OrderRequest) => api.post<Order>('/orders', data),
  update: (id: number, data: OrderRequest) => api.put<Order>(`/orders/${id}`, data),
  delete: (id: number) => api.delete(`/orders/${id}`),
  updateStatus: (id: number, data: StatusChangeRequest) =>
    api.patch<Order>(`/orders/${id}/status`, data),
  getByStatus: (status: string) => api.get<Order[]>(`/orders/status/${status}`),
};

// Users API
export const usersAPI = {
  getAllOperators: () => api.get<UserBasic[]>('/users/operators'),
  getAll: () => api.get<UserBasic[]>('/users'),
};

// Customers API
export const customersAPI = {
  getAll: () => api.get<Customer[]>('/customers'),
  getById: (id: number) => api.get<Customer>(`/customers/${id}`),
  create: (data: CustomerRequest) => api.post<Customer>('/customers', data),
  update: (id: number, data: CustomerRequest) => api.put<Customer>(`/customers/${id}`, data),
  delete: (id: number) => api.delete(`/customers/${id}`),
};

export default api;
