# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in the AddPay JavaScript SDK, please report it privately to help us address it responsibly.

### How to Report

1. **Email**: Send details to [security@yourcompany.com] (replace with actual email)
2. **GitHub**: Use the private vulnerability reporting feature on GitHub
3. **Include**: 
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment**: We'll acknowledge receipt within 48 hours
- **Assessment**: We'll assess the vulnerability within 5 business days
- **Updates**: We'll provide regular updates on our progress
- **Resolution**: We'll work to resolve critical issues within 30 days

### Security Best Practices

When using this SDK:

1. **Never commit credentials** to version control
2. **Use environment variables** for sensitive configuration
3. **Validate webhook signatures** before processing
4. **Use HTTPS** for all webhook and return URLs
5. **Keep the SDK updated** to the latest version
6. **Implement proper error handling** to avoid information leakage
7. **Store tokens securely** and never log sensitive data

### Responsible Disclosure

We practice responsible disclosure and ask that security researchers:

- Give us reasonable time to fix vulnerabilities before public disclosure
- Avoid accessing or modifying data that doesn't belong to you
- Don't perform testing that could harm our services or users
- Don't use vulnerabilities for personal gain

### Recognition

We appreciate security researchers who help keep our project safe. With your permission, we'll acknowledge your contribution in our security advisories and release notes.

## Security Features

This SDK includes several security features:

- **RSA Signature Verification**: All API communications are cryptographically signed
- **Request Validation**: Input validation and sanitization
- **Error Handling**: Structured error responses without sensitive data leakage
- **Secure Defaults**: HTTPS by default, secure configuration options
- **No Sensitive Logging**: Card data and keys are never logged

## Dependencies

We regularly audit our dependencies for security vulnerabilities using:

- GitHub Dependabot
- npm audit
- Snyk scanning

Automated updates are applied for non-breaking security fixes.