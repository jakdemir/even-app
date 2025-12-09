This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Group Invite Links

### Sharing Groups via Invite Links

Even supports group invitations through URL parameters and Worldcoin backlinks, allowing users to join groups seamlessly.

#### URL Format

**Web URL:**
```
https://your-app-url.com/?invite=GROUP_ID
```

**Worldcoin Backlink:**
```
worldcoin://even?invite=GROUP_ID
```

#### How It Works

1. **Generate Invite Link**: When viewing a group, click the share button to copy the invite link
2. **Share**: Send the link to friends via any messaging platform
3. **Join**: Recipients open the link, log in if needed, and are automatically joined to the group

#### Technical Details

- Invite links work before and after authentication
- The `invite` parameter is stored in localStorage until the user logs in
- Once authenticated, users are automatically joined to the pending group
- The URL is cleaned up after the invite parameter is processed
- Backlinks open directly in the World App for a seamless experience

#### Example Usage

```javascript
// Get current group ID from URL
const groupId = "abc123-def456-ghi789";

// Create shareable link
const inviteUrl = `${window.location.origin}/?invite=${groupId}`;

// Or create Worldcoin backlink
const backlink = `worldcoin://even?invite=${groupId}`;
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
