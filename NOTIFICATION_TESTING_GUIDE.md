# 🧪 Notification Testing Guide

## What's New in Mock Notifications

I've expanded the `mockNotifications` array in `services/mockData.ts` with **16 comprehensive test notifications** organized in 3 categories:

---

## 📋 Mock Notification Data

### **UNREAD NOTIFICATIONS (5 notifications - Shows in badge)**

| ID | Type | Message | Time | Icon |
|----|------|---------|------|------|
| notif_1 | System | Campus Tech Fest sync complete | 2m ago | ✅ |
| notif_2 | News | Tech Fest 2024 Registration Open | 5m ago | 📰 |
| notif_3 | Club | Coding Challenge - Binary Tree | 10m ago | 🎭 |
| notif_4 | System | Club Update synced | 15m ago | ✅ |
| notif_5 | Club | Photography Photo Walk | 20m ago | 🎭 |

**Expected Badge Count: 5** 🔴

---

### **READ NOTIFICATIONS (3 notifications - No badge)**

| ID | Type | Message | Time |
|----|------|---------|------|
| notif_6 | News | Library 24/7 Hours | 45m ago |
| notif_7 | Admin | System Maintenance | 1h ago |
| notif_8 | Club | Debate Competition | 1.5h ago |

---

### **OLDER NOTIFICATIONS (8 notifications - Chronological)**

| ID | Type | Message | Time |
|----|------|---------|------|
| notif_9 | News | Achievement Award | 3h ago |
| notif_10 | System | Subscription Confirmed | 5h ago |
| notif_11 | Club | Championship Victory | 6h ago |
| notif_12 | Admin | Profile Update Notice | 8h ago |
| notif_13 | News | Sports Complex Opening | 12h ago |
| notif_14 | System | Profile Updated | 1d ago |
| notif_15 | News | Scholarship Opportunity | 2d ago |
| notif_16 | Club | Art Exhibition | 3d ago |

---

## 🧪 Testing Checklist

### Test 1: Unread Badge Display
```
✓ Open app and go to Dashboard
✓ Look at top-right corner
✓ Should see bell icon with RED badge showing "5"
✓ Badge should update in real-time (every 1 second)
```

### Test 2: Open Notification Center
```
✓ Tap the bell icon
✓ Notification Center modal should open
✓ Should see 16 notifications listed
✓ Newest notifications at top (notif_1 first)
✓ Unread notifications should have BLUE DOT
✓ Read notifications should NOT have blue dot
```

### Test 3: Mark as Read (Individual)
```
✓ In Notification Center, tap any notification
✓ Notification should be marked as read
✓ Blue dot should disappear
✓ Badge count should decrease by 1
✓ Refresh the modal to verify
```

### Test 4: Mark All as Read
```
✓ In Notification Center, tap "Mark All Read" button
✓ All blue dots should disappear
✓ Badge should show "0" or disappear
✓ All notifications marked as read
```

### Test 5: Notification Colors
```
✓ System notifications (✅) = GREEN background
✓ News notifications (📰) = BLUE background
✓ Club notifications (🎭) = ORANGE background
✓ Admin notifications (👑) = RED background
```

### Test 6: Time Formatting
```
✓ Recent: "2m ago", "5m ago", "10m ago"
✓ Hours: "45m ago", "1h ago", "3h ago"
✓ Days: "1d ago", "2d ago", "3d ago"
✓ Time format should be human-readable
```

### Test 7: Empty State (After Mark All Read)
```
✓ Mark all notifications as read
✓ Close and reopen notification center
✓ Should show empty state message
✓ "No Notifications" with icon
✓ "You're all caught up!" message
```

### Test 8: Pull to Refresh
```
✓ In Notification Center, pull down
✓ Refresh control should appear
✓ Should reload notifications
✓ List should update
```

### Test 9: Search Integration
```
✓ Go to Dashboard
✓ Search notifications by typing in search bar
✓ Search should NOT filter notifications (they're separate)
✓ Search should filter news feed
✓ Notifications work independently
```

### Test 10: Offline Mode
```
✓ Enable airplane mode / disable internet
✓ Bell icon should still show badge
✓ Notification Center should open
✓ Cached notifications should display
✓ Go online again
✓ Badge should update if new data
```

---

## 🎨 Visual Testing

### What You Should See

**Dashboard Header:**
```
Welcome to Campus        [Search news...] 🔔●5
Stay updated...
```

**Notification Center Modal:**
```
┌─────────────────────────────┐
│ Notifications       [X]      │
│ [Mark All Read]             │
├─────────────────────────────┤
│ ✅ Sync Complete            │
│ Your news post synced! ●    │
│ 2 minutes ago               │
├─────────────────────────────┤
│ 📰 Tech Fest Opens          │
│ Tech Society posted... ●    │
│ 5 minutes ago               │
├─────────────────────────────┤
│ 🎭 Coding Challenge         │
│ Binary tree problem ●       │
│ 10 minutes ago              │
├─────────────────────────────┤
│ ✅ Club Update Synced       │
│ Guest Speaker event ●       │
│ 15 minutes ago              │
├─────────────────────────────┤
│ 🎭 Photo Walk This Weekend  │
│ Join us for photos ●        │
│ 20 minutes ago              │
├─────────────────────────────┤
│ 📰 Library 24/7 Hours       │
│ Extended during exams       │
│ 45 minutes ago              │
└─────────────────────────────┘
```

