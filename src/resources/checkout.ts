import { HttpClient } from '../lib/http-client';
import {
  CheckoutRequest,
  CheckoutResponse,
  CheckoutStatusRequest,
  CheckoutStatusResponse,
} from '../types';

export class CheckoutResource {
  constructor(private client: HttpClient) {}

  /**
   * Create a checkout session for hosted payment page
   */
  async create(request: CheckoutRequest): Promise<CheckoutResponse> {
    const response = await this.client.request<CheckoutResponse>(
      '/api/entry/checkout',
      'POST',
      request
    );
    
    if (!response.data) {
      throw new Error('No checkout data returned');
    }
    
    return response.data;
  }

  /**
   * Get the status of a checkout session
   */
  async getStatus(request: CheckoutStatusRequest): Promise<CheckoutStatusResponse> {
    if (!request.merchant_order_no && !request.order_no) {
      throw new Error('Either merchant_order_no or order_no is required');
    }
    
    const response = await this.client.request<CheckoutStatusResponse>(
      '/api/entry/checkout/status',
      'POST',
      request
    );
    
    if (!response.data) {
      throw new Error('No status data returned');
    }
    
    return response.data;
  }

  /**
   * Cancel a checkout session
   */
  async cancel(merchantOrderNo: string): Promise<CheckoutStatusResponse> {
    const response = await this.client.request<CheckoutStatusResponse>(
      '/api/entry/checkout/cancel',
      'POST',
      { merchant_order_no: merchantOrderNo }
    );
    
    if (!response.data) {
      throw new Error('No cancellation data returned');
    }
    
    return response.data;
  }

  /**
   * Refund a completed checkout transaction
   */
  async refund(
    merchantOrderNo: string,
    refundAmount?: string | number,
    reason?: string
  ): Promise<CheckoutStatusResponse> {
    const request: any = { merchant_order_no: merchantOrderNo };
    
    if (refundAmount !== undefined) {
      request.refund_amount = refundAmount;
    }
    
    if (reason) {
      request.refund_reason = reason;
    }
    
    const response = await this.client.request<CheckoutStatusResponse>(
      '/api/entry/checkout/refund',
      'POST',
      request
    );
    
    if (!response.data) {
      throw new Error('No refund data returned');
    }
    
    return response.data;
  }

  /**
   * Create a checkout session with fluent API
   */
  createCheckout() {
    return new CheckoutBuilder(this);
  }
}

/**
 * Fluent builder for checkout requests
 */
export class CheckoutBuilder {
  private request: Partial<CheckoutRequest> = {};

  constructor(private resource: CheckoutResource) {}

  merchantOrderNo(value: string): this {
    this.request.merchant_order_no = value;
    return this;
  }

  amount(value: string | number): this {
    this.request.order_amount = value;
    return this;
  }

  currency(value: CheckoutRequest['price_currency']): this {
    this.request.price_currency = value;
    return this;
  }

  notifyUrl(value: string): this {
    this.request.notify_url = value;
    return this;
  }

  returnUrl(value: string): this {
    this.request.return_url = value;
    return this;
  }

  description(value: string): this {
    this.request.description = value;
    return this;
  }

  attach(value: string): this {
    this.request.attach = value;
    return this;
  }

  expireTime(value: number): this {
    this.request.expire_time = value;
    return this;
  }

  goods(value: CheckoutRequest['goods_info']): this {
    this.request.goods_info = value;
    return this;
  }

  terminal(value: CheckoutRequest['terminal']): this {
    this.request.terminal = value;
    return this;
  }

  sceneInfo(value: CheckoutRequest['scene_info']): this {
    this.request.scene_info = value;
    return this;
  }

  customerInfo(value: CheckoutRequest['customer_info']): this {
    this.request.customer_info = value;
    return this;
  }

  async execute(): Promise<CheckoutResponse> {
    this.validate();
    return this.resource.create(this.request as CheckoutRequest);
  }

  private validate(): void {
    const required = [
      'merchant_order_no',
      'order_amount',
      'price_currency',
      'notify_url',
      'return_url',
    ];
    
    for (const field of required) {
      if (!(field in this.request)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
  }
}