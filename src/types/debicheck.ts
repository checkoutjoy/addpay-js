import { Currency, TransactionStatus } from './common';

export interface DebiCheckMandateRequest {
  merchant_order_no: string;
  customer_info: DebiCheckCustomerInfo;
  mandate_info: MandateInfo;
  notify_url: string;
  return_url?: string;
}

export interface DebiCheckCustomerInfo {
  customer_id: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  id_number: string;
  account_number: string;
  account_type: 'CURRENT' | 'SAVINGS' | 'TRANSMISSION';
  bank_name: string;
  branch_code: string;
}

export interface MandateInfo {
  mandate_type: 'ONCE_OFF' | 'RECURRING';
  max_amount: string | number;
  currency: Currency;
  start_date: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
  frequency?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  installments?: number;
  tracking_days?: number;
  description?: string;
}

export interface DebiCheckMandateResponse {
  merchant_order_no: string;
  mandate_reference: string;
  mandate_status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  auth_url?: string;
  expire_time?: number;
}

export interface DebiCheckCollectionRequest {
  mandate_reference: string;
  merchant_order_no: string;
  collection_amount: string | number;
  currency: Currency;
  collection_date?: string; // YYYY-MM-DD
  notify_url: string;
}

export interface DebiCheckCollectionResponse {
  merchant_order_no: string;
  collection_reference: string;
  trans_status: TransactionStatus;
  collection_amount: string;
  currency: Currency;
  collection_date: string;
}

export interface DebiCheckStatusRequest {
  mandate_reference?: string;
  merchant_order_no?: string;
}

export interface DebiCheckStatusResponse {
  mandate_reference: string;
  mandate_status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  merchant_order_no: string;
  collections?: DebiCheckCollection[];
}

export interface DebiCheckCollection {
  collection_reference: string;
  merchant_order_no: string;
  trans_status: TransactionStatus;
  collection_amount: string;
  currency: Currency;
  collection_date: string;
  response_code?: string;
  response_message?: string;
}