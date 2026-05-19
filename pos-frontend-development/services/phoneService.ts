import api, { getErrorMessage } from './api';
import type { PhoneMonitor, ApiResponse } from '@/types';

export const phoneService = {
  async getPhoneStatus(): Promise<ApiResponse<PhoneMonitor>> {
    try {
      const response = await api.get<PhoneMonitor>('/phone/status');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async restartService(service: 'ocr' | 'parser' | 'all'): Promise<ApiResponse<void>> {
    try {
      await api.post(`/phone/restart/${service}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async testConnection(): Promise<ApiResponse<{ connected: boolean; latency: number }>> {
    try {
      const response = await api.get<{ connected: boolean; latency: number }>('/phone/test');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },
};
