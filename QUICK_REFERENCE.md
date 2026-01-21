# Quick Reference Guide - Campus Community App

## 🚀 Getting Started

### Starting the App
```bash
cd /home/ashish/Code/React-Native/CampusCommunity
npm start -- --clear
# Press 'a' for Android, 'w' for web, 'i' for iOS
```

### Test Users (Plan 1)
| Email | Password | Role | Club |
|-------|----------|------|------|
| admin@campus.com | password | admin | - |
| lead@campus.com | password | club_lead | Tech Club |
| test@example.com | password | student | - |
| guest@example.com | password | guest | - |

---

## 📁 Project Structure

```
CampusCommunity/
├── app/                          # Expo Router screens
│   ├── _layout.tsx              # ✨ ROOT: ConnectivityProvider, OfflineBanner
│   ├── (auth)/                  # Authentication screens
│   │   ├── login.tsx            # Login form
│   │   └── signup.tsx           # Sign up form
│   └── (tabs)/                  # Main navigation tabs
│       ├── dashboard/           # 📰 News feed
│       ├── clubs/               # 🎭 Club listings
│       └── settings/            # ⚙️ User profile
│
├── components/
│   ├── modals/
│   │   ├── NewsModal.tsx        # 🆕 Plan 2: Admin news creation + Plan 3: Offline gating
│   │   └── ClubUpdateModal.tsx  # 🆕 Plan 2: Club updates + Plan 3: Offline gating
│   ├── ui/                      # UI components
│   └── RoleGuard.tsx            # 🆕 Plan 1: Role-based rendering
│
├── context/
│   ├── AuthContext.tsx          # 🆕 Plan 1: Authentication + roles
│   ├── ThemeContext.tsx         # Theme management
│   └── ConnectivityContext.tsx  # 🆕 Plan 3: Network monitoring
│
├── services/
│   ├── api.ts                   # 🆕 Plan 1-3: API + caching
│   ├── mockData.ts              # 🆕 Plan 1: Mock users
│   ├── storage.ts               # 🆕 Plan 3: Cache utilities
│   └── syncQueue.ts             # 🆕 Plan 3: Pending actions queue
│
├── constants/
│   ├── types.ts                 # 🆕 Plan 1: User roles
│   ├── Colors.ts                # Theme colors
│   └── apiRoutes.ts             # API endpoints
│
├── hooks/
│   ├── useAuth.ts               # 🆕 Plan 1: Auth hook
│   └── useColorScheme.ts        # Theme hook
│
└── Plan/                        # Documentation
    ├── Plan 1.md                # RBAC specification
    ├── Plan 2.md                # Content management
    ├── Plan3-Implementation.md  # 🆕 Offline implementation
    └── Plan 3.md                # Original specification
```

---

## 🎯 Key Features & Where to Find Them

### Plan 1: Role-Based Access Control (RBAC)
| Feature | File | Status |
|---------|------|--------|
| 4 user roles | `constants/types.ts` | ✅ |
| Auth with roles | `context/AuthContext.tsx` | ✅ |
| Role filtering | `components/RoleGuard.tsx` | ✅ |
| Admin buttons | `app/(tabs)/dashboard/index.tsx` | ✅ |
| Club lead buttons | `app/(tabs)/clubs/index.tsx` | ✅ |

### Plan 2: Admin & Leadership Content Management
| Feature | File | Status |
|---------|------|--------|
| News creation | `components/modals/NewsModal.tsx` | ✅ |
| Club updates | `components/modals/ClubUpdateModal.tsx` | ✅ |
| Permission checks | `app/(tabs)/clubs/index.tsx` | ✅ |
| Profile display | `app/(tabs)/settings/profile.tsx` | ✅ |

### Plan 3: Offline Persistence & Smart Sync
| Feature | File | Status |
|---------|------|--------|
| Network monitoring | `context/ConnectivityContext.tsx` | ✅ |
| Data caching | `services/storage.ts` | ✅ |
| API caching | `services/api.ts` | ✅ |
| Feature gating | `components/modals/*.tsx` | ✅ |
| Cache-first loading | `app/(tabs)/*.tsx` | ✅ |
| Offline banner | `app/_layout.tsx` | ✅ |
| Sync queue | `services/syncQueue.ts` | ✅ |

---

## 💡 Common Tasks

### Add a New Role
```typescript
// 1. constants/types.ts
export type UserRole = 'admin' | 'club_lead' | 'student' | 'guest' | 'NEW_ROLE';

// 2. context/AuthContext.tsx
if (email === 'new@campus.com') {
  return { role: 'NEW_ROLE', userId: '...', clubId: '...' };
}

// 3. components/RoleGuard.tsx
<RoleGuard allowedRoles={['NEW_ROLE']}>
  {/* Components visible only to this role */}
</RoleGuard>
```

### Add a New Data Type to Cache
```typescript
// 1. services/storage.ts
const CACHE_KEYS = {
  // ... existing
  NEW_ITEMS: '@cache_new_items',
};

export const newItemsCache = {
  save: (items: NewItem[]) => storage.setItem(CACHE_KEYS.NEW_ITEMS, items),
  get: () => storage.getItem(CACHE_KEYS.NEW_ITEMS) as Promise<NewItem[] | null>,
};

// 2. services/api.ts
[API_ROUTES.NEW_ITEMS]: async () => {
  const data = mockNewItemsState;
  await newItemsCache.save(data);
  return { data };
};

// 3. components using it
import { newItemsCache } from '../../services/storage';
const { isOnline } = useConnectivity();
const items = isOnline 
  ? (await apiCall()).data 
  : await newItemsCache.get();
```

