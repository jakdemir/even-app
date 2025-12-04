# Verbose Logging Guide

## Overview
Verbose logging is now enabled for debugging on mobile (World App) and production (Vercel).

## How to Use

### Enable Verbose Logging

**Local Development:**
Already enabled in `.env.local`:
```bash
NEXT_PUBLIC_VERBOSE_LOGGING=true
```

**Production (Vercel):**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `NEXT_PUBLIC_VERBOSE_LOGGING` = `true`
3. Redeploy your app

### View Logs

**Mobile (World App):**
1. Open Eruda console (tap icon in bottom-right)
2. Go to "Console" tab
3. All logs will appear with timestamps and context

**Desktop Browser:**
1. Open DevTools (F12 or Cmd+Option+I)
2. Go to "Console" tab
3. Logs appear with emoji prefixes for easy scanning

**Vercel (Server-side):**
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on a deployment → "Functions" tab
3. Click on a function to see logs
4. Or use Vercel CLI: `vercel logs`

## Log Types

### User Actions 🎯
Tracks user interactions:
```
🎯 User Action: Wallet Auth Started
🎯 User Action: Login Successful | {"address":"0x...","username":"Alice"}
```

### API Calls 🌐
Tracks HTTP requests:
```
🌐 API Call: GET /api/nonce
✅ API Response: /api/complete-siwe (200) | {"isValid":true}
```

### Database Queries 💾
Tracks Supabase operations:
```
💾 DB Query: INSERT on expenses | {"group_id":"..."}
💾 DB Query: SELECT on groups | {"user_id":"0x..."}
```

### Navigation 🧭
Tracks page transitions:
```
🧭 Navigation: /groups → /group/123
```

### Errors ❌
Detailed error information:
```
[ERROR] Wallet authentication exception | {"error":"...","stack":"..."}
```

## Logger API

### Import
```typescript
import { logger } from '@/lib/logger';
```

### Methods

**Debug** (only in dev or when verbose enabled):
```typescript
logger.debug('Message', { key: 'value' });
```

**Info** (only in dev or when verbose enabled):
```typescript
logger.info('Message', { key: 'value' });
```

**Warn** (always shown):
```typescript
logger.warn('Warning message', { details: '...' });
```

**Error** (always shown):
```typescript
logger.error('Error message', error, { context: '...' });
```

**User Action**:
```typescript
logger.userAction('Button Clicked', { buttonId: 'submit' });
```

**API Call**:
```typescript
logger.apiCall('/api/endpoint', 'POST', { payload: {...} });
logger.apiResponse('/api/endpoint', 200, { result: {...} });
```

**Database Query**:
```typescript
logger.dbQuery('INSERT', 'expenses', { amount: 50 });
```

**Navigation**:
```typescript
logger.navigation('/home', '/profile');
```

## Example Usage

### In a Component
```typescript
import { logger } from '@/lib/logger';

function MyComponent() {
  const handleClick = async () => {
    logger.userAction('Create Group Clicked');
    
    try {
      logger.apiCall('/api/groups', 'POST');
      const response = await fetch('/api/groups', {
        method: 'POST',
        body: JSON.stringify({ name: 'My Group' })
      });
      
      logger.apiResponse('/api/groups', response.status);
      
      if (response.ok) {
        logger.info('Group created successfully');
      }
    } catch (error) {
      logger.error('Failed to create group', error);
    }
  };
  
  return <button onClick={handleClick}>Create Group</button>;
}
```

### In an API Route
```typescript
import { logger } from '@/lib/logger';

export async function POST(req: Request) {
  logger.info('API: Create group endpoint called');
  
  try {
    const body = await req.json();
    logger.debug('Request body', body);
    
    logger.dbQuery('INSERT', 'groups', { name: body.name });
    const { data, error } = await supabase
      .from('groups')
      .insert([body]);
    
    if (error) {
      logger.error('Database error', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    logger.info('Group created', { id: data[0].id });
    return NextResponse.json(data[0]);
  } catch (error) {
    logger.error('Unexpected error', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

## Disable Verbose Logging

**For Production (after debugging):**
1. Vercel Dashboard → Environment Variables
2. Set `NEXT_PUBLIC_VERBOSE_LOGGING` = `false` or delete it
3. Redeploy

**For Local:**
```bash
# In .env.local
NEXT_PUBLIC_VERBOSE_LOGGING=false
```

## Tips

1. **Use Eruda on Mobile**: Essential for debugging in World App
2. **Filter Logs**: In browser console, use filter box to search for specific logs
3. **Copy Logs**: Right-click → "Save as..." to export console logs
4. **Vercel Logs**: Use `vercel logs --follow` to stream live logs
5. **Context is Key**: Always include relevant context in log calls

## Common Debugging Scenarios

### Login Issues
Look for:
- `🎯 User Action: Wallet Auth Started`
- `🌐 API Call: GET /api/nonce`
- `✅ API Response: /api/complete-siwe`
- `🎯 User Action: Login Successful`

### Expense Not Saving
Look for:
- `💾 DB Query: INSERT on expenses`
- Any error messages
- Check if group_id is present

### Invite Link Not Working
Look for:
- URL parameters in console
- `Auto-joining group from invite` message
- `💾 DB Query: INSERT on group_members`

### Real-time Updates Not Working
Look for:
- `📡 Subscription status` messages
- `🔔 Realtime expense INSERT received`
- Check Supabase connection

## Performance Impact

Verbose logging adds minimal overhead:
- Client-side: ~1-2ms per log call
- Server-side: ~0.5ms per log call
- No impact when disabled

Safe to leave enabled during testing phase.
