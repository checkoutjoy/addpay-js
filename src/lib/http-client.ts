import { ApiConfig, ApiResponse, AddPayError, RequestOptions } from '../types';
import { CryptoUtils } from '../utils/crypto';

export class HttpClient {
  private config: ApiConfig;
  private baseUrl: string;

  constructor(config: ApiConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 
      (config.sandbox ? 'http://gw.wisepaycloud.com' : 'https://api.paycloud.africa');
  }

  async request<T = any>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST',
    data?: Record<string, any>,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const timeout = options?.timeout || this.config.timeout || 30000;
    const retries = options?.retries || 0;

    const requestData = this.prepareRequestData(data || {});
    const signature = this.generateSignature(requestData);
    
    const body = {
      ...requestData,
      app_id: this.config.appId,
      merchant_no: this.config.merchantNo,
      store_no: this.config.storeNo,
      sign: signature,
      timestamp: CryptoUtils.generateTimestamp(),
      nonce: CryptoUtils.generateNonce(),
    };

    let lastError: Error | undefined;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options?.headers,
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new AddPayError(
            'HTTP_ERROR',
            `HTTP ${response.status}: ${response.statusText}`,
            { status: response.status, statusText: response.statusText }
          );
        }

        const result = await response.json() as ApiResponse<T>;
        
        if (result.code !== '0' && result.code !== 'SUCCESS') {
          throw new AddPayError(result.code, result.msg || 'Unknown error', result);
        }

        if (result.sign && !this.verifySignature(result)) {
          throw new AddPayError('INVALID_SIGNATURE', 'Response signature verification failed');
        }

        return result;
      } catch (error) {
        lastError = error as Error;
        
        if (error instanceof AddPayError) {
          throw error;
        }
        
        if ((error as any)?.name === 'AbortError') {
          if (attempt === retries) {
            throw new AddPayError('TIMEOUT', `Request timeout after ${timeout}ms`);
          }
          continue;
        }
        
        if (attempt === retries) {
          throw new AddPayError(
            'NETWORK_ERROR',
            `Network error: ${lastError?.message || 'Unknown error'}`,
            lastError
          );
        }
        
        await this.delay(Math.min(1000 * Math.pow(2, attempt), 5000));
      }
    }
    
    throw lastError || new AddPayError('UNKNOWN_ERROR', 'Unknown error occurred');
  }

  private prepareRequestData(data: Record<string, any>): Record<string, any> {
    const cleaned: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object' && !Array.isArray(value)) {
          cleaned[key] = JSON.stringify(value);
        } else {
          cleaned[key] = value;
        }
      }
    }
    
    return cleaned;
  }

  private generateSignature(data: Record<string, any>): string {
    const signString = CryptoUtils.buildSignatureString({
      ...data,
      app_id: this.config.appId,
      merchant_no: this.config.merchantNo,
      store_no: this.config.storeNo,
    });
    
    return CryptoUtils.signWithRSA(signString, this.config.privateKey);
  }

  private verifySignature(response: ApiResponse): boolean {
    const { sign, ...data } = response;
    if (!sign) return true;
    
    const signString = CryptoUtils.buildSignatureString(data);
    return CryptoUtils.verifyWithRSA(signString, sign, this.config.gatewayPublicKey);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}