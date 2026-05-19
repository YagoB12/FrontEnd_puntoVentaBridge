import api, { getErrorMessage } from './api';

import type {
  Order,
  ApiResponse,
  CartItem
} from '@/types';

interface CreateOrderData {
  customerName: string;
  phone: string;
  details: {
    productId: number;
    quantity: number;
  }[];
}

export const orderService = {

  async createOrder(
    data: CreateOrderData
  ): Promise<ApiResponse<Order>> {

    try {

      const response = await api.post<Order>(
        '/orders',
        data
      );

      return {
        success: true,
        data: response.data,
      };

    } catch (error) {

      return {
        success: false,
        error: getErrorMessage(error),
      };

    }
  },
};