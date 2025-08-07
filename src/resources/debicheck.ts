import { HttpClient } from '../lib/http-client';
import {
  DebiCheckMandateRequest,
  DebiCheckMandateResponse,
  DebiCheckCollectionRequest,
  DebiCheckCollectionResponse,
  DebiCheckStatusRequest,
  DebiCheckStatusResponse,
  MandateInfo,
  DebiCheckCustomerInfo,
} from '../types';

export class DebiCheckResource {
  constructor(private client: HttpClient) {}

  /**
   * Create a DebiCheck mandate
   */
  async createMandate(request: DebiCheckMandateRequest): Promise<DebiCheckMandateResponse> {
    const response = await this.client.request<DebiCheckMandateResponse>(
      '/api/entry/debicheck/mandate',
      'POST',
      request
    );
    
    if (!response.data) {
      throw new Error('No mandate data returned');
    }
    
    return response.data;
  }

  /**
   * Initiate a collection against an approved mandate
   */
  async collect(request: DebiCheckCollectionRequest): Promise<DebiCheckCollectionResponse> {
    const response = await this.client.request<DebiCheckCollectionResponse>(
      '/api/entry/debicheck/collect',
      'POST',
      request
    );
    
    if (!response.data) {
      throw new Error('No collection data returned');
    }
    
    return response.data;
  }

  /**
   * Get the status of a mandate and its collections
   */
  async getStatus(request: DebiCheckStatusRequest): Promise<DebiCheckStatusResponse> {
    if (!request.mandate_reference && !request.merchant_order_no) {
      throw new Error('Either mandate_reference or merchant_order_no is required');
    }
    
    const response = await this.client.request<DebiCheckStatusResponse>(
      '/api/entry/debicheck/status',
      'POST',
      request
    );
    
    if (!response.data) {
      throw new Error('No status data returned');
    }
    
    return response.data;
  }

  /**
   * Cancel a mandate
   */
  async cancelMandate(mandateReference: string): Promise<DebiCheckStatusResponse> {
    const response = await this.client.request<DebiCheckStatusResponse>(
      '/api/entry/debicheck/mandate/cancel',
      'POST',
      { mandate_reference: mandateReference }
    );
    
    if (!response.data) {
      throw new Error('No cancellation data returned');
    }
    
    return response.data;
  }

  /**
   * Create a mandate with fluent API
   */
  createMandateBuilder() {
    return new DebiCheckMandateBuilder(this);
  }

  /**
   * Create a collection with fluent API
   */
  createCollectionBuilder() {
    return new DebiCheckCollectionBuilder(this);
  }
}

/**
 * Fluent builder for DebiCheck mandate requests
 */
export class DebiCheckMandateBuilder {
  private request: Partial<DebiCheckMandateRequest> = {};

  constructor(private resource: DebiCheckResource) {}

  merchantOrderNo(value: string): this {
    this.request.merchant_order_no = value;
    return this;
  }

  customerInfo(value: DebiCheckCustomerInfo): this {
    this.request.customer_info = value;
    return this;
  }

  customer(builder: (info: CustomerInfoBuilder) => void): this {
    const customerBuilder = new CustomerInfoBuilder();
    builder(customerBuilder);
    this.request.customer_info = customerBuilder.build();
    return this;
  }

  mandateInfo(value: MandateInfo): this {
    this.request.mandate_info = value;
    return this;
  }

  mandate(builder: (info: MandateInfoBuilder) => void): this {
    const mandateBuilder = new MandateInfoBuilder();
    builder(mandateBuilder);
    this.request.mandate_info = mandateBuilder.build();
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

  async execute(): Promise<DebiCheckMandateResponse> {
    this.validate();
    return this.resource.createMandate(this.request as DebiCheckMandateRequest);
  }

  private validate(): void {
    const required = ['merchant_order_no', 'customer_info', 'mandate_info', 'notify_url'];
    
    for (const field of required) {
      if (!(field in this.request)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
  }
}

/**
 * Builder for customer info
 */
export class CustomerInfoBuilder {
  private info: Partial<DebiCheckCustomerInfo> = {};

  id(value: string): this {
    this.info.customer_id = value;
    return this;
  }

  name(value: string): this {
    this.info.customer_name = value;
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

  idNumber(value: string): this {
    this.info.id_number = value;
    return this;
  }

  accountNumber(value: string): this {
    this.info.account_number = value;
    return this;
  }

  accountType(value: DebiCheckCustomerInfo['account_type']): this {
    this.info.account_type = value;
    return this;
  }

  bankName(value: string): this {
    this.info.bank_name = value;
    return this;
  }

  branchCode(value: string): this {
    this.info.branch_code = value;
    return this;
  }

  build(): DebiCheckCustomerInfo {
    const required = [
      'customer_id',
      'customer_name',
      'id_number',
      'account_number',
      'account_type',
      'bank_name',
      'branch_code',
    ];
    
    for (const field of required) {
      if (!(field in this.info)) {
        throw new Error(`Missing required customer field: ${field}`);
      }
    }
    
    return this.info as DebiCheckCustomerInfo;
  }
}

/**
 * Builder for mandate info
 */
export class MandateInfoBuilder {
  private info: Partial<MandateInfo> = {};

  type(value: MandateInfo['mandate_type']): this {
    this.info.mandate_type = value;
    return this;
  }

  maxAmount(value: string | number): this {
    this.info.max_amount = value;
    return this;
  }

  currency(value: MandateInfo['currency']): this {
    this.info.currency = value;
    return this;
  }

  startDate(value: string): this {
    this.info.start_date = value;
    return this;
  }

  endDate(value: string): this {
    this.info.end_date = value;
    return this;
  }

  frequency(value: MandateInfo['frequency']): this {
    this.info.frequency = value;
    return this;
  }

  installments(value: number): this {
    this.info.installments = value;
    return this;
  }

  trackingDays(value: number): this {
    this.info.tracking_days = value;
    return this;
  }

  description(value: string): this {
    this.info.description = value;
    return this;
  }

  build(): MandateInfo {
    const required = ['mandate_type', 'max_amount', 'currency', 'start_date'];
    
    for (const field of required) {
      if (!(field in this.info)) {
        throw new Error(`Missing required mandate field: ${field}`);
      }
    }
    
    return this.info as MandateInfo;
  }
}

/**
 * Fluent builder for DebiCheck collection requests
 */
export class DebiCheckCollectionBuilder {
  private request: Partial<DebiCheckCollectionRequest> = {};

  constructor(private resource: DebiCheckResource) {}

  mandateReference(value: string): this {
    this.request.mandate_reference = value;
    return this;
  }

  merchantOrderNo(value: string): this {
    this.request.merchant_order_no = value;
    return this;
  }

  amount(value: string | number): this {
    this.request.collection_amount = value;
    return this;
  }

  currency(value: DebiCheckCollectionRequest['currency']): this {
    this.request.currency = value;
    return this;
  }

  collectionDate(value: string): this {
    this.request.collection_date = value;
    return this;
  }

  notifyUrl(value: string): this {
    this.request.notify_url = value;
    return this;
  }

  async execute(): Promise<DebiCheckCollectionResponse> {
    this.validate();
    return this.resource.collect(this.request as DebiCheckCollectionRequest);
  }

  private validate(): void {
    const required = [
      'mandate_reference',
      'merchant_order_no',
      'collection_amount',
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