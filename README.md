# AddPay JavaScript SDK

[![CI](https://github.com/yourusername/addpay-js/workflows/CI/badge.svg)](https://github.com/yourusername/addpay-js/actions/workflows/ci.yml)
[![Release](https://github.com/yourusername/addpay-js/workflows/Release/badge.svg)](https://github.com/yourusername/addpay-js/actions/workflows/release.yml)
[![npm version](https://badge.fury.io/js/%40addpay%2Fsdk.svg)](https://badge.fury.io/js/%40addpay%2Fsdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive TypeScript SDK for the AddPay Cloud API, designed for Card Not Present (CNP) payment processing in South Africa.

## Features

- 🚀 **Resource-based architecture** for clean, intuitive API interaction
- 🔧 **Fluent builders** for easy request construction
- 🔒 **RSA signature validation** for secure communications
- 📱 **CNP-focused** payment processing
- 🧪 **Comprehensive test coverage** with Vitest
- 📖 **Full TypeScript support** with detailed type definitions
- 🌐 **Built-in fetch** - no external HTTP dependencies

## Supported Payment Methods

- **Hosted Checkout** - Redirect customers to AddPay's secure payment page
- **DebiCheck** - South African debit order system with mandate management
- **Tokenization** - Secure card tokenization for recurring payments

## Installation

```bash
pnpm add @addpay/sdk
# or
npm install @addpay/sdk
# or
yarn add @addpay/sdk
```

## Quick Start

### 1. Initialize the Client

```typescript
import { AddPayClient } from '@addpay/sdk';

// Production configuration
const client = AddPayClient.create({
  appId: 'your-app-id',
  merchantNo: 'your-merchant-number',
  storeNo: 'your-store-number',
  privateKey: 'your-rsa-private-key',
  publicKey: 'your-rsa-public-key',
  gatewayPublicKey: 'gateway-public-key',
  sandbox: false
});

// For testing, use your test credentials
```

### 2. Create a Hosted Checkout

```typescript
// Standard API approach
const checkout = await client.checkout.create({
  merchant_order_no: 'ORDER-12345',
  order_amount: '100.00',
  price_currency: 'ZAR',
  notify_url: 'https://yoursite.com/webhook',
  return_url: 'https://yoursite.com/success',
  description: 'Product purchase'
});

console.log('Checkout URL:', checkout.pay_url);

// Fluent builder approach
const checkout2 = await client.checkout
  .createCheckout()
  .merchantOrderNo('ORDER-12346')
  .amount('250.00')
  .currency('ZAR')
  .notifyUrl('https://yoursite.com/webhook')
  .returnUrl('https://yoursite.com/success')
  .description('Subscription payment')
  .customerInfo({
    customer_email: 'customer@example.com',
    customer_phone: '+27123456789'
  })
  .execute();
```

## Comprehensive Examples

### Hosted Checkout Flow

```typescript
import { AddPayClient, CheckoutRequest } from '@addpay/sdk';

const client = AddPayClient.create({ /* your config */ });

async function processCheckout() {
  try {
    // Create checkout session
    const checkout = await client.checkout
      .createCheckout()
      .merchantOrderNo(`ORDER-${Date.now()}`)
      .amount('199.99')
      .currency('ZAR')
      .notifyUrl('https://api.yoursite.com/addpay/webhook')
      .returnUrl('https://yoursite.com/payment/success')
      .description('Premium subscription')
      .goods([{
        goods_name: 'Premium Plan',
        goods_id: 'PLAN_PREMIUM',
        goods_quantity: 1,
        goods_price: '199.99'
      }])
      .customerInfo({
        customer_id: 'CUST001',
        customer_email: 'john@example.com',
        customer_phone: '+27823456789',
        customer_name: 'John Doe'
      })
      .sceneInfo({
        device_ip: '192.168.1.1'
      })
      .execute();

    console.log('Redirect user to:', checkout.pay_url);
    
    // Later, check payment status
    const status = await client.checkout.getStatus({
      merchant_order_no: checkout.merchant_order_no
    });
    
    if (status.trans_status === 2) { // Completed
      console.log('Payment successful!');
    }
    
  } catch (error) {
    console.error('Checkout failed:', error);
  }
}
```

### DebiCheck Mandate Management

```typescript
async function setupDebiCheckMandate() {
  try {
    // Create mandate
    const mandate = await client.debicheck
      .createMandateBuilder()
      .merchantOrderNo(`MANDATE-${Date.now()}`)
      .customer(customer => customer
        .id('CUST001')
        .name('John Doe')
        .email('john@example.com')
        .idNumber('8001015009087')
        .accountNumber('1234567890')
        .accountType('CURRENT')
        .bankName('Standard Bank')
        .branchCode('051001')
      )
      .mandate(mandate => mandate
        .type('RECURRING')
        .maxAmount('500.00')
        .currency('ZAR')
        .startDate('2024-01-01')
        .endDate('2024-12-31')
        .frequency('MONTHLY')
      )
      .notifyUrl('https://api.yoursite.com/debicheck/webhook')
      .returnUrl('https://yoursite.com/mandate/success')
      .execute();

    console.log('Mandate reference:', mandate.mandate_reference);
    console.log('Auth URL:', mandate.auth_url);

    // Once approved, collect payment
    if (mandate.mandate_status === 'APPROVED') {
      const collection = await client.debicheck.collect({
        mandate_reference: mandate.mandate_reference,
        merchant_order_no: `COLLECT-${Date.now()}`,
        collection_amount: '299.99',
        currency: 'ZAR',
        notify_url: 'https://api.yoursite.com/debicheck/collection-webhook'
      });
      
      console.log('Collection initiated:', collection);
    }

  } catch (error) {
    console.error('DebiCheck failed:', error);
  }
}
```

### Card Tokenization & Payment

```typescript
async function tokenizeAndPay() {
  try {
    // Tokenize card (typically done during initial setup)
    const tokenResponse = await client.token
      .createTokenization()
      .merchantOrderNo(`TOKEN-${Date.now()}`)
      .customer(customer => customer
        .id('CUST001')
        .email('john@example.com')
        .name('John Doe')
        .address(addr => addr
          .line1('123 Main Street')
          .city('Cape Town')
          .state('Western Cape')
          .postalCode('8001')
          .country('ZA')
        )
      )
      .verificationAmount('1.00')
      .currency('ZAR')
      .notifyUrl('https://api.yoursite.com/token/webhook')
      .execute();

    const token = tokenResponse.token;
    console.log('Card tokenized:', token);
    console.log('Masked card:', tokenResponse.card_info.masked_card_number);

    // Use token for payment
    const payment = await client.token
      .createPayment()
      .token(token)
      .merchantOrderNo(`PAY-${Date.now()}`)
      .amount('99.99')
      .currency('ZAR')
      .description('Recurring subscription payment')
      .notifyUrl('https://api.yoursite.com/token/payment-webhook')
      .execute();

    console.log('Payment processed:', payment);

    // List customer's tokens
    const tokens = await client.token.list({
      customer_id: 'CUST001',
      page: 1,
      limit: 10
    });

    console.log(`Customer has ${tokens.total} tokens`);

  } catch (error) {
    console.error('Tokenization failed:', error);
  }
}
```

### Advanced Configuration

```typescript
const client = AddPayClient.create({
  appId: 'wz715fc0d10ee9d156',
  merchantNo: '302100085224',
  storeNo: '4021000637',
  privateKey: process.env.ADDPAY_PRIVATE_KEY!,
  publicKey: process.env.ADDPAY_PUBLIC_KEY!,
  gatewayPublicKey: process.env.ADDPAY_GATEWAY_PUBLIC_KEY!,
  baseUrl: 'https://api.paycloud.africa',
  timeout: 30000,
  sandbox: process.env.NODE_ENV !== 'production'
});
```

### Error Handling

```typescript
import { AddPayError } from '@addpay/sdk';

try {
  const checkout = await client.checkout.create({
    merchant_order_no: 'ORDER001',
    order_amount: '100.00',
    price_currency: 'ZAR',
    notify_url: 'https://example.com/notify',
    return_url: 'https://example.com/return'
  });
} catch (error) {
  if (error instanceof AddPayError) {
    console.error('AddPay Error:', error.code, error.message);
    console.error('Details:', error.details);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### Webhook Handling

```typescript
import { CryptoUtils } from '@addpay/sdk';

function validateWebhook(body: any, signature: string, publicKey: string): boolean {
  const signString = CryptoUtils.buildSignatureString(body);
  return CryptoUtils.verifyWithRSA(signString, signature, publicKey);
}

// Express.js webhook endpoint
app.post('/webhook/addpay', (req, res) => {
  const signature = req.headers['x-signature'] as string;
  
  if (!validateWebhook(req.body, signature, gatewayPublicKey)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const { merchant_order_no, trans_status, order_no } = req.body;
  
  switch (trans_status) {
    case 2: // Completed
      console.log(`Payment ${order_no} completed for order ${merchant_order_no}`);
      // Update your database
      break;
    case 3: // Cancelled
      console.log(`Payment ${order_no} cancelled for order ${merchant_order_no}`);
      break;
    default:
      console.log(`Payment ${order_no} status: ${trans_status}`);
  }

  res.json({ status: 'ok' });
});
```

## Testing

The SDK includes comprehensive test coverage:

```bash
pnpm test              # Run tests once
pnpm test:watch        # Run tests in watch mode
pnpm test:coverage     # Run tests with coverage report
```

## TypeScript Support

The SDK is written in TypeScript and provides full type definitions:

```typescript
import type {
  CheckoutRequest,
  CheckoutResponse,
  DebiCheckMandateRequest,
  TokenizationRequest,
  ApiConfig
} from '@addpay/sdk';
```

## Configuration

### Environment Variables

```bash
ADDPAY_APP_ID=your-app-id
ADDPAY_MERCHANT_NO=your-merchant-number
ADDPAY_STORE_NO=your-store-number
ADDPAY_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
ADDPAY_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"
ADDPAY_GATEWAY_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"
```

### Test Credentials

For sandbox testing, use:

- App ID: `wz715fc0d10ee9d156`
- Merchant No: `302100085224`
- Store No: `4021000637`
- Endpoint: `http://gw.wisepaycloud.com`

## Best Practices

1. **Always validate webhooks** using the provided signature verification
2. **Use unique merchant order numbers** to avoid conflicts
3. **Implement proper error handling** for all API calls
4. **Store tokens securely** and never log sensitive card data
5. **Use HTTPS** for all webhook and return URLs
6. **Implement idempotency** for payment operations

## Contributing

This project uses automated releases with [semantic-release](https://semantic-release.gitbook.io/semantic-release/) and follows [Conventional Commits](https://www.conventionalcommits.org/).

### Quick Start

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make your changes with conventional commit messages:
   - `feat: add new feature` (minor version bump)
   - `fix: resolve bug` (patch version bump)
   - `feat!: breaking change` (major version bump)
4. Add tests for new functionality
5. Run the test suite: `pnpm test`
6. Submit a pull request

### Commit Format

```bash
git commit -m "feat: add webhook validation helper"
git commit -m "fix: handle network timeout errors"
git commit -m "docs: update API examples"
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## License

MIT

## Support

- 📖 [Official AddPay Documentation](https://developers.paycloud.africa/docs/addpay/CloudAPI/addpay-open-api-en)
- 🐛 [Report Issues](https://github.com/checkoutjoy/addpay-js/issues)
- 💬 [Discussions](https://github.com/checkoutjoy/addpay-js/discussions)

## Author

Created by [CheckoutJoy](https://checkoutjoy.com) - Advanced, Localized Checkouts for Course Creators

---

Built with ❤️ for the South African payment ecosystem.
