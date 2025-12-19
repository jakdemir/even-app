# Even App - Dependencies & Services

## External Services & APIs

### 1. Supabase (Database)
- **Purpose**: PostgreSQL database for storing groups, expenses, feedback
- **Dashboard**: https://supabase.com/dashboard/project/ispqajqvdrjxdpbnmjht
- **Project**: `ispqajqvdrjxdpbnmjht`
- **Environment Variables**:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- **Tables**: `groups`, `group_members`, `expenses`, `feedback`

### 2. GitHub (Version Control)
- **Repository**: https://github.com/jakdemir/even-app
- **Branch**: `main`
- **Auto-Deploy**: Connected to Vercel

### 3. Resend (Email Notifications)
- **Purpose**: Send email notifications for user feedback
- **Dashboard**: https://resend.com/dashboard
- **Environment Variables**:
  - `RESEND_API_KEY`
- **From Email**: `feedback@even-app.com`
- **To Email**: `support@even-app.com`
- **Free Tier**: 100 emails/day, 3,000/month

### 4. Sentry (Error Monitoring)
- **Purpose**: Track errors, performance, session replays
- **Dashboard**: https://sentry.io/organizations/even-pj/projects/javascript-nextjs/
- **Organization**: `even-pj`
- **Project**: `javascript-nextjs`
- **Environment Variables**:
  - `SENTRY_AUTH_TOKEN` (for CI/CD source maps)
  - `SENTRY_DSN` (auto-configured)
- **Features**: Error tracking, performance monitoring, session replay, logs
- **Free Tier**: 5,000 errors/month

### 5. CoinGecko (WLD Price API)
- **Purpose**: Real-time USD to WLD conversion for payments
- **API**: https://api.coingecko.com/api/v3/simple/price?ids=worldcoin-wld&vs_currencies=usd
- **Caching**: 5-minute cache to avoid rate limits
- **No API Key Required**: Free tier
- **Fallback**: Transaction fails if API unavailable (no fallback price for safety)

### 6. Worldcoin (Authentication & Payments)
- **Purpose**: Wallet authentication and WLD payments
- **MiniKit**: `@worldcoin/minikit-js`
- **Environment Variables**:
  - `NEXT_PUBLIC_APP_ID`
- **App ID**: `app_facb91a29b7d7d6358e825f9ed666f0f`

### 7. Vercel (Hosting & Deployment)
- **Purpose**: Next.js hosting and automatic deployments
- **Dashboard**: https://vercel.com/dashboard
- **Domain**: https://even-app.com
- **Auto-Deploy**: Triggered on push to `main` branch

---

## Quick Links

| Service | Dashboard | Documentation |
|---------|-----------|---------------|
| Supabase | [Dashboard](https://supabase.com/dashboard/project/ispqajqvdrjxdpbnmjht) | [Docs](https://supabase.com/docs) |
| Resend | [Dashboard](https://resend.com/dashboard) | [Docs](https://resend.com/docs) |
| Sentry | [Dashboard](https://sentry.io/organizations/even-pj/projects/javascript-nextjs/) | [Docs](https://docs.sentry.io) |
| CoinGecko | [API](https://www.coingecko.com/en/api) | [Docs](https://docs.coingecko.com) |
| Vercel | [Dashboard](https://vercel.com/dashboard) | [Docs](https://vercel.com/docs) |
| Worldcoin | [Developer Portal](https://developer.worldcoin.org) | [Docs](https://docs.world.org) |

---

## Environment Variables Checklist

### Local (.env.local)
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `NEXT_PUBLIC_APP_ID`
- ✅ `RESEND_API_KEY`
- ✅ `NEXT_PUBLIC_VERBOSE_LOGGING`

### Vercel (Production)
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `NEXT_PUBLIC_APP_ID`
- [ ] `RESEND_API_KEY`
- [ ] `SENTRY_AUTH_TOKEN`

---

## Cost Summary

| Service | Current Plan | Monthly Cost | Limits |
|---------|-------------|--------------|--------|
| Supabase | Free | $0 | 500MB database, 2GB bandwidth |
| Resend | Free | $0 | 3,000 emails/month |
| Sentry | Free | $0 | 5,000 errors/month |
| CoinGecko | Free | $0 | Rate limited (cached 5min) |
| Vercel | Hobby | $0 | 100GB bandwidth |
| **Total** | | **$0/month** | |

---

## Monitoring & Alerts

### Sentry Alerts
- Set up alerts for critical errors
- Monitor error trends
- Review session replays for UX issues

### Feedback Review
- Check Supabase `feedback` table weekly
- Respond to user emails
- Track bug reports vs feature requests

### API Health
- Monitor CoinGecko API uptime
- Check Resend delivery rates
- Review Supabase performance metrics

---

## Backup & Recovery

### Database Backups
- Supabase: Automatic daily backups (7-day retention on free tier)
- Manual export: Use Supabase dashboard → Database → Backups

### Code Backups
- GitHub: Full version history
- Vercel: Deployment history with rollback capability

---

## Support Contacts

- **Supabase Support**: support@supabase.io
- **Resend Support**: support@resend.com
- **Sentry Support**: https://sentry.io/support/
- **Vercel Support**: https://vercel.com/support
- **Even App Support**: support@even-app.com
