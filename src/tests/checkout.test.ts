import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CheckoutResource, CheckoutBuilder } from '../resources/checkout';
import { CheckoutRequest } from '../types';

vi.mock('../lib/http-client');

describe('CheckoutResource', () => {
  let mockClient: any;
  let checkout: CheckoutResource;

  beforeEach(() => {
    mockClient = {
      request: vi.fn(),
    };
    checkout = new CheckoutResource(mockClient);
  });

  describe('create', () => {
    it('should create checkout successfully', async () => {
      const request: CheckoutRequest = {
        merchant_order_no: 'ORDER001',
        order_amount: '100.00',
        price_currency: 'ZAR',
        notify_url: 'https://example.com/notify',
        return_url: 'https://example.com/return',
      };

      const response = {
        data: {
          merchant_order_no: 'ORDER001',
          order_no: 'PAY001',
          pay_url: 'https://checkout.paycloud.africa/pay/PAY001',
          trans_status: 0,
        },
      };

      mockClient.request.mockResolvedValue(response);

      const result = await checkout.create(request);
      
      expect(mockClient.request).toHaveBeenCalledWith(
        '/api/entry/checkout',
        'POST',
        request
      );
      expect(result).toEqual(response.data);
    });

    it('should throw error when no data returned', async () => {
      mockClient.request.mockResolvedValue({ code: '0', msg: 'Success' });
      
      const request: CheckoutRequest = {
        merchant_order_no: 'ORDER001',
        order_amount: '100.00',
        price_currency: 'ZAR',
        notify_url: 'https://example.com/notify',
        return_url: 'https://example.com/return',
      };

      await expect(checkout.create(request)).rejects.toThrow('No checkout data returned');
    });
  });

  describe('getStatus', () => {
    it('should get status with merchant_order_no', async () => {
      const response = {
        data: {
          merchant_order_no: 'ORDER001',
          order_no: 'PAY001',
          trans_status: 2,
          trans_type: 1,
          order_amount: '100.00',
          price_currency: 'ZAR',
        },
      };

      mockClient.request.mockResolvedValue(response);

      const result = await checkout.getStatus({ merchant_order_no: 'ORDER001' });
      
      expect(mockClient.request).toHaveBeenCalledWith(
        '/api/entry/checkout/status',
        'POST',
        { merchant_order_no: 'ORDER001' }
      );
      expect(result).toEqual(response.data);
    });

    it('should throw error when neither merchant_order_no nor order_no provided', async () => {
      await expect(checkout.getStatus({})).rejects.toThrow(
        'Either merchant_order_no or order_no is required'
      );
    });
  });
});

describe('CheckoutBuilder', () => {
  let mockResource: any;
  let builder: CheckoutBuilder;

  beforeEach(() => {
    mockResource = {
      create: vi.fn(),
    };
    builder = new CheckoutBuilder(mockResource);
  });

  it('should build checkout request fluently', async () => {
    const mockResponse = {
      merchant_order_no: 'ORDER001',
      order_no: 'PAY001',
      pay_url: 'https://checkout.paycloud.africa/pay/PAY001',
      trans_status: 0,
    };

    mockResource.create.mockResolvedValue(mockResponse);

    const result = await builder
      .merchantOrderNo('ORDER001')
      .amount('100.00')
      .currency('ZAR')
      .notifyUrl('https://example.com/notify')
      .returnUrl('https://example.com/return')
      .description('Test payment')
      .execute();

    expect(mockResource.create).toHaveBeenCalledWith({
      merchant_order_no: 'ORDER001',
      order_amount: '100.00',
      price_currency: 'ZAR',
      notify_url: 'https://example.com/notify',
      return_url: 'https://example.com/return',
      description: 'Test payment',
    });

    expect(result).toEqual(mockResponse);
  });

  it('should throw error when required fields are missing', async () => {
    await expect(
      builder.merchantOrderNo('ORDER001').execute()
    ).rejects.toThrow('Missing required field: order_amount');
  });
});