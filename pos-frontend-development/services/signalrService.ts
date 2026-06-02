import * as signalR from '@microsoft/signalr';

const HUB_URL = 'http://localhost:5172/paymentHub';
// o el puerto donde corre tu backend

export const connection = new signalR.HubConnectionBuilder()
  .withUrl(HUB_URL)
  .withAutomaticReconnect()
  .build();