# Server Logging Summary

## What's Been Added

### 1. API Route Logging

**`/api/nonce`** - Nonce Generation
- ✅ Request received
- ✅ Nonce generated (with length)
- ✅ Cookie storage confirmation
- ✅ Success/error status
- ✅ Error details if failed

**`/api/complete-siwe`** - SIWE Verification
- ✅ Request received
- ✅ Payload validation (has payload, nonce, status, address)
- ✅ Nonce verification (match status)
- ✅ SIWE signature verification
- ✅ Cookie cleanup confirmation
- ✅ Success with address
- ✅ Error details with stack trace

### 2. Request Middleware

**All Routes** (except static files)
- ✅ Logs every incoming request
- ✅ Method, URL, pathname, timestamp
- ✅ Request duration in milliseconds
- ✅ Completion status

### 3. Client-Side Logging

**AuthButton Component**
- ✅ User action: Wallet auth started
- ✅ API calls to /api/nonce and /api/complete-siwe
- ✅ Nonce received confirmation
- ✅ MiniKit wallet auth call
- ✅ Response status and address presence
- ✅ Verification result
- ✅ Login success with address and username
- ✅ All errors with context

## How to View Logs

### Development (Local)
```bash
npm run dev
```
All logs appear in terminal and browser console.

### Production (Vercel)

**Real-time logs:**
```bash
vercel logs --follow
```

**Dashboard:**
1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments"
4. Click on a deployment
5. Go to "Functions" tab
6. Click on any function to see logs

### Mobile (World App)
1. Open Eruda console (tap icon)
2. Go to "Console" tab
3. All client-side logs visible
4. Server logs visible in Vercel

## Log Format

All logs follow this format:
```
[CONTEXT] Action - Details
```

Examples:
```
[API] GET /api/nonce - Request received
[API] Nonce generated { nonceLength: 32 }
[API] GET /api/nonce - Success
[MIDDLEWARE] Incoming request { method: 'GET', pathname: '/api/nonce' }
[MIDDLEWARE] Request completed { pathname: '/api/nonce', duration: '15ms' }
```

## Common Log Patterns

### Successful Login Flow
```
[MIDDLEWARE] Incoming request { pathname: '/api/nonce' }
[API] GET /api/nonce - Request received
[API] Nonce generated { nonceLength: 32 }
[API] Nonce stored in cookie with 5min expiry
[API] GET /api/nonce - Success
[MIDDLEWARE] Request completed { duration: '12ms' }

[MIDDLEWARE] Incoming request { pathname: '/api/complete-siwe' }
[API] POST /api/complete-siwe - Request received
[API] Request payload received { hasPayload: true, hasNonce: true, payloadStatus: 'success' }
[API] Nonce verification { hasStoredNonce: true, nonceMatch: true }
[API] Verifying SIWE message signature...
[API] SIWE verification result { isValid: true }
[API] Nonce cleared from cookie
[API] POST /api/complete-siwe - Success { address: '0x...' }
[MIDDLEWARE] Request completed { duration: '234ms' }
```

### Failed Login (Invalid Nonce)
```
[API] POST /api/complete-siwe - Request received
[API] Request payload received { hasPayload: true, hasNonce: true }
[API] Nonce verification { hasStoredNonce: false, nonceMatch: false }
[API] Nonce mismatch - Invalid or expired
```

### Error Case
```
[API] POST /api/complete-siwe - Error: { message: '...', stack: '...' }
```

## Debugging Tips

1. **Search for errors**: Filter logs by `[ERROR]` or `Error:`
2. **Track user flow**: Search by user's address
3. **Performance issues**: Look for high `duration` values
4. **API failures**: Check for non-200 status codes
5. **Missing data**: Look for `has*: false` in logs

## Disable Logging

To reduce noise in production after debugging:

1. Remove `console.log` calls from API routes
2. Comment out middleware logging
3. Set `NEXT_PUBLIC_VERBOSE_LOGGING=false`

Or keep it enabled - minimal performance impact!