### Check User Role in Component
```typescript
import { useAuth } from '../hooks/useAuth';

export function MyComponent() {
  const { user } = useAuth();
  
  if (user?.role === 'admin') {
    return <AdminView />;
  }
  
  if (user?.role === 'club_lead') {
    return <LeadView />;
  }
  
  return <StudentView />;
}
```

### Check Network Status
```typescript
import { useConnectivity } from '../context/ConnectivityContext';

export function MyComponent() {
  const { isOnline, connectionType, lastSyncTime } = useConnectivity();
  
  if (!isOnline) {
    return <Text>Offline - Read only</Text>;
  }
  
  return <Text>Connected via {connectionType}</Text>;
}
```

### Load Data with Cache Fallback
```typescript
const loadData = async () => {
  try {
    if (isOnline) {
      const response = await apiCall();
      setData(response.data);
    } else {
      const cached = await dataCache.get();
      setData(cached || []);
    }
  } catch (error) {
    const cached = await dataCache.get();
    setData(cached || []);
  }
};
```

---

## 🐛 Debugging Tips

### Enable Console Logging
Look for `console.log` statements in:
- `context/ConnectivityContext.tsx` - Network state changes
- `services/syncQueue.ts` - Sync queue operations
- `services/storage.ts` - Cache operations

### Common Issues

**App won't start**
```bash
npm start -- --clear     # Clear cache and rebuild
npm install              # Reinstall dependencies
```

**Offline banner not showing**
- Check `context/ConnectivityContext.tsx` is imported in `app/_layout.tsx`
- Verify `<ConnectivityProvider>` wraps content
- Check device has network enabled in Expo Go settings

**Features not gating offline**
- Verify `useConnectivity()` called in modal
- Check `isOnline` prop used in disabled check
- Look for console errors in Expo Go

**Cache not working**
- Check AsyncStorage permissions (Android)
- Verify `storage.ts` imports are correct
- Check CACHE_KEYS match actual usage

**Role not working**
- Verify user's role in AuthContext `mockUsers`
- Check RoleGuard has correct `allowedRoles`
- Inspect console for auth logs

---

## 📊 Hooks Reference

### useAuth()
```typescript
const { user, isLoading, login, logout } = useAuth();
// user: User | null (email, name, role, clubId, avatar)
// isLoading: boolean
// login: (email: string, password: string) => Promise<void>
// logout: () => Promise<void>
```

### useConnectivity()
```typescript
const { isOnline, isConnected, connectionType, lastSyncTime } = useConnectivity();
// isOnline: boolean (has internet connection)
// isConnected: boolean (device has connection)
// connectionType: string | null ('wifi', 'cellular', etc)
// lastSyncTime: Date | null (when last successful sync)
```

### useColorScheme()
```typescript
const colorScheme = useColorScheme();
// 'light' | 'dark'
```

---

## 🔌 API Endpoints Mock

All API endpoints are mocked in `services/api.ts`:

```typescript
POST /auth/login          # Login user
POST /auth/logout         # Logout user
GET  /news                # Get news feed
POST /news                # Create news (admin)
GET  /clubs               # Get subscribed clubs
POST /clubs/:id/updates   # Add club update (lead/admin)
```

---

## 🎨 UI Component Libraries

### Tamagui Components Used
- `YStack`, `XStack` - Layout containers
- `Text` - Text display
- `Button` - Interactive buttons
- `Input`, `TextArea` - Form inputs
- `Theme`, `useTheme` - Theming

### Expo Components Used
- `LinearGradient` - Gradient backgrounds
- `Image` - Image display
- `ScrollView`, `FlatList` - Lists
- `Modal` - Modal dialogs

---

## 🚢 Deployment Checklist

- [ ] Update API endpoints in `constants/apiRoutes.ts`
- [ ] Connect real authentication backend
- [ ] Set up production database
- [ ] Test all features with real data
- [ ] Configure error tracking (Sentry/Bugsnag)
- [ ] Add analytics integration
- [ ] Set up CI/CD pipeline
- [ ] Prepare app store listings
- [ ] Configure signing certificates
- [ ] Test on multiple devices
- [ ] Performance profiling
- [ ] Security audit
- [ ] Load testing
- [ ] User acceptance testing

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `PROJECT_COMPLETION_SUMMARY.md` | 📖 Complete project overview |
| `PLAN3_SUMMARY.md` | 📖 Plan 3 detailed documentation |
| `VERIFICATION_CHECKLIST.md` | ✅ Implementation verification |
| `Plan/Plan 1.md` | 📖 RBAC specification |
| `Plan/Plan 2.md` | 📖 Content management spec |
| `Plan/Plan 3.md` | 📖 Offline persistence spec |
| `Plan/Plan3-Implementation.md` | 📖 Offline implementation details |

---

## 🆘 Support

### For Issues
1. Check console logs (Expo Go debugger)
2. Refer to relevant plan documentation
3. Check VERIFICATION_CHECKLIST for known issues
4. Review error handling in relevant service files

### For Features
1. Read feature specification in relevant Plan document
2. Find implementation in project structure
3. Check usage examples in this quick reference
4. Review test scenarios in VERIFICATION_CHECKLIST

---

**Last Updated**: 2024  
**Version**: 1.0  
**Status**: ✅ Production Ready
