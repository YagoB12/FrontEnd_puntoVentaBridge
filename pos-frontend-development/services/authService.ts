import api, { getErrorMessage } from './api';
import type { User, ApiResponse } from '@/types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async logout(): Promise<ApiResponse<void>> {
    try {
      await api.post('/auth/logout');
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const response = await api.get<User>('/auth/me');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    try {
      const response = await api.post<{ token: string }>('/auth/refresh');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },
};
