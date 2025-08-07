# AddPay JavaScript SDK - Development Guide

This document provides comprehensive information for developers working on or contributing to the AddPay JavaScript SDK.

## Project Overview

The AddPay JavaScript SDK is a TypeScript-based library that provides a resource-based API for interacting with AddPay's Cloud API. It focuses on Card Not Present (CNP) transactions and supports three main payment methods:

- **Checkout**: Hosted payment pages
- **DebiCheck**: South African debit order system
- **Token**: Card tokenization and token-based payments

## Architecture

### Project Structure

```
src/
├── client.ts              # Main SDK client
├── index.ts               # Public exports
├── lib/
│   └── http-client.ts     # HTTP client with signature handling
├── resources/
│   ├── checkout.ts        # Checkout resource and builder
│   ├── debicheck.ts       # DebiCheck resource and builders
│   └── token.ts           # Token resource and builders
├── types/
│   ├── common.ts          # Shared types and errors
│   ├── checkout.ts        # Checkout-specific types
│   ├── debicheck.ts       # DebiCheck-specific types
│   ├── token.ts           # Token-specific types
│   └── index.ts           # Type exports
├── utils/
│   └── crypto.ts          # RSA signing and verification
└── tests/
    ├── client.test.ts     # Client tests
    ├── checkout.test.ts   # Checkout tests
    └── crypto.test.ts     # Crypto utility tests
```

### Key Design Principles

1. **Resource-Based Architecture**: Each payment method is implemented as a separate resource class
2. **Fluent Builders**: Complex requests can be built using fluent APIs for better developer experience
3. **Type Safety**: Comprehensive TypeScript types for all API interactions
4. **Security First**: RSA signature generation and verification for all API calls
5. **Error Handling**: Structured error handling with custom error classes

## API Endpoints

Based on the AddPay Cloud API documentation:

### Base URLs
- Production: `https://api.paycloud.africa`
- Sandbox: `http://gw.wisepaycloud.com`

### Endpoints

#### Checkout
- `POST /api/entry/checkout` - Create checkout session
- `POST /api/entry/checkout/status` - Get checkout status
- `POST /api/entry/checkout/cancel` - Cancel checkout
- `POST /api/entry/checkout/refund` - Refund transaction

#### DebiCheck
- `POST /api/entry/debicheck/mandate` - Create mandate
- `POST /api/entry/debicheck/collect` - Initiate collection
- `POST /api/entry/debicheck/status` - Get mandate status
- `POST /api/entry/debicheck/mandate/cancel` - Cancel mandate

#### Token
- `POST /api/entry/token/create` - Tokenize card
- `POST /api/entry/token/pay` - Pay with token
- `POST /api/entry/token/delete` - Delete token
- `POST /api/entry/token/list` - List customer tokens
- `POST /api/entry/token/get` - Get token details

## Authentication & Security

### RSA Signature Process

All API requests are signed using RSA-SHA256:

1. **Build signature string**: Sort parameters alphabetically, exclude empty values and `sign` parameter
2. **Sign**: Use RSA private key to sign the string
3. **Send**: Include signature in request body as `sign` parameter
4. **Verify response**: Validate response signature using gateway public key

### Test Credentials

```typescript
const testConfig = {
  appId: 'wz715fc0d10ee9d156',
  merchantNo: '302100085224',
  storeNo: '4021000637',
  baseUrl: 'http://gw.wisepaycloud.com',
  // Use your own test keys here
};
```

## Development Commands

### Setup
```bash
pnpm install              # Install dependencies
```

### Development
```bash
pnpm dev                  # Build in watch mode
pnpm build                # Build for production
pnpm typecheck            # Run TypeScript checks
```

### Testing
```bash
pnpm test                 # Run tests
pnpm test:watch           # Run tests in watch mode
pnpm test:coverage        # Run with coverage report
```

### Linting
```bash
pnpm lint                 # Run ESLint
```

## Testing Strategy

### Unit Tests
- **HTTP Client**: Mock fetch calls, test signature generation
- **Resources**: Mock HTTP client, test request building and response handling
- **Builders**: Test fluent API and validation
- **Crypto Utils**: Test RSA operations with real key pairs

### Test Structure
```typescript
describe('ResourceName', () => {
  describe('methodName', () => {
    it('should handle success case', async () => {
      // Test implementation
    });
    
    it('should handle error case', async () => {
      // Test error handling
    });
  });
});
```

## Common Development Tasks

### Adding a New Endpoint

1. **Add types** in appropriate type file:
```typescript
export interface NewRequest {
  field1: string;
  field2: number;
}

export interface NewResponse {
  result: string;
}
```

2. **Add method to resource**:
```typescript
async newMethod(request: NewRequest): Promise<NewResponse> {
  const response = await this.client.request<NewResponse>(
    '/api/entry/new-endpoint',
    'POST',
    request
  );
  
  if (!response.data) {
    throw new Error('No data returned');
  }
  
  return response.data;
}
```

