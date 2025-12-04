# Quick Logging Test

To verify logging is working, open your browser console and you should see:

## Client-Side Logs (Browser Console)
- `🎯 User Action: ...` - User interactions
- `🌐 API Call: ...` - HTTP requests  
- `✅ API Response: ...` - HTTP responses
- `💾 DB Query: ...` - Database operations
- `[INFO]`, `[DEBUG]`, `[ERROR]` - General logs

## Server-Side Logs (Terminal)
- `[PROXY] Incoming request ...` - All HTTP requests
- `[PROXY] Request completed ...` - Request timing
- `[API] GET/POST /api/... - Request received` - API endpoints
- `[API] ... - Success/Error` - API results

## Test It Now:

1. **Open browser console** (F12 or Cmd+Option+I)
2. **Click "Sign in with Wallet"** 
3. **You should see:**
   ```
   🎯 User Action: Wallet Auth Started
   🌐 API Call: GET /api/nonce
   [INFO] Nonce received { nonceLength: 32 }
   🌐 API Call: POST /api/complete-siwe
   ✅ API Response: /api/complete-siwe (200) { isValid: true }
   🎯 User Action: Login Successful { address: "0x...", username: "..." }
   ```

4. **In terminal, you should see:**
   ```
   [PROXY] Incoming request { method: 'GET', pathname: '/api/nonce' }
   [API] GET /api/nonce - Request received
   [API] Nonce generated { nonceLength: 32 }
   [API] GET /api/nonce - Success
   [PROXY] Request completed { duration: '15ms' }
   ```

## If You Don't See Logs:

**Browser Console:**
- Make sure console is open (F12)
- Check filter settings (should show all levels)
- Look for `[INFO]`, `[DEBUG]` tags

**Terminal:**
- Server logs appear automatically
- Look for `[PROXY]` and `[API]` tags

**Enable Verbose Mode:**
Already enabled in `.env.local`:
```
NEXT_PUBLIC_VERBOSE_LOGGING=true
```

## Current Status:

✅ API routes logging (nonce, complete-siwe)
✅ Proxy logging (all requests)
✅ AuthButton logging (wallet auth flow)
⏳ ExpenseContext logging (in progress)
⏳ Other components logging (pending)

The logging is working! You should see detailed logs for:
- Every HTTP request
- Wallet authentication flow
- API calls and responses
