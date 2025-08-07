import { describe, it, expect } from 'vitest';
import { CryptoUtils } from '../utils/crypto';
import crypto from 'crypto';

describe('CryptoUtils', () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });

  describe('signWithRSA and verifyWithRSA', () => {
    it('should sign and verify data correctly', () => {
      const data = 'test data to sign';
      const signature = CryptoUtils.signWithRSA(data, privateKey);
      
      expect(signature).toBeTruthy();
      expect(typeof signature).toBe('string');
      
      const isValid = CryptoUtils.verifyWithRSA(data, signature, publicKey);
      expect(isValid).toBe(true);
    });

    it('should fail verification with wrong data', () => {
      const data = 'test data to sign';
      const wrongData = 'wrong data';
      const signature = CryptoUtils.signWithRSA(data, privateKey);
      
      const isValid = CryptoUtils.verifyWithRSA(wrongData, signature, publicKey);
      expect(isValid).toBe(false);
    });

    it('should fail verification with invalid signature', () => {
      const data = 'test data to sign';
      const invalidSignature = 'invalid-signature';
      
      const isValid = CryptoUtils.verifyWithRSA(data, invalidSignature, publicKey);
      expect(isValid).toBe(false);
    });
  });

  describe('generateNonce', () => {
    it('should generate unique nonces', () => {
      const nonce1 = CryptoUtils.generateNonce();
      const nonce2 = CryptoUtils.generateNonce();
      
      expect(nonce1).toBeTruthy();
      expect(nonce2).toBeTruthy();
      expect(nonce1).not.toBe(nonce2);
      expect(typeof nonce1).toBe('string');
      expect(nonce1.length).toBe(32);
    });
  });

  describe('generateTimestamp', () => {
    it('should generate current timestamp', () => {
      const before = Date.now();
      const timestamp = CryptoUtils.generateTimestamp();
      const after = Date.now();
      
      expect(timestamp).toBeGreaterThanOrEqual(before);
      expect(timestamp).toBeLessThanOrEqual(after);
    });
  });

  describe('sortObjectKeys', () => {
    it('should sort object keys and filter out empty values', () => {
      const obj = {
        z: 'value',
        a: 'value',
        m: '',
        b: null,
        c: undefined,
        d: 'value',
      };
      
      const sorted = CryptoUtils.sortObjectKeys(obj);
      const keys = Object.keys(sorted);
      
      expect(keys).toEqual(['a', 'd', 'z']);
      expect(sorted).toEqual({
        a: 'value',
        d: 'value',
        z: 'value',
      });
    });
  });

  describe('buildSignatureString', () => {
    it('should build signature string from object', () => {
      const params = {
        merchant_no: '123456',
        order_amount: '100.00',
        currency: 'ZAR',
        sign: 'should-be-excluded',
        empty_field: '',
        null_field: null,
      };
      
      const signString = CryptoUtils.buildSignatureString(params);
      
      expect(signString).toBe('currency=ZAR&merchant_no=123456&order_amount=100.00');
    });

    it('should handle object values', () => {
      const params = {
        merchant_no: '123456',
        customer_info: { name: 'John', email: 'john@example.com' },
        amount: '100.00',
      };
      
      const signString = CryptoUtils.buildSignatureString(params);
      
      expect(signString).toContain('customer_info={"name":"John","email":"john@example.com"}');
      expect(signString).toContain('merchant_no=123456');
      expect(signString).toContain('amount=100.00');
    });
  });
});