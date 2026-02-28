# B2B Platform Pages Comparison Report

**Generated:** 2026-02-27
**Scope:** Customer-facing pages only (admin pages excluded)

## Executive Summary

| Project | Total Customer Pages | Status |
|---------|---------------------|---------|
| **Mobile** | 17 pages | ✅ Complete |
| **API** | 11 pages | ⚠️ Partial |

**Gap Analysis:** API project is missing **6 customer-facing pages** compared to Mobile.

---

## Summary Table: Mobile vs API

| Page | Mobile Path | API Path | Status | Priority |
|------|-------------|----------|---------|----------|
| **Home/Landing** | `pages/welcome.tsx` | `Pages/Home.tsx` | ✅ Implemented | - |
| **Login** | `pages/auth/login.tsx` | `Pages/Auth/Login.tsx` | ✅ Implemented | - |
| **Register** | `pages/auth/register.tsx` | `Pages/Auth/Register.tsx` | ✅ Implemented | - |
| **Forgot Password** | `pages/auth/forgot-password.tsx` | ❌ Missing | 🔴 **HIGH** | Missing Route |
| **Reset Password** | `pages/auth/reset-password.tsx` | `Pages/Auth/ResetPassword.tsx` | ✅ Implemented | - |
| **Dashboard** | `pages/dashboard.tsx` | `Pages/CustomerDashboard.tsx` | ✅ Implemented | - |
| **Catalog** | `pages/catalog.tsx` | `Pages/Catalog.tsx` | ✅ Implemented | - |
| **Product Detail** | `pages/product/show.tsx` | `Pages/Product/Show.tsx` | ✅ Implemented | - |
| **Cart** | `pages/cart.tsx` | `Pages/Cart.tsx` | ✅ Implemented | - |
| **Checkout** | `pages/checkout.tsx` | `Pages/Checkout.tsx` | ✅ Implemented | - |
| **Orders List** | `pages/orders/index.tsx` | `Pages/Orders/Index.tsx` | ✅ Implemented | - |
| **Order Detail** | ❌ Not Present | `Pages/Orders/Show.tsx` | ✅ API Only | N/A |
| **Account** | `pages/account.tsx` | `Pages/Account.tsx` | ✅ Implemented | - |
| **Edit Profile** | `pages/account/profile.tsx` | ❌ Missing | 🔴 **HIGH** | Missing Route+Controller |
| **Addresses** | `pages/account/addresses.tsx` | ❌ Missing | 🔴 **HIGH** | Missing Route+Page |
| **Change Password** | `pages/account/password.tsx` | ❌ Missing | 🔴 **HIGH** | Missing Page |
| **Payment Methods** | ❌ Not Present | `Pages/PaymentMethods.tsx` | ✅ API Only | N/A |
| **Terms** | `pages/terms.tsx` | ❌ Missing | 🟡 **LOW** | Static Page |
| **Privacy Policy** | `pages/privacy.tsx` | ❌ Missing | 🟡 **LOW** | Static Page |

---

## Missing Pages - Detailed Analysis

### 🔴 HIGH PRIORITY

#### 1. Edit Profile Page
- **Mobile Path:** `pages/account/profile.tsx`
- **Missing in API:** Page and route
- **Backend Status:** ✅ API exists (`PUT /api/user`)
- **Implementation Notes:**
  - API endpoint already implemented in `UpdateUserController`
  - Only needs frontend page
  - Should be accessible at `/account/profile`
- **Est. Effort:** 2-3 hours
- **Route Needed:** `GET /account/profile`

#### 2. Addresses Management
- **Mobile Path:** `pages/account/addresses.tsx`
- **Missing in API:** Page and route
- **Backend Status:** ✅ Full API exists
  - `GET /api/addresses`
  - `POST /api/addresses`
  - `PUT /api/addresses/{address}`
  - `DELETE /api/addresses/{address}`
