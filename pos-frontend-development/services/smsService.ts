import api, { getErrorMessage } from './api';

interface SendSmsRequest {
  sender: string;
  message: string;
  customerPhone?: string;
}

export const smsService = {

  async sendSms(
    data: SendSmsRequest
  ) {

    try {

      const response = await api.post(
        '/sms',
        data
      );

      return {
        success: true,
        data: response.data
      };

    } catch (error) {

      return {
        success: false,
        error: getErrorMessage(error)
      };

    }
  }
};