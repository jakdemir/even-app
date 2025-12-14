# Pre-Launch Checklist for World Store Submission

## 🧪 Testing & Quality Assurance

### Functional Testing
- [ ] **Test all user flows end-to-end**
  - [ ] Login with wallet authentication
  - [ ] Create a group
  - [ ] Add expenses (various amounts)
  - [ ] Split expenses equally among participants
  - [ ] Record payments
  - [ ] Settle up debts
  - [ ] Join group via invite link
  - [ ] Leave group
  - [ ] Logout and re-login (persistent login)

- [ ] **Test edge cases**
  - [ ] What happens with $0.00 expenses?
  - [ ] Very large amounts (e.g., $999,999.99)
  - [ ] Special characters in expense descriptions
  - [ ] Very long group names
  - [ ] Single-person groups
  - [ ] Groups with 10+ members

- [ ] **Test error scenarios**
  - [ ] Network offline/poor connection
  - [ ] Database errors (simulate by stopping Supabase)
  - [ ] Invalid invite links
  - [ ] Concurrent edits from multiple users

### Cross-Device Testing
- [ ] Test on iOS (iPhone)
- [ ] Test on Android
- [ ] Test on different screen sizes
- [ ] Test in World App specifically
- [ ] Test dark mode vs light mode

### Performance Testing
- [ ] App loads in < 3 seconds
- [ ] Smooth scrolling with 50+ expenses
- [ ] Real-time updates work reliably
- [ ] No memory leaks during extended use

---

## 🔒 Security & Privacy

### Authentication
- [ ] **Verify wallet auth is secure**
  - [ ] Nonces are random and single-use
  - [ ] SIWE signatures are properly validated
  - [ ] No wallet addresses exposed in URLs
  - [ ] Session tokens stored securely

### Data Protection
- [ ] **Review database security**
  - [ ] Row Level Security (RLS) policies enabled
  - [ ] Users can only see their own groups
  - [ ] Users can't modify others' expenses
  - [ ] Test with multiple accounts

- [ ] **Environment variables**
  - [ ] No secrets in client-side code
  - [ ] `.env.local` not committed to git
  - [ ] Supabase keys are correct (anon key for client)

### Privacy Policy & Terms
- [ ] **Create Privacy Policy** (required for World Store)
  - What data you collect (wallet addresses, display names, expenses)
  - How data is stored (Supabase)
  - How data is used (expense tracking only)
  - User rights (data deletion, export)
  - Contact information

- [ ] **Create Terms of Service**
  - User responsibilities
  - Liability limitations
  - Dispute resolution
  - Service availability