- **Implementation Notes:**
  - Full CRUD API already implemented
  - Complex form with address fields
  - Need shipping/billing toggle
- **Est. Effort:** 4-6 hours
- **Route Needed:** `GET /account/addresses`

#### 3. Change Password Page
- **Mobile Path:** `pages/account/password.tsx`
- **Missing in API:** Page and route  
- **Backend Status:** ✅ API exists (`PUT /api/password`)
- **Implementation Notes:**
  - API endpoint already implemented
  - Could be integrated into Account page or separate
  - Should include current password verification
- **Est. Effort:** 2-3 hours
- **Route Needed:** `GET /account/password` or modal

#### 4. Forgot Password Page
- **Mobile Path:** `pages/auth/forgot-password.tsx`
- **Missing in API:** Page
- **Backend Status:** ✅ API exists (`POST /api/forgot-password`)
- **Implementation Notes:**
  - Email input form
  - Success message display
  - Could be modal instead of page
- **Est. Effort:** 1-2 hours
- **Route Needed:** `GET /forgot-password`

### 🟡 MEDIUM PRIORITY

*None identified - all medium priority features are complete*

### 🟢 LOW PRIORITY

#### 5. Terms of Service Page
- **Mobile Path:** `pages/terms.tsx`
- **Missing in API:** Entire page
- **Backend Status:** ❌ No API needed (static)
- **Implementation Notes:**
  - Static content page
  - Could be Markdown-based
  - No authentication required
- **Est. Effort:** 1 hour
- **Route Needed:** `GET /terms`

#### 6. Privacy Policy Page
- **Mobile Path:** `pages/privacy.tsx`
- **Missing in API:** Entire page
- **Backend Status:** ❌ No API needed (static)
- **Implementation Notes:**
  - Static content page
  - Could be Markdown-based
  - No authentication required
- **Est. Effort:** 1 hour
- **Route Needed:** `GET /privacy`

---

## Implementation Roadmap

### Phase 1: Account Management (HIGH Priority)
**Timeline:** 1-2 weeks

1. **Create `/account/profile` page**
   - Use existing `UpdateUserController` API
   - Form fields: name, email, phone
   - Validation matching mobile

2. **Create `/account/addresses` page**
   - Full addresses CRUD
   - Use existing addresses API endpoints
   - Include shipping/billing toggle

3. **Create `/account/password` page**
   - Password change form
   - Integration with `ChangePasswordController`
   - Current password requirement

### Phase 2: Authentication Enhancement
**Timeline:** 2-3 days

4. **Add forgot password page**
   - Link from login page
   - Email form
   - Success/error handling

### Phase 3: Legal Pages
**Timeline:** 1 day

5. **Create `/terms` page**
   - Static content
   - Link from footer

6. **Create `/privacy` page**
   - Static content
   - Link from footer

---

## Routes Comparison

### Mobile Routes (from React Router)
```
/                    → welcome.tsx
/login               → auth/login.tsx
/register            → auth/register.tsx
/forgot-password     → auth/forgot-password.tsx
/reset-password      → auth/reset-password.tsx
/dashboard           → dashboard.tsx
/catalog             → catalog.tsx
/product/:id         → product/show.tsx
/cart                → cart.tsx
/checkout            → checkout.tsx
/orders              → orders/index.tsx
/account             → account.tsx
/account/profile     → account/profile.tsx
/account/addresses   → account/addresses.tsx
/account/password    → account/password.tsx
/terms               → terms.tsx
/privacy             → privacy.tsx
```

### API Routes (from web.php)
```
/                    → HomeController
/login               → LoginController
/register            → RegisterController
/reset-password      → ResetPasswordController
/dashboard           → CustomerDashboardController
/catalog             → CatalogController
/products/{slug}     → ProductController
/cart                → CartController
/checkout            → CheckoutController
/orders              → OrderController
/orders/{order}     → OrderController (show)
/account             → AccountController
/account/payment-methods → PaymentMethodController
```

