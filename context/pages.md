# Customer-Facing Pages Comparison Report

**Generated:** February 27, 2026  
**Mobile Project:** `/home/eric/projects/b2b/mobile`  
**API Project:** `/home/eric/projects/b2b/api`  

---

## Summary

This report compares customer-facing pages between the mobile app and the web API project to identify gaps in the web implementation.

| Metric | Mobile App | Web API | Gap |
|--------|-----------|---------|-----|
| **Total Customer Pages** | 17 | 11 | 6 pages missing |
| **Public Pages** | 6 | 4 | 2 pages missing |
| **Auth Pages** | 9 | 5 | 4 pages missing |
| **Guest Pages** | 2 | 3 | -1 (web has extra Reset Password) |

---

## Mobile App Pages (Reference)

| # | Page | Route | Access | Status in Web API |
|---|------|-------|--------|-------------------|
| 1 | Welcome/Home | `/` | Public | ✅ Implemented (Home.tsx) |
| 2 | Dashboard | `/dashboard` | Auth | ✅ Implemented (CustomerDashboard.tsx) |
| 3 | Catalog | `/catalog` | Public | ✅ Implemented (Catalog.tsx) |
| 4 | Product Detail | `/product/{id}` | Auth | ✅ Implemented (Product/Show.tsx) |
| 5 | Cart | `/cart` | Auth | ✅ Implemented (Cart.tsx) |
| 6 | Checkout | `/checkout` | Auth | ✅ Implemented (Checkout.tsx) |
| 7 | Orders List | `/orders` | Auth | ⚠️ **Placeholder Only** (Orders/Index.tsx shows "Coming Soon") |
| 8 | Account | `/account` | Auth | ✅ Implemented (Account.tsx) |
| 9 | Edit Profile | `/account/profile` | Auth | ❌ **Missing** |
| 10 | Addresses | `/account/addresses` | Auth | ❌ **Missing** |
| 11 | Change Password | `/account/password` | Auth | ❌ **Missing** |
| 12 | Login | `/login` | Guest | ✅ Implemented (Auth/Login.tsx) |
| 13 | Register | `/register` | Guest | ✅ Implemented (Auth/Register.tsx) |
| 14 | Forgot Password | `/forgot-password` | Guest | ❌ **Missing** |
| 15 | Reset Password | `/reset-password` | Guest | ✅ Implemented (Auth/ResetPassword.tsx) |
| 16 | Terms | `/terms` | Public | ❌ **Missing** |
| 17 | Privacy | `/privacy` | Public | ❌ **Missing** |

---

## Web API Pages - Current Implementation

### ✅ Fully Implemented (11 pages)

| Page | File | Route | Notes |
|------|------|-------|-------|
| Home | `resources/js/Pages/Home.tsx` | `/` | Landing with featured products |
| Catalog | `resources/js/Pages/Catalog.tsx` | `/catalog` | Public product catalog |
| Product Detail | `resources/js/Pages/Product/Show.tsx` | `/product/{product}` | Pricing tiers, public access |
| Customer Dashboard | `resources/js/Pages/CustomerDashboard.tsx` | `/dashboard` | User stats, featured products |
| Cart | `resources/js/Pages/Cart.tsx` | `/cart` | Shopping cart management |
| Checkout | `resources/js/Pages/Checkout.tsx` | `/checkout` | Stripe integration |
| Account | `resources/js/Pages/Account.tsx` | `/account` | User profile overview |
| Login | `resources/js/Pages/Auth/Login.tsx` | `/login` | Authentication form |
| Register | `resources/js/Pages/Auth/Register.tsx` | `/register` | B2B business registration |
| Reset Password | `resources/js/Pages/Auth/ResetPassword.tsx` | `/reset-password/{token}` | API endpoint wrapper |
| Error Page | `resources/js/Pages/Error.tsx` | Error handler | 404/403/500/503 display |

### ⚠️ Partially Implemented

| Page | File | Status | Notes |
|------|------|--------|-------|
| Orders | `resources/js/Pages/Orders/Index.tsx` | Placeholder | Shows "Coming Soon" - needs full implementation |

---

## Missing Pages - Action Required (6 pages)

### 🔴 High Priority - Account Management (3 pages)

| # | Page | Mobile Route | Proposed Web Route | Priority | Complexity |
|---|------|--------------|-------------------|----------|------------|
| 1 | **Edit Profile** | `/account/profile` | `/account/profile` | High | Low |
| 2 | **Addresses** | `/account/addresses` | `/account/addresses` | High | Medium |
| 3 | **Change Password** | `/account/password` | `/account/password` | High | Low |

