import api, { getErrorMessage } from './api';
import type { Product, ApiResponse } from '@/types';

export const productService = {

  async getProducts(): Promise<ApiResponse<Product[]>> {

    try {

      const response = await api.get<Product[]>('/products');

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