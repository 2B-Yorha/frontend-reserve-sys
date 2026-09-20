import type { Role, User } from '../types';
import { api } from './axiosInstance';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  role: Role;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
}

export const authApi = {
  login: (body: LoginRequest) =>
    api.post<LoginResponse>('/auth/login', body).then((r) => r.data),

  register: (body: RegisterRequest) =>
    api.post<Pick<User, 'id' | 'email' | 'role'>>('/auth/register', body).then((r) => r.data),

  me: () => api.get<User>('/auth/me').then((r) => r.data),
};