import api, { getErrorMessage } from './api';
import type { DashboardStats, SalesData, RecentActivity, ApiResponse } from '@/types';

export const dashboardService = {
  async getStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      const response = await api.get<DashboardStats>('/dashboard/stats');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async getSalesData(period: 'week' | 'month' | 'year' = 'week'): Promise<ApiResponse<SalesData[]>> {
    try {
      const response = await api.get<SalesData[]>(`/dashboard/sales?period=${period}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async getRecentActivity(limit: number = 10): Promise<ApiResponse<RecentActivity[]>> {
    try {
      const response = await api.get<RecentActivity[]>(`/dashboard/activity?limit=${limit}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },
};