### Missing Routes in API
```
GET /forgot-password         → New controller or view
GET /account/profile         → New controller
GET /account/addresses       → New controller
GET /account/password        → New controller or modal
GET /terms                   → Static or new controller
GET /privacy                 → Static or new controller
```

---

## Backend Requirements Checklist

### ✅ Already Implemented
- [x] User profile update API (`PUT /api/user`)
- [x] Address CRUD APIs (`/api/addresses/*`)
- [x] Password change API (`PUT /api/password`)
- [x] Forgot password API (`POST /api/forgot-password`)

### ❌ Needs Implementation
- [ ] Web routes for account sub-pages
- [ ] Controllers for account sub-pages
- [ ] Terms page route (static)
- [ ] Privacy page route (static)

---

## Additional Observations

### Pages Present in API but NOT in Mobile
1. **Payment Methods** (`/account/payment-methods`)
   - Stripe integration
   - Saved cards management
   - Mobile should implement this

2. **Order Detail** (`/orders/{order}`)
   - Full order details with tracking
   - Invoice download
   - Reorder functionality
   - Mobile only has list view

### Mobile Placeholder Pages
- `orders/index.tsx` - Shows "Coming Soon" placeholder
  - Needs full implementation
  - Copy API's Orders/Index.tsx approach

### Feature Parity Recommendation
**Priority 1:** Implement missing API pages to match mobile  
**Priority 2:** Add payment methods to mobile  
**Priority 3:** Add order details to mobile

---

## Test Coverage Requirements

### Tests Needed for New Pages
1. Account Profile Page Tests
   - Route accessibility
   - Form validation
   - Update success/failure

2. Addresses Page Tests
   - List addresses
   - Add address
   - Edit address
   - Delete address

3. Password Page Tests
   - Change password success
   - Wrong current password
   - Password validation

4. Static Page Tests
   - Terms page loads
   - Privacy page loads

---

## File Structure Comparison

### Mobile Structure
```
resources/js/pages/
├── account.tsx
├── account/
│   ├── addresses.tsx      ❌ Missing in API
│   ├── password.tsx       ❌ Missing in API
│   └── profile.tsx        ❌ Missing in API
├── auth/
│   ├── forgot-password.tsx ❌ Missing in API
│   ├── login.tsx
│   ├── register.tsx
│   └── reset-password.tsx
├── cart.tsx
├── catalog.tsx
├── checkout.tsx
├── dashboard.tsx
├── orders/
│   └── index.tsx
├── privacy.tsx            ❌ Missing in API
├── product/
│   └── show.tsx
├── terms.tsx              ❌ Missing in API
└── welcome.tsx            → Home.tsx in API
```

### API Structure
```
resources/js/Pages/
├── Account.tsx
├── Auth/
│   ├── Login.tsx
│   ├── Register.tsx
│   └── ResetPassword.tsx
├── Cart.tsx
├── Catalog.tsx
├── Categories.tsx         ← Admin only
├── Checkout.tsx
├── CustomerDashboard.tsx  ← Equivalent to dashboard.tsx
├── Dashboard.tsx          ← Admin only
├── Error.tsx              ← Generic error
├── Home.tsx               ← Equivalent to welcome.tsx
├── Orders/
│   ├── Index.tsx
│   └── Show.tsx           ✅ API only (detailed)
├── PaymentMethods.tsx     ✅ API only
├── Product/
│   └── Show.tsx
├── Products.tsx           ← Admin only
├── Products/
│   ├── Create.tsx         ← Admin only
│   └── Edit.tsx           ← Admin only
```

---

## Next Steps

1. **Create GitHub issues** for each missing page
2. **Prioritize account sub-pages** (profile, addresses, password)
3. **Implement routes and controllers** for missing functionality
4. **Write tests** for each new page
5. **Consider adding** Payment Methods page to mobile
6. **Implement** order detail page in mobile

---

*Report generated by automated page comparison analysis*
