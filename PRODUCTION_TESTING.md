# Production Testing Guide

This guide outlines the testing procedures to verify the Even app works correctly in production before World Store submission.

## Prerequisites

- [ ] App deployed to production (Vercel)
- [ ] Supabase database in production mode
- [ ] RLS policies enabled (see `RLS_POLICIES.md`)
- [ ] Environment variables configured correctly
- [ ] World App installed on test device (iOS or Android)

## Testing Checklist

### 1. Authentication Flow

**Test in World App:**

- [ ] Open the app in World App
- [ ] Click "Sign in with World ID"
- [ ] Verify wallet authentication works
- [ ] Verify username/display name is set correctly
- [ ] Verify persistent login (close and reopen app)
- [ ] Test logout functionality

**Expected Behavior:**
- Smooth authentication without errors
- Display name appears in header
- Session persists across app restarts

### 2. Group Management

**Create Group:**

- [ ] Create a new group with a descriptive name
- [ ] Verify group appears in group list
- [ ] Verify you are listed as a member

**Invite Flow:**

- [ ] Click share button on a group
- [ ] Copy invite link
- [ ] Open link on a different device/account
- [ ] Verify World App opens automatically
- [ ] Verify user is auto-joined to the group
- [ ] Verify both users see each other as members

**Leave Group:**

- [ ] Leave a group
- [ ] Verify group is removed from your list
- [ ] Verify you can no longer see group expenses

### 3. Expense Tracking

**Add Expenses:**

- [ ] Add expense with equal split
- [ ] Add expense with unequal split (by amount)
- [ ] Add expense with percentage split
- [ ] Add expense with shares split
- [ ] Verify all participants are shown correctly
- [ ] Verify "Me" is replaced with your display name

**Edge Cases:**

- [ ] Test $0.00 expense (should be allowed or prevented?)
- [ ] Test very large amount ($999,999.99)
- [ ] Test special characters in description
- [ ] Test long expense descriptions
- [ ] Test expenses with single participant

**Expense Display:**

- [ ] Verify expenses appear in chronological order
- [ ] Verify expense cards show correct information
- [ ] Verify payer is highlighted correctly
- [ ] Verify split amounts are calculated correctly

### 4. Debt Calculation

**Verify Calculations:**

- [ ] Create multiple expenses with different splits
- [ ] Verify debt summary shows correct amounts
- [ ] Verify "who owes who" is accurate
- [ ] Test with 3+ people in a group
- [ ] Verify "All settled up!" appears when balanced

**Debt Scenarios:**

- [ ] User A pays $30, split equally with B and C
  - Expected: B owes A $10, C owes A $10
- [ ] User A pays $50, User B pays $50, split equally
  - Expected: All settled up
- [ ] Complex scenario with multiple expenses
  - Manually calculate and verify accuracy

### 5. Settlement Flow

**Record Payment:**

- [ ] Click "Record Payment"
- [ ] Select payer and recipient
- [ ] Enter amount
- [ ] Submit payment record
- [ ] Verify debt is reduced correctly

**Settle Up (Crypto):**

- [ ] Click "Settle Up" button
- [ ] Verify correct amount is pre-filled
- [ ] Verify recipient wallet address is correct
- [ ] Select USDC or WLD
- [ ] Complete payment in World App
- [ ] Verify payment confirmation
- [ ] Verify debt is cleared after payment

**Error Handling:**

- [ ] Test settle up with no debt (button should be disabled)
- [ ] Test settle up with missing wallet address
- [ ] Test cancelled payment (should not affect debt)

### 6. Data Persistence

**Refresh Tests:**

- [ ] Create expense, close app, reopen
  - Verify expense is still there
- [ ] Join group, close app, reopen
  - Verify group membership persists
- [ ] Record payment, close app, reopen
  - Verify payment is recorded

**Pull-to-Refresh:**

- [ ] Pull down on expense list
- [ ] Verify refresh indicator appears
- [ ] Verify expenses reload

### 7. Multi-User Testing

**Two Devices Required:**

- [ ] User A creates group and expense
- [ ] User B joins via invite link
- [ ] Verify User B sees User A's expense
- [ ] User B adds an expense
- [ ] Verify User A sees User B's expense
- [ ] Test concurrent expense creation
- [ ] Verify real-time updates work

**Data Isolation:**

- [ ] User A creates Group 1
- [ ] User B creates Group 2
- [ ] Verify User A cannot see Group 2
- [ ] Verify User B cannot see Group 1

### 8. Performance Testing

**Load Testing:**

- [ ] Create group with 10+ members
- [ ] Add 50+ expenses
- [ ] Verify smooth scrolling
- [ ] Verify app loads in < 3 seconds
- [ ] Test on slow network connection

**Memory:**

- [ ] Use app for extended period (30+ minutes)
- [ ] Verify no memory leaks
- [ ] Verify no crashes

### 9. Error Scenarios

**Network Issues:**

- [ ] Turn off WiFi/data
- [ ] Try to add expense
- [ ] Verify error message appears
- [ ] Turn on network
- [ ] Verify retry works

**Invalid Data:**

- [ ] Try to create group with empty name
- [ ] Try to add expense with no amount
- [ ] Try to add expense with no participants
- [ ] Verify validation errors appear

**Database Errors:**

- [ ] Temporarily disable Supabase (if possible)
- [ ] Verify graceful error handling
- [ ] Verify user-friendly error messages

### 10. UI/UX Polish

**Visual Check:**

- [ ] All text is readable (contrast)
- [ ] All buttons are tappable (44x44px minimum)
- [ ] No layout issues on different screen sizes
- [ ] Dark mode works correctly
- [ ] Loading states appear appropriately
- [ ] Empty states show helpful messages

**Accessibility:**

- [ ] Test with screen reader (VoiceOver/TalkBack)
- [ ] Verify all interactive elements are labeled
- [ ] Test keyboard navigation (if applicable)

## Production Environment Verification

### Environment Variables

Verify these are set correctly in Vercel:

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `NEXT_PUBLIC_APP_ID`

### Database

- [ ] RLS policies enabled on all tables
- [ ] Indexes created for performance
- [ ] Backups enabled
- [ ] Connection pooling configured

### Deployment

- [ ] Production build succeeds
- [ ] No console errors in production
- [ ] HTTPS enabled
- [ ] Custom domain configured (optional)

## Bug Reporting

If you find issues during testing:

1. **Document the Bug:**
   - What you did (steps to reproduce)
   - What you expected
   - What actually happened
   - Screenshots/videos if applicable

2. **Priority Levels:**
   - **Critical:** App crashes, data loss, security issues
   - **High:** Core features broken, major UX issues
   - **Medium:** Minor bugs, edge cases
   - **Low:** Cosmetic issues, nice-to-haves

3. **Fix and Retest:**
   - Fix critical and high priority bugs before launch
   - Retest the specific scenario after fixing
   - Perform regression testing

## Sign-Off

Once all tests pass:

- [ ] All critical features tested and working
- [ ] No critical or high priority bugs
- [ ] Multi-user scenarios verified
- [ ] Performance is acceptable
- [ ] Security (RLS) verified
- [ ] Ready for World Store submission ✅

**Tested By:** ___________________  
**Date:** ___________________  
**Notes:** ___________________

## Contact

For questions about testing, contact: **even-app@proton.me**
