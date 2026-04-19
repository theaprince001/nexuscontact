export interface User {
  email: string;
  fullName: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  fullName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface Contact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  avatarColor: string;
  isFavorite: boolean;
  categoryId?: string;
  categoryName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}