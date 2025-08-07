import crypto from 'crypto';

export class CryptoUtils {
  static signWithRSA(data: string, privateKey: string): string {
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(data);
    sign.end();
    return sign.sign(privateKey, 'base64');
  }

  static verifyWithRSA(data: string, signature: string, publicKey: string): boolean {
    try {
      const verify = crypto.createVerify('RSA-SHA256');
      verify.update(data);
      verify.end();
      return verify.verify(publicKey, signature, 'base64');
    } catch {
      return false;
    }
  }

  static encryptWithRSA(data: string, publicKey: string): string {
    const buffer = Buffer.from(data, 'utf-8');
    const encrypted = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      },
      buffer
    );
    return encrypted.toString('base64');
  }

  static decryptWithRSA(encryptedData: string, privateKey: string): string {
    const buffer = Buffer.from(encryptedData, 'base64');
    const decrypted = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      },
      buffer
    );
    return decrypted.toString('utf-8');
  }

  static generateNonce(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  static generateTimestamp(): number {
    return Date.now();
  }

  static sortObjectKeys(obj: Record<string, any>): Record<string, any> {
    const sorted: Record<string, any> = {};
    Object.keys(obj)
      .sort()
      .forEach((key) => {
        if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
          sorted[key] = obj[key];
        }
      });
    return sorted;
  }

  static buildSignatureString(params: Record<string, any>): string {
    const sorted = this.sortObjectKeys(params);
    const pairs: string[] = [];
    
    for (const [key, value] of Object.entries(sorted)) {
      if (key === 'sign') continue;
      if (value === undefined || value === null || value === '') continue;
      
      if (typeof value === 'object') {
        pairs.push(`${key}=${JSON.stringify(value)}`);
      } else {
        pairs.push(`${key}=${value}`);
      }
    }
    
    return pairs.join('&');
  }
}