// User and Auth Types
export type UserRole = 'ADMIN' | 'CASHIER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Product Types
export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;

  // opcionales para UI
  description?: string;
  image?: string;
  category?: string;
  sku?: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  subtotal: number;
  tax: number;
}

// Order Types
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'manual_review';
export type PaymentMethod = 'sinpe' | 'cash' | 'card';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Order {
  id: number;
  customerName: string;
  phone: string;
  amount: number;
  status: string;
  createdAt: string;
  details: OrderDetail[];
}

export interface OrderDetail {
  productId: number;
  quantity: number;
  unitPrice?: number;
}

// Payment Types
export interface SinpePayment {
  id: string;
  reference: string;
  amount: number;
  status: PaymentStatus;
  payerName?: string;
  payerPhone?: string;
  orderId?: string;
  ocrResult?: string;
  validationResult?: string;
  createdAt: string;
  validatedAt?: string;
}

export interface PaymentRequest {
  orderId: string;
  amount: number;
  phoneNumber: string;
  reference: string;
  qrCode?: string;
}

// Dashboard Types
export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  pendingPayments: number;
  approvedPayments: number;
  rejectedPayments: number;
  averageOrderValue: number;
}

export interface SalesData {
  date: string;
  sales: number;
  orders: number;
}

export interface RecentActivity {
  id: string;
  type: 'order' | 'payment' | 'refund';
  description: string;
  amount?: number;
  status: string;
  timestamp: string;
}

// Phone Monitor Types
export type PhoneStatus = 'online' | 'offline' | 'error' | 'processing';

export interface PhoneMonitor {
  phoneId: string;
  status: PhoneStatus;
  lastConnection: string;
  lastSmsReceived?: string;
  ocrStatus: PhoneStatus;
  parserStatus: PhoneStatus;
  backendStatus: PhoneStatus;
  smsCount: number;
  processedCount: number;
  errorCount: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter Types
export interface OrderFilters {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface PaymentFilters {
  status?: PaymentStatus;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}