**Justification:** These are essential for user account management. The Account page exists but has no way to edit profile information, manage shipping addresses, or change passwords.

### 🟡 Medium Priority - Authentication (1 page)

| # | Page | Mobile Route | Proposed Web Route | Priority | Complexity |
|---|------|--------------|-------------------|----------|------------|
| 4 | **Forgot Password** | `/forgot-password` | `/forgot-password` | Medium | Low |

**Justification:** The Reset Password page exists (for API token), but users need a way to request password reset emails. Currently only available via mobile app.

### 🟢 Lower Priority - Legal Pages (2 pages)

| # | Page | Mobile Route | Proposed Web Route | Priority | Complexity |
|---|------|--------------|-------------------|----------|------------|
| 5 | **Terms** | `/terms` | `/terms` | Low | Low |
| 6 | **Privacy** | `/privacy` | `/privacy` | Low | Low |

**Justification:** Legal compliance pages. Currently mobile-only, but needed for web users.

---

## Implementation Recommendations

### Phase 1: Account Management (Week 1)
1. **Edit Profile** - Add form to edit name, email, phone
2. **Change Password** - Add password change form
3. **Addresses** - Create address management (list, add, edit, delete)

### Phase 2: Authentication Flow (Week 2)
4. **Forgot Password** - Request reset email form
5. **Orders Page** - Replace placeholder with full order history

### Phase 3: Legal & Polish (Week 3)
6. **Terms** - Static terms page
7. **Privacy** - Static privacy policy page

---

## File Structure Comparison

### Mobile App Structure
```
resources/js/pages/
├── welcome.tsx
├── dashboard.tsx
├── catalog.tsx
├── product/show.tsx
├── cart.tsx
├── checkout.tsx
├── orders/index.tsx
├── account.tsx
├── account/
│   ├── profile.tsx      ← Missing in web
│   ├── addresses.tsx      ← Missing in web
│   └── password.tsx       ← Missing in web
├── auth/
│   ├── login.tsx
│   ├── register.tsx
│   ├── forgot-password.tsx  ← Missing in web
│   └── reset-password.tsx
├── terms.tsx              ← Missing in web
└── privacy.tsx            ← Missing in web
```

### Web API Structure
```
resources/js/Pages/
├── Auth/
│   ├── Login.tsx
│   ├── Register.tsx
│   └── ResetPassword.tsx  ← Extra: Reset password for API
├── Product/
│   └── Show.tsx
├── Orders/
│   └── Index.tsx          ← ⚠️ Placeholder
├── Home.tsx
├── Catalog.tsx
├── CustomerDashboard.tsx
├── Cart.tsx
├── Checkout.tsx
├── Account.tsx            ← ⚠️ No edit/profile submenu
├── Dashboard.tsx          ← Admin only
├── Products.tsx           ← Admin only
└── Error.tsx
```

---

## Backend Requirements

The following backend endpoints appear to exist in the mobile app but may need verification for web:

| Endpoint | Method | Purpose | Mobile Usage |
|----------|--------|---------|--------------|
| `/api/user` | GET | Get current user | Edit Profile |
| `/api/user` | PUT/PATCH | Update profile | Edit Profile |
| `/api/addresses` | GET | List addresses | Addresses |
| `/api/addresses` | POST | Create address | Addresses |
| `/api/addresses/{id}` | PUT/PATCH | Update address | Addresses |
| `/api/addresses/{id}` | DELETE | Delete address | Addresses |
| `/api/password/change` | POST | Change password | Change Password |
| `/api/password/forgot` | POST | Request reset | Forgot Password |
| `/api/orders` | GET | List orders | Orders |

**Note:** Verify these endpoints exist in the API project or create them as needed.

---

## Cross-Reference with Requirements

Based on supermemory knowledge, these missing pages may relate to:

- **REQ 1.x** - User registration/authentication (Forgot Password relates to REQ 1.3)
- **REQ 2.x** - Profile management (Edit Profile relates to REQ 2.1)
- **REQ 3.x** - Order management (Orders page placeholder needs full implementation for REQ 3.1-3.4)
- **UC-001 to UC-004** - User account use cases

---

## Next Steps

1. Review existing API endpoints for user management
2. Prioritize account management pages (profile, addresses, password)
3. Implement full Orders page to replace placeholder
4. Add Forgot Password flow for web users
5. Create static legal pages (Terms, Privacy)

**Estimated Effort:** 2-3 weeks for complete implementation
