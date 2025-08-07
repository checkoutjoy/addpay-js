import { describe, it, expect, beforeEach } from 'vitest';
import { AddPayClient } from '../client';
import { ApiConfig } from '../types';

describe('AddPayClient', () => {
  let config: ApiConfig;

  beforeEach(() => {
    config = {
      appId: 'test-app-id',
      merchantNo: 'test-merchant',
      storeNo: 'test-store',
      privateKey: '-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA...\n-----END RSA PRIVATE KEY-----',
      publicKey: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0...\n-----END PUBLIC KEY-----',
      gatewayPublicKey: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0...\n-----END PUBLIC KEY-----',
      sandbox: true,
    };
  });

  it('should create a client with valid config', () => {
    const client = new AddPayClient(config);
    expect(client).toBeInstanceOf(AddPayClient);
    expect(client.checkout).toBeDefined();
    expect(client.debicheck).toBeDefined();
    expect(client.token).toBeDefined();
  });

  it('should throw error with missing required config', () => {
    const invalidConfig = { ...config };
    delete (invalidConfig as any).appId;
    
    expect(() => new AddPayClient(invalidConfig)).toThrow('Missing required configuration: appId');
  });



  it('should create client with static create method', () => {
    const client = AddPayClient.create(config);
    expect(client).toBeInstanceOf(AddPayClient);
  });
});