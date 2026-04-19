import axios from 'axios';
import type { AuthResponse, Contact, LoginRequest, RegisterRequest, Category, PageResponse } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (data: LoginRequest) => api.post<AuthResponse>('/auth/login', data),
  register: (data: RegisterRequest) => api.post<AuthResponse>('/auth/register', data),
};

export const contactsApi = {
  getAll: (params?: { search?: string; categoryId?: string; page?: number; size?: number; sort?: string }) =>
    api.get<PageResponse<Contact>>('/contacts', { params }),
  getById: (id: string) => api.get<Contact>(`/contacts/${id}`),
  create: (data: Partial<Contact>) => api.post<Contact>('/contacts', data),
  update: (id: string, data: Partial<Contact>) => api.put<Contact>(`/contacts/${id}`, data),
  delete: (id: string) => api.delete(`/contacts/${id}`),
  export: () => api.get('/contacts/export', { responseType: 'blob' }),
};

export const categoriesApi = {
  getAll: () => api.get<Category[]>('/categories'),
  create: (name: string) => api.post<Category>('/categories', null, { params: { name } }),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

export default api;