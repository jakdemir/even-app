# Sentry Setup Instructions

Since Sentry wizard requires interactive input, please complete the setup manually:

## Option 1: Use Sentry Wizard (Recommended)

Run the wizard and follow the prompts:
```bash
npx @sentry/wizard@latest -i nextjs
```

When prompted:
1. **Continue with uncommitted files?** → Yes
2. **Sentry SaaS or self-hosted?** → Sentry SaaS (sentry.io)
3. **Login to Sentry** → Follow the browser login flow
4. **Select/Create Project** → Create new project or select "Even"
5. **Configure source maps?** → Yes

The wizard will:
- Create `sentry.client.config.ts`
- Create `sentry.server.config.ts`
- Create `sentry.edge.config.ts`
- Update `next.config.ts`
- Add `SENTRY_DSN` to `.env.local`

## Option 2: Manual Setup

If you prefer manual setup:

### 1. Create Sentry Account
- Go to [sentry.io](https://sentry.io)
- Sign up or login
- Create new project → Select "Next.js"
- Copy your DSN

### 2. Add DSN to Environment
Add to `.env.local`:
```
SENTRY_DSN=your_sentry_dsn_here
SENTRY_AUTH_TOKEN=your_auth_token_here
```

### 3. Create Configuration Files

See implementation plan for full configuration file contents.

## After Setup

1. Test error tracking:
```typescript
// Add temporary button to test
<button onClick={() => { throw new Error('Test Sentry'); }}>
  Test Error
</button>
```

2. Check Sentry dashboard for the error
3. Remove test button
4. Deploy to production

## Managing Errors

- Dashboard: https://sentry.io
- View errors: Issues tab
- Set up alerts: Alerts → Create Alert
- Monitor performance: Performance tab

For detailed management instructions, see the implementation plan.
