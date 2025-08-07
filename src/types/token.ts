import { Currency, TransactionStatus } from './common';

export interface TokenizationRequest {
  merchant_order_no: string;
  card_info?: CardInfo;
  customer_info?: TokenCustomerInfo;
  notify_url: string;
  return_url?: string;
  verification_amount?: string | number;
  currency?: Currency;
}

export interface CardInfo {
  card_number?: string;
  card_holder_name?: string;
  expiry_month?: string;
  expiry_year?: string;
  cvv?: string;
}

export interface TokenCustomerInfo {
  customer_id: string;
  customer_email?: string;
  customer_phone?: string;
  customer_name?: string;
  billing_address?: BillingAddress;
}

export interface BillingAddress {
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export interface TokenizationResponse {
  merchant_order_no: string;
  token: string;
  token_status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  card_info: TokenizedCardInfo;
  expire_time?: string;
}

export interface TokenizedCardInfo {
  masked_card_number: string;
  card_brand: 'VISA' | 'MASTERCARD' | 'AMEX' | 'DISCOVER' | 'OTHER';
  card_type: 'CREDIT' | 'DEBIT';
  expiry_month: string;
  expiry_year: string;
  card_holder_name?: string;
}

export interface TokenPaymentRequest {
  token: string;
  merchant_order_no: string;
  order_amount: string | number;
  currency: Currency;
  cvv?: string;
  description?: string;
  notify_url: string;
  return_url?: string;
  customer_info?: TokenCustomerInfo;
}

export interface TokenPaymentResponse {
  merchant_order_no: string;
  order_no: string;
  trans_status: TransactionStatus;
  order_amount: string;
  currency: Currency;
  auth_code?: string;
  response_code?: string;
  response_message?: string;
  trans_time?: string;
}

export interface TokenDeleteRequest {
  token: string;
  customer_id?: string;
}

export interface TokenDeleteResponse {
  token: string;
  status: 'DELETED' | 'NOT_FOUND';
  delete_time?: string;
}

export interface TokenListRequest {
  customer_id: string;
  page?: number;
  limit?: number;
}

export interface TokenListResponse {
  customer_id: string;
  tokens: TokenInfo[];
  total: number;
  page: number;
  limit: number;
}

export interface TokenInfo {
  token: string;
  token_status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  card_info: TokenizedCardInfo;
  created_at: string;
  last_used_at?: string;
}