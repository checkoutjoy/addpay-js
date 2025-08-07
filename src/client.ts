import { ApiConfig } from './types';
import { HttpClient } from './lib/http-client';
import { CheckoutResource } from './resources/checkout';
import { DebiCheckResource } from './resources/debicheck';
import { TokenResource } from './resources/token';

/**
 * AddPay SDK Client
 * 
 * Main entry point for interacting with the AddPay Cloud API
 */
export class AddPayClient {
  private httpClient: HttpClient;
  
  public readonly checkout: CheckoutResource;
  public readonly debicheck: DebiCheckResource;
  public readonly token: TokenResource;

  constructor(config: ApiConfig) {
    this.validateConfig(config);
    this.httpClient = new HttpClient(config);
    
    this.checkout = new CheckoutResource(this.httpClient);
    this.debicheck = new DebiCheckResource(this.httpClient);
    this.token = new TokenResource(this.httpClient);
  }

  private validateConfig(config: ApiConfig): void {
    const required = ['appId', 'merchantNo', 'storeNo', 'privateKey', 'publicKey', 'gatewayPublicKey'];
    
    for (const field of required) {
      if (!config[field as keyof ApiConfig]) {
        throw new Error(`Missing required configuration: ${field}`);
      }
    }
  }

  /**
   * Create a new AddPay client instance
   */
  static create(config: ApiConfig): AddPayClient {
    return new AddPayClient(config);
  }

  /**
   * Create a sandbox client with test credentials
   */
  
}