export type TransactionStatus = 
  | 0  // Processing
  | 1  // Closed
  | 2  // Completed
  | 3; // Cancelled

export type TransactionType = 
  | 1   // Purchase
  | 2   // Purchase Cancellation
  | 3   // Refund
  | 4   // Pre-auth
  | 11; // Cashback

export type PaymentScenario = 
  | 'WEB_PAY'  // PC Web Payment
  | 'WAP_PAY'  // Mobile/WAP Payment
  | 'CNP_PAY'; // Online card payment

export type PlatformType = 
  | 'WEB'     // Computerized website
  | 'WAP'     // Mobile H5 page
  | 'ANDROID' // Android
  | 'IOS';    // iOS

export type Currency = 'ZAR' | 'USD' | 'EUR' | 'GBP';

export interface ApiConfig {
  appId: string;
  merchantNo: string;
  storeNo: string;
  privateKey: string;
  publicKey: string;
  gatewayPublicKey: string;
  baseUrl?: string;
  timeout?: number;
  sandbox?: boolean;
}

export interface ApiResponse<T = any> {
  code: string;
  msg: string;
  data?: T;
  sign?: string;
  timestamp?: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp?: number;
}

export class AddPayError extends Error {
  public code: string;
  public details?: any;
  public timestamp?: number;

  constructor(code: string, message: string, details?: any) {
    super(message);
    this.name = 'AddPayError';
    this.code = code;
    this.details = details;
    this.timestamp = Date.now();
  }
}

export interface RequestOptions {
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}