> **Tip:** Use free generators like [TermsFeed](https://www.termsfeed.com/) or [GetTerms](https://getterms.io/) as starting points, then customize for your app.

---

## 🎨 UX Polish & Bug Fixes

### UI Improvements
- [ ] **Add loading states**
  - [ ] Skeleton screens while fetching data
  - [ ] Loading spinners for actions
  - [ ] Disable buttons during processing

- [ ] **Error handling**
  - [ ] User-friendly error messages
  - [ ] Toast notifications for success/errors
  - [ ] Retry mechanisms for failed operations

- [ ] **Empty states**
  - [ ] "No expenses yet" with helpful CTA
  - [ ] "No groups" with "Create Group" prompt
  - [ ] "All settled up!" celebration

- [ ] **Confirmation dialogs**
  - [ ] Confirm before deleting expenses
  - [ ] Confirm before leaving group
  - [ ] Confirm before deleting group

### Accessibility
- [ ] Proper contrast ratios for text
- [ ] Touch targets at least 44x44px
- [ ] Keyboard navigation works
- [ ] Screen reader friendly labels

### Copy & Messaging
- [ ] Review all button labels for clarity
- [ ] Check for typos and grammar
- [ ] Ensure consistent tone throughout
- [ ] Add helpful tooltips/hints where needed

---

## 🚀 Performance Optimization

### Code Optimization
- [ ] **Remove console.logs** (or use environment-based logging)
- [ ] **Optimize bundle size**
  - Run `npm run build` and check bundle size
  - Remove unused dependencies
  - Code-split large components

- [ ] **Optimize images**
  - Use WebP format
  - Compress images
  - Add proper alt text

### Database Optimization
- [ ] **Add indexes** for frequently queried fields
  - `expenses.group_id`
  - `group_members.user_id`
  - `group_members.group_id`

- [ ] **Review query performance**
  - Use Supabase dashboard to check slow queries
  - Optimize with proper indexes

---

## 📱 World App Specific

### MiniKit Integration
- [ ] **Test all MiniKit features**
  - [ ] Wallet authentication works
  - [ ] User info (username) displays correctly
  - [ ] Deep links work properly

- [ ] **Verify app metadata**
  - [ ] App ID is correct in `.env.local`
  - [ ] App name is set
  - [ ] App description is clear

### World Store Requirements
- [ ] **App Icon** (required)
  - 512x512px PNG
  - Transparent background or solid color
  - Recognizable at small sizes
  - Follows World brand guidelines

- [ ] **Screenshots** (4-6 recommended)
  - Show key features
  - Use actual app screenshots
  - Add captions if helpful
  - Show on real device (not just browser)

- [ ] **App Description**
  - Clear, concise explanation (2-3 sentences)
  - Highlight key features
  - Mention "split expenses" and "World App"

- [ ] **Category**
  - Choose appropriate category (Finance/Utilities)

- [ ] **Keywords/Tags**
  - expenses, split, bills, friends, group, money

---

## 🌐 Deployment

### Production Environment
- [ ] **Deploy to Vercel** (or your hosting platform)
  - [ ] Set up production environment variables
  - [ ] Configure custom domain (optional but recommended)
  - [ ] Enable HTTPS
  - [ ] Test production build

- [ ] **Database**
  - [ ] Supabase project is in production mode
  - [ ] Backups are enabled
  - [ ] Connection pooling configured

### Monitoring & Analytics
- [ ] **Set up error tracking**
  - [ ] Sentry or similar for error monitoring
  - [ ] Track critical user flows

- [ ] **Analytics** (optional)
  - [ ] Vercel Analytics (already included)
  - [ ] Track key metrics (DAU, expense creation, etc.)

---

## 📋 Legal & Compliance

### Required Documents
- [ ] Privacy Policy (link in app footer)
- [ ] Terms of Service (link in app footer)
- [x] Contact email for support: even-app@proton.me
- [ ] GDPR compliance (if targeting EU users)

### Content Review
- [ ] No copyrighted content without permission
- [ ] No misleading claims
- [ ] Age-appropriate content
- [ ] Follows World App community guidelines

---

## 🎯 Pre-Submission Testing

### Final Checks
- [ ] **Test the exact production URL**
  - [ ] All features work on production
  - [ ] No CORS issues
  - [ ] Database connections work
  - [ ] Environment variables are correct

- [ ] **Test invite flow end-to-end**
  - [ ] Share invite link
  - [ ] Open on different device
  - [ ] Verify World App opens
  - [ ] Verify auto-join works

- [ ] **Test with fresh account**
  - [ ] First-time user experience
  - [ ] Onboarding is clear
  - [ ] No confusing steps

---

## 📦 Marketing Assets

### App Store Listing
- [ ] **App Name**: "Even - Split Expenses"
- [ ] **Tagline**: "Split bills with friends on World App"
- [ ] **Description**: 
  ```
  Even makes splitting expenses with friends effortless. 
  Create groups, track shared costs, and settle up instantly 
  using your World App wallet.
  
  Features:
  • Split expenses equally among friends
  • Track who owes what in real-time
  • Settle up with crypto payments
  • Invite friends with a simple link
  • Secure wallet authentication
  ```

- [ ] **Screenshots** showing:
  1. Login screen
  2. Group list
  3. Expense list with debts
  4. Add expense form
  5. Settlement summary

### Social Media (Optional)
- [ ] Create Twitter/X announcement
- [ ] Share in World App community Discord
- [ ] Post on relevant subreddits (r/worldcoin)

---

## 🔍 World Store Submission Checklist

### Required Information
- [ ] App name
- [ ] App icon (512x512px)
- [ ] Short description (160 characters)
- [ ] Full description
- [ ] Screenshots (4-6 images)
- [ ] Category
- [ ] Privacy Policy URL
- [ ] Terms of Service URL
- [x] Support email: even-app@proton.me
- [ ] App URL (production deployment)

### Technical Requirements
- [ ] App works in World App
- [ ] Uses World ID or wallet authentication
- [ ] No crashes or critical bugs
- [ ] Reasonable performance
- [ ] Follows World App design guidelines

---

## ✅ Quick Wins Before Launch

### High Priority
1. **Add loading states** - Makes app feel more responsive
2. **Add error messages** - Better user experience when things fail
3. **Add confirmation dialogs** - Prevent accidental deletions
4. **Remove console.logs** - Clean production code
5. **Test invite flow thoroughly** - This is a key feature

### Nice to Have
1. **Add app tutorial/onboarding** - Help first-time users
2. **Add expense categories** - Food, Transport, etc.
3. **Add expense notes/receipts** - More context
4. **Add group avatars** - Visual appeal
5. **Add expense search/filter** - Better for large groups

---

## 📞 Support & Maintenance

### Post-Launch
- [ ] Monitor error logs daily (first week)
- [ ] Respond to user feedback quickly
- [ ] Have a plan for bug fixes
- [ ] Consider a feedback form in the app
- [ ] Join World App developer community

---

## 🎉 Launch Day Checklist

- [ ] Final production test
- [ ] Submit to World Store
- [ ] Announce on social media
- [ ] Share with friends for initial users
- [ ] Monitor for issues
- [ ] Celebrate! 🎊

---

## Resources

- [World Store Submission Guide](https://docs.world.org/mini-apps/store)
- [World App Design Guidelines](https://docs.world.org/mini-apps/design)
- [MiniKit Documentation](https://docs.world.org/mini-apps/minikit)
- [Supabase Production Checklist](https://supabase.com/docs/guides/platform/going-into-prod)
- [Vercel Deployment Guide](https://vercel.com/docs/deployments/overview)
