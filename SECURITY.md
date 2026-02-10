# Security Guidelines

## Recommended Security Headers

For production deployment, implement the following HTTP security headers:

### Content Security Policy (CSP)
```
Content-Security-Policy: default-src 'self'; 
    script-src 'self' https://aframe.io https://cdn.jsdelivr.net 'unsafe-inline'; 
    style-src 'self' 'unsafe-inline'; 
    img-src 'self' data: https:; 
    connect-src 'self';
    frame-ancestors 'none';
```

### X-Frame-Options
```
X-Frame-Options: DENY
```

### X-Content-Type-Options
```
X-Content-Type-Options: nosniff
```

### X-XSS-Protection
```
X-XSS-Protection: 1; mode=block
```

### Referrer-Policy
```
Referrer-Policy: strict-origin-when-cross-origin
```

### Permissions-Policy
```
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## Implementation

### Apache (.htaccess)
```apache
<IfModule mod_headers.c>
    Header set Content-Security-Policy "default-src 'self'; script-src 'self' https://aframe.io https://cdn.jsdelivr.net 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;"
    Header set X-Frame-Options "DENY"
    Header set X-Content-Type-Options "nosniff"
    Header set X-XSS-Protection "1; mode=block"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
    Header set Permissions-Policy "geolocation=(), microphone=(), camera=()"
</IfModule>
```

### Nginx
```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' https://aframe.io https://cdn.jsdelivr.net 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
```

## Security Best Practices Implemented

### 1. Input Validation
- All form inputs are validated before processing
- French postal code format validation (5 digits)
- French phone number format validation
- Name, address, and city length validation
- Pattern matching for data integrity

### 2. XSS Prevention
- All user inputs are sanitized using `sanitizeHTML()` function
- HTML special characters are escaped
- Content is safely inserted into DOM

### 3. Data Storage Security
- LocalStorage is used only for non-sensitive data
- No sensitive information (passwords, payment data) is stored
- Cart data expires after 7 days
- Error handling for storage operations

### 4. Client-Side Validation
- Form validation before submission
- Error messages displayed to users
- Quantity limits enforced (1-99 items)
- Input type validation

## Future Enhancements for Production

### Backend Integration
When implementing a backend API, ensure:

1. **Server-side validation**: Never trust client-side validation alone
2. **HTTPS only**: Use TLS/SSL certificates
3. **CSRF protection**: Implement CSRF tokens
4. **Rate limiting**: Prevent abuse
5. **Authentication**: Implement secure user authentication
6. **Session management**: Secure session handling
7. **SQL injection prevention**: Use parameterized queries
8. **API authentication**: Use API keys or OAuth

### Payment Security
If implementing payment processing:
- Never store credit card information
- Use PCI-DSS compliant payment providers (Stripe, PayPal)
- Implement 3D Secure authentication
- Use tokenization for card data

### Data Privacy
- Implement GDPR compliance
- Add privacy policy and terms of service
- Provide data deletion mechanisms
- Implement cookie consent
- Encrypt personal data

## Vulnerability Reporting

If you discover a security vulnerability, please report it responsibly:

**Note:** The email address below is a placeholder. For production deployment, configure a real security contact email.

- Email: security@vr-store.com (configure before production)
- Or create a private security advisory on GitHub

Please do not publicly disclose security issues until they have been addressed.