3. **Add builder if complex**:
```typescript
createNewBuilder() {
  return new NewBuilder(this);
}
```

4. **Add tests**:
```typescript
describe('newMethod', () => {
  it('should call correct endpoint', async () => {
    // Test implementation
  });
});
```

### Updating Error Handling

Custom errors extend `AddPayError`:

```typescript
export class AddPayError extends Error {
  public code: string;
  public details?: any;
  public timestamp?: number;

  constructor(code: string, message: string, details?: any) {
    super(message);
    this.name = 'AddPayError';
    this.code = code;
    this.details = details;
    this.timestamp = Date.now();
  }
}
```

Error codes:
- `HTTP_ERROR`: HTTP-level errors
- `INVALID_SIGNATURE`: Signature verification failed
- `TIMEOUT`: Request timeout
- `NETWORK_ERROR`: Network-related errors

### Adding Builder Patterns

Builders provide fluent APIs for complex requests:

```typescript
export class NewBuilder {
  private request: Partial<NewRequest> = {};

  constructor(private resource: ResourceClass) {}

  field1(value: string): this {
    this.request.field1 = value;
    return this;
  }

  async execute(): Promise<NewResponse> {
    this.validate();
    return this.resource.newMethod(this.request as NewRequest);
  }

  private validate(): void {
    // Validation logic
  }
}
```

## Configuration Management

### Environment Variables
The SDK supports configuration via environment variables:

```bash
ADDPAY_APP_ID=wz715fc0d10ee9d156
ADDPAY_MERCHANT_NO=302100085224
ADDPAY_STORE_NO=4021000637
ADDPAY_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----..."
ADDPAY_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----..."
ADDPAY_GATEWAY_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----..."
```

### Configuration Object
```typescript
interface ApiConfig {
  appId: string;
  merchantNo: string;
  storeNo: string;
  privateKey: string;
  publicKey: string;
  gatewayPublicKey: string;
  baseUrl?: string;
  timeout?: number;
  sandbox?: boolean;
}
```

## Build & Release Process

### Build Configuration
- **tsup**: Used for building ESM and CJS outputs
- **TypeScript**: Strict mode with comprehensive type checking
- **Target**: ES2022 for modern Node.js environments

### Package.json Scripts
- `build`: Production build
- `dev`: Development build with watch mode
- `prepublishOnly`: Ensures build before publish

### Release Checklist
1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Run full test suite
4. Build and verify outputs
5. Create git tag
6. Publish to npm

## Debugging & Troubleshooting

### Common Issues

1. **Signature Verification Failed**
   - Check private key format (PKCS8 vs PKCS1)
   - Verify parameter sorting and encoding
   - Ensure timestamp and nonce are included

2. **HTTP Errors**
   - Verify endpoint URLs
   - Check request format and required fields
   - Validate merchant credentials

3. **Type Errors**
   - Update type definitions if API changes
   - Check optional vs required fields

### Debugging Tips

```typescript
// Enable request logging
const client = new AddPayClient({
  ...config,
  // Add custom fetch with logging
});

// Log signature strings for debugging
console.log('Signature string:', CryptoUtils.buildSignatureString(params));
```

## Contributing Guidelines

### Code Style
- Use TypeScript strict mode
- Follow existing naming conventions
- Add JSDoc comments for public APIs
- Write tests for new functionality

### Pull Request Process
1. Create feature branch from `main`
2. Implement changes with tests
3. Ensure all tests pass
4. Update documentation if needed
5. Submit PR with clear description

### Git Commit Messages
- Use conventional commit format
- Examples:
  - `feat: add webhook validation helper`
  - `fix: handle network timeout errors`
  - `docs: update API examples`

## Performance Considerations

### Request Optimization
- Batch related operations when possible
- Use appropriate timeout values
- Implement retry logic for transient failures

### Memory Usage
- Avoid storing sensitive data in memory
- Clean up resources after use
- Use streaming for large responses

## Security Best Practices

### Key Management
- Never commit private keys to version control
- Use environment variables or secure key stores
- Rotate keys regularly

### Data Handling
- Never log sensitive card data
- Validate all input parameters
- Use HTTPS for all webhook URLs

### Error Handling
- Don't expose internal errors to external users
- Log security-relevant events
- Implement rate limiting where appropriate

## Maintenance & Updates

### Dependency Management
- Keep dependencies up to date
- Monitor for security vulnerabilities
- Test thoroughly after updates

### API Version Management
- Monitor AddPay API changes
- Maintain backward compatibility where possible
- Document breaking changes clearly

This SDK is designed to be maintainable, secure, and developer-friendly. Follow these guidelines to ensure consistent quality and functionality.