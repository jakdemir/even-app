# Deploying to Vercel

## 1. Push to GitHub
Make sure your project is pushed to a GitHub repository.

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

## 2. Create Vercel Project
1. Go to [vercel.com/new](https://vercel.com/new).
2. Import your GitHub repository (`even-app`).
3. In the **Configure Project** screen:
   - **Framework Preset**: Next.js (should be auto-detected).
   - **Root Directory**: `./` (default).

## 3. Environment Variables
Expand the **Environment Variables** section and add the keys from your `.env.local`:

| Key | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `your_project_url` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your_anon_key` |
| `NEXT_PUBLIC_APP_ID` | `app_...` (Your World App ID) |

## 4. Deploy
Click **Deploy**. Vercel will build your app and provide a production URL (e.g., `https://even-app.vercel.app`).

## 5. Update World App Developer Portal
1. Go to the [World App Developer Portal](https://developer.worldcoin.org).
2. Select your app.
3. Update the **App URL** to your new Vercel URL.
4. Ensure your Vercel domain is in the **Allowed Origins** list if applicable.
