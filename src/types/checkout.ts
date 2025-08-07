import { Currency, PlatformType, TransactionStatus, TransactionType } from './common';

export interface CheckoutRequest {
  merchant_order_no: string;
  order_amount: string | number;
  price_currency: Currency;
  notify_url: string;
  return_url: string;
  description?: string;
  attach?: string;
  expire_time?: number;
  goods_info?: GoodsInfo[];
  terminal?: PlatformType;
  scene_info?: SceneInfo;
  customer_info?: CustomerInfo;
}

export interface GoodsInfo {
  goods_name: string;
  goods_id?: string;
  goods_category?: string;
  goods_desc?: string;
  goods_quantity?: number;
  goods_price?: string | number;
}

export interface SceneInfo {
  device_id?: string;
  device_ip?: string;
  latitude?: string;
  longitude?: string;
}

export interface CustomerInfo {
  customer_id?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_name?: string;
}

export interface CheckoutResponse {
  merchant_order_no: string;
  order_no: string;
  pay_url: string;
  qr_code?: string;
  expire_time?: number;
  trans_status: TransactionStatus;
}

export interface CheckoutStatusRequest {
  merchant_order_no?: string;
  order_no?: string;
}

export interface CheckoutStatusResponse {
  merchant_order_no: string;
  order_no: string;
  trans_status: TransactionStatus;
  trans_type: TransactionType;
  order_amount: string;
  price_currency: Currency;
  paid_amount?: string;
  paid_currency?: Currency;
  pay_time?: string;
  complete_time?: string;
  cancel_time?: string;
  refund_amount?: string;
  attach?: string;
}