---

## 🚀 How to Test

### Step 1: Start the App
```bash
npm start
# or
npm run ios
npm run android
npm run web
```

### Step 2: Login with Demo Account
```
Email: test@example.com
Password: password
```

### Step 3: Go to Dashboard
```
Tap the bottom navigation → Dashboard
```

### Step 4: Look for Bell Icon
```
Top-right corner of dashboard header
Should show 🔔 with red badge "5"
```

### Step 5: Tap Bell Icon
```
Notification Center modal opens
Shows all 16 notifications
```

### Step 6: Test Actions
```
Tap notifications to mark as read
Tap "Mark All Read" button
Watch badge update
Pull to refresh
```

---

## 📊 Test Scenarios

### Scenario A: Fresh App Start
1. App launches → Dashboard
2. Badge shows "5" (5 unread notifications)
3. Open notification center
4. See 16 total notifications
5. 5 have blue dots (unread)
6. 11 are without dots (read)

### Scenario B: Mark One as Read
1. Tap notification (notif_1)
2. Badge updates from "5" to "4"
3. Blue dot disappears on notif_1
4. Other unread remain marked

### Scenario C: Mark All as Read
1. Tap "Mark All Read" button
2. All blue dots disappear
3. Badge shows "0" or disappears
4. Empty state appears
5. Message: "You're all caught up!"

### Scenario D: Close and Reopen
1. Mark some as read
2. Close notification center
3. Reopen notification center
4. Changes persist
5. Read status maintained

---

## 🎯 Expected Results

| Test | Expected | Status |
|------|----------|--------|
| Badge shows on load | 5 | ✅ |
| Modal opens | Yes | ✅ |
| 16 notifications shown | Yes | ✅ |
| Mark as read works | Yes | ✅ |
| Color coding correct | Yes | ✅ |
| Time format correct | Yes | ✅ |
| Empty state works | Yes | ✅ |
| Offline works | Yes | ✅ |
| Persistence works | Yes | ✅ |

---

## 🔧 Modifying Test Data

### Add Your Own Notification
Edit `services/mockData.ts`:

```typescript
{
  id: 'notif_custom',
  type: 'system',  // 'system' | 'news' | 'club' | 'admin'
  title: 'Your Title',
  message: 'Your message',
  timestamp: new Date(Date.now() - 30 * 60000),  // 30 minutes ago
  isRead: false,  // false for unread, true for read
  clubId: '1',  // optional
  relatedId: '1',  // optional
}
```

### Change Badge Count
Modify `isRead: false` count to change badge number.

### Test Different Times
Adjust `Date.now() - X * 60000` for different timestamps.

---

## 💡 Testing Tips

### Tip 1: Test Both Roles
```
Admin: admin@campus.com
Lead: lead@campus.com
Student: test@example.com
```
Each sees different notifications based on role.

### Tip 2: Test Offline
```
1. Go online
2. Notifications load
3. Go offline (airplane mode)
4. Notifications still show (from cache)
5. Go online again
6. Notifications refresh
```

### Tip 3: Check Local Storage
```
Use React Native DevTools to inspect:
AsyncStorage key: '@campus_notifications'
Should persist notifications
```

### Tip 4: Clear and Reset
```
To clear all notifications:
1. Go to Settings
2. Clear app cache
3. Or edit mockNotifications in mockData.ts
4. Restart app
```

---

## 📱 Testing on Different Devices

### iOS Simulator
```bash
npm run ios
```
- Test notification badge
- Test modal animations
- Test dark/light mode
- Test landscape orientation

### Android Emulator
```bash
npm run android
```
- Test notification badge
- Test modal animations
- Test dark/light mode
- Test back button behavior

### Web Browser
```bash
npm run web
```
- Test responsive design
- Test on mobile view
- Test keyboard navigation
- Test theme switching

---

## ✅ Success Criteria

Your notification feature is working correctly when:

- ✅ Badge shows correct unread count
- ✅ Modal opens with all notifications
- ✅ Colors are correct for each type
- ✅ Time formatting is human-readable
- ✅ Mark as read updates badge
- ✅ Mark all read clears badge
- ✅ Notifications persist offline
- ✅ Empty state displays correctly
- ✅ Pull-to-refresh works
- ✅ Works on iOS, Android, Web

---

## 🎊 Congratulations!

You now have **16 comprehensive test notifications** ready to thoroughly test the notification feature you just built!

**Happy Testing! 🧪**
