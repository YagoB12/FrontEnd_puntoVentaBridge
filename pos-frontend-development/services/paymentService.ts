import api, { getErrorMessage } from './api';
import type { SinpePayment, PaymentRequest, PaymentFilters, PaymentStatus, ApiResponse, PaginatedResponse } from '@/types';

export const paymentService = {
  async getPayments(
    page: number = 1,
    pageSize: number = 10,
    filters?: PaymentFilters
  ): Promise<ApiResponse<PaginatedResponse<SinpePayment>>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      
      if (filters?.status) params.append('status', filters.status);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      if (filters?.search) params.append('search', filters.search);

      const response = await api.get<PaginatedResponse<SinpePayment>>(`/payments?${params}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async getPayment(id: string): Promise<ApiResponse<SinpePayment>> {
    try {
      const response = await api.get<SinpePayment>(`/payments/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async createPaymentRequest(orderId: string, amount: number): Promise<ApiResponse<PaymentRequest>> {
    try {
      const response = await api.post<PaymentRequest>('/payments/request', { orderId, amount });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async checkPaymentStatus(orderId: string): Promise<ApiResponse<{ status: PaymentStatus; payment?: SinpePayment }>> {
    try {
      const response = await api.get<{ status: PaymentStatus; payment?: SinpePayment }>(`/payments/status/${orderId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async approvePayment(id: string): Promise<ApiResponse<SinpePayment>> {
    try {
      const response = await api.post<SinpePayment>(`/payments/${id}/approve`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async rejectPayment(id: string, reason: string): Promise<ApiResponse<SinpePayment>> {
    try {
      const response = await api.post<SinpePayment>(`/payments/${id}/reject`, { reason });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },
};
