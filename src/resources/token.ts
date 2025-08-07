import { HttpClient } from '../lib/http-client';
import {
  TokenizationRequest,
  TokenizationResponse,
  TokenPaymentRequest,
  TokenPaymentResponse,
  TokenDeleteRequest,
  TokenDeleteResponse,
  TokenListRequest,
  TokenListResponse,
  CardInfo,
  TokenCustomerInfo,
  BillingAddress,
} from '../types';

export class TokenResource {
  constructor(private client: HttpClient) {}

  /**
   * Tokenize a card for future payments
   */
  async tokenize(request: TokenizationRequest): Promise<TokenizationResponse> {
    const response = await this.client.request<TokenizationResponse>(
      '/api/entry/token/create',
      'POST',
      request
    );
    
    if (!response.data) {
      throw new Error('No tokenization data returned');
    }
    
    return response.data;
  }

  /**
   * Process a payment using a stored token
   */
  async pay(request: TokenPaymentRequest): Promise<TokenPaymentResponse> {
    const response = await this.client.request<TokenPaymentResponse>(
      '/api/entry/token/pay',
      'POST',
      request
    );
    
    if (!response.data) {
      throw new Error('No payment data returned');
    }
    
    return response.data;
  }

  /**
   * Delete a stored token
   */
  async delete(request: TokenDeleteRequest): Promise<TokenDeleteResponse> {
    const response = await this.client.request<TokenDeleteResponse>(
      '/api/entry/token/delete',
      'POST',
      request
    );
    
    if (!response.data) {
      throw new Error('No deletion data returned');
    }
    
    return response.data;
  }

  /**
   * List all tokens for a customer
   */
  async list(request: TokenListRequest): Promise<TokenListResponse> {
    const response = await this.client.request<TokenListResponse>(
      '/api/entry/token/list',
      'POST',
      request
    );
    
    if (!response.data) {
      throw new Error('No token list data returned');
    }
    
    return response.data;
  }

  /**
   * Get token details
   */
  async get(token: string): Promise<TokenizationResponse> {
    const response = await this.client.request<TokenizationResponse>(
      '/api/entry/token/get',
      'POST',
      { token }
    );
    
    if (!response.data) {
      throw new Error('No token data returned');
    }
    
    return response.data;
  }

  /**
   * Create a tokenization request with fluent API
   */
  createTokenization() {
    return new TokenizationBuilder(this);
  }

  /**
   * Create a token payment with fluent API
   */
  createPayment() {
    return new TokenPaymentBuilder(this);
  }
}

/**
 * Fluent builder for tokenization requests
 */
export class TokenizationBuilder {
  private request: Partial<TokenizationRequest> = {};

  constructor(private resource: TokenResource) {}

  merchantOrderNo(value: string): this {
    this.request.merchant_order_no = value;
    return this;
  }

  cardInfo(value: CardInfo): this {
    this.request.card_info = value;
    return this;
  }

  card(builder: (info: CardInfoBuilder) => void): this {
    const cardBuilder = new CardInfoBuilder();
    builder(cardBuilder);
    this.request.card_info = cardBuilder.build();
    return this;
  }

  customerInfo(value: TokenCustomerInfo): this {
    this.request.customer_info = value;
    return this;
  }

  customer(builder: (info: TokenCustomerBuilder) => void): this {
    const customerBuilder = new TokenCustomerBuilder();
    builder(customerBuilder);
    this.request.customer_info = customerBuilder.build();
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

  verificationAmount(value: string | number): this {
    this.request.verification_amount = value;
    return this;
  }

  currency(value: TokenizationRequest['currency']): this {
    this.request.currency = value;
    return this;
  }

  async execute(): Promise<TokenizationResponse> {
    this.validate();
    return this.resource.tokenize(this.request as TokenizationRequest);
  }

  private validate(): void {
    const required = ['merchant_order_no', 'notify_url'];
    
    for (const field of required) {
      if (!(field in this.request)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
  }
}

/**
 * Builder for card info
 */
export class CardInfoBuilder {
  private info: Partial<CardInfo> = {};

  cardNumber(value: string): this {
    this.info.card_number = value;
    return this;
  }

  cardHolderName(value: string): this {
    this.info.card_holder_name = value;
    return this;
  }

  expiryMonth(value: string): this {
    this.info.expiry_month = value;
    return this;
  }

  expiryYear(value: string): this {
    this.info.expiry_year = value;
    return this;
  }

  cvv(value: string): this {
    this.info.cvv = value;
    return this;
  }

  build(): CardInfo {
    return this.info as CardInfo;
  }
}

/**
 * Builder for token customer info
 */
export class TokenCustomerBuilder {
  private info: Partial<TokenCustomerInfo> = {};

  id(value: string): this {
    this.info.customer_id = value;
    return this;
  }

  email(value: string): this {
    this.info.customer_email = value;
    return this;
  }

  phone(value: string): this {
    this.info.customer_phone = value;
    return this;
  }

  name(value: string): this {
    this.info.customer_name = value;
    return this;
  }

  billingAddress(value: BillingAddress): this {
    this.info.billing_address = value;
    return this;
  }

  address(builder: (addr: BillingAddressBuilder) => void): this {
    const addressBuilder = new BillingAddressBuilder();
    builder(addressBuilder);
    this.info.billing_address = addressBuilder.build();
    return this;
  }

  build(): TokenCustomerInfo {
    if (!this.info.customer_id) {
      throw new Error('customer_id is required');
    }
    return this.info as TokenCustomerInfo;
  }
}

/**
 * Builder for billing address
 */
export class BillingAddressBuilder {
  private address: Partial<BillingAddress> = {};

  line1(value: string): this {
    this.address.address_line1 = value;
    return this;
  }

  line2(value: string): this {
    this.address.address_line2 = value;
    return this;
  }

  city(value: string): this {
    this.address.city = value;
    return this;
  }

  state(value: string): this {
    this.address.state = value;
    return this;
  }

  postalCode(value: string): this {
    this.address.postal_code = value;
    return this;
  }

  country(value: string): this {
    this.address.country = value;
    return this;
  }

  build(): BillingAddress {
    return this.address;
  }
}

/**
 * Fluent builder for token payment requests
 */
export class TokenPaymentBuilder {
  private request: Partial<TokenPaymentRequest> = {};

  constructor(private resource: TokenResource) {}

  token(value: string): this {
    this.request.token = value;
    return this;
  }

  merchantOrderNo(value: string): this {
    this.request.merchant_order_no = value;
    return this;
  }

  amount(value: string | number): this {
    this.request.order_amount = value;
    return this;
  }

  currency(value: TokenPaymentRequest['currency']): this {
    this.request.currency = value;
    return this;
  }

  cvv(value: string): this {
    this.request.cvv = value;
    return this;
  }

  description(value: string): this {
    this.request.description = value;
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

  customerInfo(value: TokenCustomerInfo): this {
    this.request.customer_info = value;
    return this;
  }

  async execute(): Promise<TokenPaymentResponse> {
    this.validate();
    return this.resource.pay(this.request as TokenPaymentRequest);
  }

  private validate(): void {
    const required = [
      'token',
      'merchant_order_no',
      'order_amount',
      'currency',
      'notify_url',
    ];
    
    for (const field of required) {
      if (!(field in this.request)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
  }
}