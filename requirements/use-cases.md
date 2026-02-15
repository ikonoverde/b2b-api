# Use Case Specification

## E-Commerce Mobile App, Web App & API

**Version:** 1.0
**Date:** 2026-02-13
**Status:** Draft
**Related Document:** Software Requirements Specification (SRS) v1.0

---

## Table of Contents

1. [Introduction](#1-introduction)
   1. [Purpose](#11-purpose)
   2. [Scope](#12-scope)
   3. [Actor Definitions](#13-actor-definitions)
2. [Use Case Catalog](#2-use-case-catalog)
   1. [Authentication & User Management](#21-authentication--user-management)
   2. [Product Discovery](#22-product-discovery)
   3. [Shopping & Cart](#23-shopping--cart)
   4. [Checkout & Payment](#24-checkout--payment)
   5. [Order Management — Customer](#25-order-management--customer)
   6. [Admin: Product Management](#26-admin-product-management)
   7. [Admin: Category Management](#27-admin-category-management)
   8. [Admin: Order Management](#28-admin-order-management)
   9. [Admin: User Management](#29-admin-user-management)
   10. [Admin: Inventory Management](#210-admin-inventory-management)
   11. [Admin: Content Management](#211-admin-content-management)
   12. [Admin: Analytics](#212-admin-analytics)
3. [Traceability Matrix](#3-traceability-matrix)
4. [Use Case Summary](#4-use-case-summary)

---

## 1. Introduction

### 1.1 Purpose

This document identifies and specifies the use cases for the e-commerce platform described in the Software Requirements Specification (SRS) v1.0. Each use case describes a specific user interaction with the system, including preconditions, main and alternate flows, postconditions, and traceability to the originating requirements.

### 1.2 Scope

The use cases cover all user-facing functionality across the platform: the REST API (consumed by the mobile app), the customer-facing web app (Inertia/React), and the administrator panel (Inertia/React) — all served from a single Laravel application, plus the separate mobile app. A total of 68 use cases are organized into 12 functional groups.

### 1.3 Actor Definitions

| Actor | Description |
|-------|-------------|
| **Customer** | Authenticated end user who browses, purchases, and manages their account via mobile or web app. |
| **Guest** | Unauthenticated visitor who can browse products and perform guest checkout. |
| **Admin** | Back-office staff member who manages products, orders, users, inventory, content, and analytics. |
| **System** | Automated processes including token refresh, low-stock alerts, and scheduled tasks. |
| **Payment Gateway** | Stripe payment processing service that handles payments and refunds. |

---

## 2. Use Case Catalog

### 2.1 Authentication & User Management

#### UC-001: User Registration

| Field | Value |
|-------|-------|
| **ID** | UC-001 |
| **Name** | User Registration |
| **Actors** | Guest |
| **Priority** | Must |

**Preconditions:**
- User is on the registration page/screen
- User does not have an existing account

**Main Flow:**
1. User navigates to registration page/screen
2. User enters first name, last name, email, password, and password confirmation
3. System validates all fields in real-time with inline error messages
4. User submits registration form
5. System verifies email is not already registered
6. System creates user account with bcrypt-hashed password
7. System authenticates the user (mobile: issues Sanctum API token; web: creates session)
8. System redirects to home page/view

**Alternate Flows:**
- **A1 — Duplicate Email:** System displays "Email already registered" error; user can navigate to login or try a different email
- **A2 — Validation Failure:** System displays inline error for the invalid field; user corrects input and resubmits

**Postconditions:**
- User account exists in the database
- User is authenticated with active session

**Business Rules:**
- Password must meet minimum strength requirements
- Email must be unique across all users
- All fields are required

**Requirement Traceability:**
- REQ 1.5 (User Authentication)
- REQ 2.4 (Auth Endpoints — POST /api/register)
- REQ 4.2 (Mobile — Registration Screen)
- REQ 6.2 (Web — Registration Page)

---

#### UC-002: User Login

| Field | Value |
|-------|-------|
| **ID** | UC-002 |
| **Name** | User Login |
| **Actors** | Guest, Customer |
| **Priority** | Must |

**Preconditions:**
- User has a registered account
- User is not currently authenticated
- User is on the login page/screen

**Main Flow:**
1. User navigates to login page/screen
2. User enters email address and password
3. System validates fields in real-time
4. User submits login form
5. System verifies credentials using bcrypt hash comparison
6. System authenticates the user (mobile: issues Sanctum API token; web/admin: creates Laravel session)
7. User is redirected to intended page or home page/view

**Alternate Flows:**
- **A1 — Invalid Credentials:** System displays "Invalid email or password" error; user can retry or navigate to password recovery
- **A2 — Account Deactivated:** System displays "Account has been deactivated" error; user is prompted to contact support
- **A3 — Remember Me:** If "Remember me" is selected, session persists beyond browser close

**Postconditions:**
- User is authenticated with active session (mobile: Sanctum API token issued; web/admin: session created)

**Business Rules:**
- Failed login attempts are logged with timestamp and IP
- Passwords compared using bcrypt
- Mobile: tokens stored in secure storage; Web/Admin: session managed by Laravel

**Requirement Traceability:**
- REQ 1.5 (User Authentication)
- REQ 2.4 (Auth Endpoints — POST /api/login)
- REQ 3.5 (Authentication Token Contract)
- REQ 4.1 (Mobile — Login Screen)
- REQ 6.1 (Web — Login Page)

---

#### UC-003: Password Recovery Request

| Field | Value |
|-------|-------|
| **ID** | UC-003 |
| **Name** | Password Recovery Request |
| **Actors** | Guest |
| **Priority** | Must |

**Preconditions:**
- User has a registered account
- User cannot remember their password

**Main Flow:**
1. User navigates to password recovery page/screen
2. User enters their registered email address
3. System validates email format
4. User submits the form
5. System sends a password reset link/code to the email address
6. System displays confirmation message regardless of whether email exists (security)

**Alternate Flows:**
- **A1 — Unregistered Email:** System displays the same confirmation message to prevent account enumeration

**Postconditions:**
- If the email exists, a reset link/code is sent
- Reset link/code has a limited validity period

**Business Rules:**
- Reset tokens expire after a configurable period
- Previous reset tokens are invalidated when a new one is generated

**Requirement Traceability:**
- REQ 2.4 (Auth Endpoints — POST /api/password/reset)
- REQ 4.3 (Mobile — Password Recovery)
- REQ 6.3 (Web — Password Recovery)

---

#### UC-004: Password Reset

| Field | Value |
|-------|-------|
| **ID** | UC-004 |
| **Name** | Password Reset |
| **Actors** | Guest |
| **Priority** | Must |

**Preconditions:**
- User has a valid reset link/code from UC-003

**Main Flow:**
1. User opens the reset link or enters the reset code
2. System validates the reset token
3. User enters new password and password confirmation
4. System validates password strength and match
5. User submits the form
6. System updates the password hash in the database
7. System displays success message; user can now log in

**Alternate Flows:**
- **A1 — Expired Token:** System displays "Reset link has expired" error; user must request a new reset
- **A2 — Invalid Token:** System displays "Invalid reset link" error

**Postconditions:**
- User's password is updated
- All existing sessions are invalidated
- User can log in with the new password

**Requirement Traceability:**
- REQ 2.4 (Auth Endpoints — POST /api/password/reset/confirm)
- REQ 4.3 (Mobile — Password Recovery)
- REQ 6.3 (Web — Password Recovery)

---

#### UC-005: Token Refresh (Mobile Only)

| Field | Value |
|-------|-------|
| **ID** | UC-005 |
| **Name** | Token Refresh |
| **Actors** | System |
| **Priority** | Must |

**Preconditions:**
- Mobile app user has a valid refresh token
- Access token has expired or is about to expire

**Main Flow:**
1. Mobile app detects access token expiration
2. Mobile app sends refresh token to the refresh endpoint
3. System validates the refresh token
4. System issues a new access token
5. Mobile app transparently continues the user's session

**Alternate Flows:**
- **A1 — Expired Refresh Token:** System returns 401; mobile app redirects user to login
- **A2 — Revoked Refresh Token:** System returns 401; mobile app redirects user to login

**Postconditions:**
- New access token is issued
- User session continues without interruption

**Business Rules:**
- Refresh is transparent to the user
- Access tokens are short-lived (15–60 min)
- Refresh tokens are long-lived (7–30 days)
- This use case applies only to the mobile app; the web app and admin panel use session-based authentication managed by Laravel

**Requirement Traceability:**
- REQ 1.5 (User Authentication)
- REQ 2.4 (Auth Endpoints — POST /api/token/refresh)
- REQ 3.5 (Authentication Token Contract)

---

#### UC-006: User Logout

| Field | Value |
|-------|-------|
| **ID** | UC-006 |
| **Name** | User Logout |
| **Actors** | Customer |
| **Priority** | Must |

**Preconditions:**
- User is currently authenticated

**Main Flow:**
1. User selects logout option from profile/menu
2. System ends the user's session (mobile: invalidates access and refresh tokens; web/admin: destroys Laravel session)
3. User is redirected to the login page or home page

**Postconditions:**
- Session is terminated
- Mobile: tokens are invalidated server-side; Web/Admin: session is destroyed

**Requirement Traceability:**
- REQ 2.4 (Auth Endpoints — POST /api/logout)

---

#### UC-007: Update Profile

| Field | Value |
|-------|-------|
| **ID** | UC-007 |
| **Name** | Update Profile |
| **Actors** | Customer |
| **Priority** | Must |

**Preconditions:**
- User is authenticated
- User is on the profile page/screen

**Main Flow:**
1. User navigates to profile settings
2. System displays current profile information (name, email, phone)
3. User edits desired fields
4. System validates changes in real-time
5. User saves changes
6. System persists updated profile data
7. System displays success confirmation

**Alternate Flows:**
- **A1 — Email Change Conflict:** If new email is already registered, system displays an error
- **A2 — Password Change:** User provides current password, new password, and confirmation; system validates and updates

**Postconditions:**
- Profile information is updated in the database

**Business Rules:**
- Password change requires current password
- Email change may require re-verification

**Requirement Traceability:**
- REQ 2.10 (User Profile Endpoints — GET/PUT /api/profile)
- REQ 4.9 (Mobile — User Profile View)
- REQ 6.10 (Web — User Profile Page)

---

#### UC-008: Manage Addresses

| Field | Value |
|-------|-------|
| **ID** | UC-008 |
| **Name** | Manage Addresses |
| **Actors** | Customer |
| **Priority** | Must |

**Preconditions:**
- User is authenticated
- User is on the profile/address management section

**Main Flow:**
1. User navigates to address management
2. System displays saved shipping addresses
3. User adds a new address or edits/deletes an existing one
4. System validates address fields
5. User saves changes
6. System persists the address data
7. User can set a default address

**Alternate Flows:**
- **A1 — Delete Last Address:** System allows deletion; no minimum address requirement
- **A2 — Invalid Address:** System displays validation errors for incomplete fields

**Postconditions:**
- Address list is updated
- Default address setting is persisted

**Requirement Traceability:**
- REQ 2.10 (User Profile Endpoints)
- REQ 4.9 (Mobile — User Profile View)
- REQ 6.10 (Web — User Profile Page)

---

### 2.2 Product Discovery

#### UC-009: Browse Product Catalog

| Field | Value |
|-------|-------|
| **ID** | UC-009 |
| **Name** | Browse Product Catalog |
| **Actors** | Guest, Customer |
| **Priority** | Must |

**Preconditions:**
- User is on the catalog page/view

**Main Flow:**
1. User navigates to the product catalog
2. System retrieves paginated product listing from the API
3. System displays product cards with image, name, price, sale price, and rating
4. User scrolls through products (infinite scroll or pagination)
5. System loads additional products as needed

**Alternate Flows:**
- **A1 — Empty Catalog:** System displays "No products available" with a call-to-action
- **A2 — Loading State:** System displays skeleton loaders during data fetch

**Postconditions:**
- User can see the available product catalog

**Requirement Traceability:**
- REQ 2.5 (Catalog Endpoints — GET /api/products)
- REQ 4.5 (Mobile — Catalog View)
- REQ 6.5 (Web — Catalog Page)

---

#### UC-010: Search Products

| Field | Value |
|-------|-------|
| **ID** | UC-010 |
| **Name** | Search Products |
| **Actors** | Guest, Customer |
| **Priority** | Must |

**Preconditions:**
- Search bar is accessible from the current view

**Main Flow:**
1. User enters keyword(s) in the search bar
2. System displays autocomplete suggestions as the user types
3. User submits the search or selects a suggestion
4. System queries the catalog endpoint with the search term
5. System displays matching products in the catalog view

**Alternate Flows:**
- **A1 — No Results:** System displays "No products found" with suggested alternatives or categories
- **A2 — Empty Search:** System returns all products (default catalog)

**Postconditions:**
- Product listing is filtered by the search term

**Requirement Traceability:**
- REQ 2.5 (Catalog Endpoints)
- REQ 4.4 (Mobile — Home View search bar)
- REQ 4.5 (Mobile — Catalog View keyword search)
- REQ 6.4 (Web — Home Page search bar)
- REQ 6.5 (Web — Catalog Page autocomplete search)

---

#### UC-011: Filter Products

| Field | Value |
|-------|-------|
| **ID** | UC-011 |
| **Name** | Filter Products |
| **Actors** | Guest, Customer |
| **Priority** | Must |

**Preconditions:**
- User is on the catalog page/view

**Main Flow:**
1. User selects filter criteria (category, price range, brand, rating, attributes)
2. System applies filters to the product query
3. System refreshes the product listing with filtered results
4. Active filters are displayed and can be individually removed

**Alternate Flows:**
- **A1 — No Matching Products:** System displays "No products match your filters" with option to clear filters

**Postconditions:**
- Product listing reflects the selected filters

**Requirement Traceability:**
- REQ 2.5 (Catalog Endpoints — filtering by category)
- REQ 4.5 (Mobile — Catalog View category filtering)
- REQ 6.5 (Web — Catalog Page sidebar checkbox filters)

---

#### UC-012: Sort Products

| Field | Value |
|-------|-------|
| **ID** | UC-012 |
| **Name** | Sort Products |
| **Actors** | Guest, Customer |
| **Priority** | Must |

**Preconditions:**
- User is on the catalog page/view with products displayed

**Main Flow:**
1. User selects a sort option (price low-to-high, price high-to-low, newest, popularity, name)
2. System reorders the product listing according to the selected sort
3. System updates the display

**Postconditions:**
- Product listing is sorted by the selected criterion

**Requirement Traceability:**
- REQ 2.5 (Catalog Endpoints — sorting by price, name, date, popularity)
- REQ 4.5 (Mobile — Catalog View sort options)
- REQ 6.5 (Web — Catalog Page sort options)

---

#### UC-013: View Product Details

| Field | Value |
|-------|-------|
| **ID** | UC-013 |
| **Name** | View Product Details |
| **Actors** | Guest, Customer |
| **Priority** | Must |

**Preconditions:**
- User has selected a product from the catalog or search results

**Main Flow:**
1. User taps/clicks on a product card
2. System retrieves full product details from the API
3. System displays: image gallery with zoom, product name, price/sale price, availability status, full description, attributes/variants, quantity selector, "Add to Cart" button, and related products
4. User can navigate through image gallery and view different tabs (Description, Specifications, Reviews on web)

**Alternate Flows:**
- **A1 — Product Unavailable:** System displays "Out of Stock" status; "Add to Cart" button is disabled
- **A2 — Variant Selection:** User selects a variant; system updates price and availability

**Postconditions:**
- User has viewed the complete product information

**Requirement Traceability:**
- REQ 2.6 (Product Detail Endpoint — GET /api/products/{id})
- REQ 4.6 (Mobile — Product Detail View)
- REQ 6.6 (Web — Product Detail Page)

---

#### UC-014: View Related Products

| Field | Value |
|-------|-------|
| **ID** | UC-014 |
| **Name** | View Related Products |
| **Actors** | Guest, Customer |
| **Priority** | Must |

**Preconditions:**
- User is viewing a product detail page/screen

**Main Flow:**
1. System displays related products section/carousel on the product detail page
2. User browses the related products
3. User can tap/click on a related product to view its details

**Postconditions:**
- User can navigate to related product detail pages

**Requirement Traceability:**
- REQ 2.6 (Product Detail Endpoint — related products field)
- REQ 4.6 (Mobile — Product Detail View related products)
- REQ 6.6 (Web — Product Detail Page related products carousel)

---

#### UC-015: Browse Categories

| Field | Value |
|-------|-------|
| **ID** | UC-015 |
| **Name** | Browse Categories |
| **Actors** | Guest, Customer |
| **Priority** | Must |

**Preconditions:**
- User is on the home page or catalog page

**Main Flow:**
1. System displays category navigation (tabs, sidebar, or cards)
2. User selects a category
3. System retrieves products filtered by the selected category
4. System displays the filtered catalog view
5. User can navigate the category hierarchy if sub-categories exist

**Postconditions:**
- Product listing is filtered to the selected category

**Requirement Traceability:**
- REQ 2.5 (Catalog Endpoints — GET /api/categories)
- REQ 4.4 (Mobile — Home View category navigation)
- REQ 6.4 (Web — Home Page category navigation cards)

---

### 2.3 Shopping & Cart

#### UC-016: Add Item to Cart

| Field | Value |
|-------|-------|
| **ID** | UC-016 |
| **Name** | Add Item to Cart |
| **Actors** | Customer, Guest |
| **Priority** | Must |

**Preconditions:**
- User is viewing a product detail page or catalog (web quick add)

**Main Flow:**
1. User selects desired quantity (default: 1)
2. User selects product variant if applicable
3. User taps/clicks "Add to Cart"
4. System adds the item to the cart via the API
5. System updates the cart badge count in the header/tab bar
6. System displays add confirmation (mini cart on web, toast on mobile)

**Alternate Flows:**
- **A1 — Insufficient Stock:** System displays "Only X items available" and limits quantity
- **A2 — Item Already in Cart:** System increases the quantity of the existing cart item

**Postconditions:**
- Item is added to the cart
- Cart badge count is updated

**Business Rules:**
- Cart persists across sessions for authenticated users
- Guest carts are session-based

**Requirement Traceability:**
- REQ 2.7 (Cart Endpoints — POST /api/cart/items)
- REQ 4.6 (Mobile — Product Detail View "Add to Cart")
- REQ 4.7 (Mobile — Cart View)
- REQ 6.6 (Web — Product Detail Page "Add to Cart")
- REQ 6.5 (Web — Catalog Page quick "Add to Cart")

---

#### UC-017: Update Cart Quantity

| Field | Value |
|-------|-------|
| **ID** | UC-017 |
| **Name** | Update Cart Quantity |
| **Actors** | Customer, Guest |
| **Priority** | Must |

**Preconditions:**
- User has items in the cart
- User is viewing the cart

**Main Flow:**
1. User changes the quantity of a cart item (input field or +/- buttons)
2. System validates the new quantity against available stock
3. System updates the item quantity via the API
4. System recalculates and displays updated line subtotal and cart total in real-time

**Alternate Flows:**
- **A1 — Exceeds Stock:** System limits quantity to available stock and shows notification
- **A2 — Zero Quantity:** System treats as a removal (see UC-018)

**Postconditions:**
- Cart item quantity and totals are updated

**Requirement Traceability:**
- REQ 2.7 (Cart Endpoints — PUT /api/cart/items/{id})
- REQ 4.7 (Mobile — Cart View editable quantity)
- REQ 6.7 (Web — Cart Page editable quantity)

---

#### UC-018: Remove Item from Cart

| Field | Value |
|-------|-------|
| **ID** | UC-018 |
| **Name** | Remove Item from Cart |
| **Actors** | Customer, Guest |
| **Priority** | Must |

**Preconditions:**
- User has items in the cart
- User is viewing the cart

**Main Flow:**
1. User taps/clicks the "Remove" action on a cart item
2. System removes the item from the cart via the API
3. System recalculates and displays updated cart total
4. Cart badge count is updated

**Alternate Flows:**
- **A1 — Last Item Removed:** Cart displays empty state with "Continue Shopping" call-to-action

**Postconditions:**
- Item is removed from the cart
- Cart totals and badge are updated

**Requirement Traceability:**
- REQ 2.7 (Cart Endpoints — DELETE /api/cart/items/{id})
- REQ 4.7 (Mobile — Cart View remove action)
- REQ 6.7 (Web — Cart Page remove action)

---

#### UC-019: View Cart

| Field | Value |
|-------|-------|
| **ID** | UC-019 |
| **Name** | View Cart |
| **Actors** | Customer, Guest |
| **Priority** | Must |

**Preconditions:**
- User navigates to the cart

**Main Flow:**
1. User taps/clicks the cart icon or navigates to the cart page/view
2. System retrieves the current cart from the API
3. System displays line items with product image, name, unit price, quantity, and subtotal
4. System displays cart summary: subtotal, estimated tax, estimated shipping, and total
5. User can proceed to checkout or continue shopping

**Alternate Flows:**
- **A1 — Empty Cart:** System displays empty cart state with "Start Shopping" link
- **A2 — Mini Cart (Web):** Hovering/clicking cart icon shows mini cart dropdown with last 3 items, subtotal, and quick links

**Postconditions:**
- User sees the current state of their cart

**Requirement Traceability:**
- REQ 2.7 (Cart Endpoints — GET /api/cart)
- REQ 4.7 (Mobile — Cart View)
- REQ 6.7 (Web — Cart Page)
- REQ 6.8 (Web — Mini Cart)

---

#### UC-020: Clear Cart

| Field | Value |
|-------|-------|
| **ID** | UC-020 |
| **Name** | Clear Cart |
| **Actors** | Customer, Guest |
| **Priority** | Must |

**Preconditions:**
- User has items in the cart

**Main Flow:**
1. User selects "Clear Cart" option
2. System requests confirmation
3. User confirms
4. System removes all items from the cart via the API
5. System displays empty cart state

**Alternate Flows:**
- **A1 — Cancellation:** User cancels; cart remains unchanged

**Postconditions:**
- Cart is empty
- Cart badge shows zero items

**Requirement Traceability:**
- REQ 2.7 (Cart Endpoints — DELETE /api/cart)

---

#### UC-021: Apply Promo Code

| Field | Value |
|-------|-------|
| **ID** | UC-021 |
| **Name** | Apply Promo Code |
| **Actors** | Customer, Guest |
| **Priority** | Should |

**Preconditions:**
- User has items in the cart
- User is on the cart page (web)

**Main Flow:**
1. User enters a coupon/promo code in the input field
2. User applies the code
3. System validates the promo code
4. System applies the discount and recalculates cart totals
5. System displays the discount amount and updated total

**Alternate Flows:**
- **A1 — Invalid Code:** System displays "Invalid promo code" error
- **A2 — Expired Code:** System displays "This promo code has expired"
- **A3 — Minimum Not Met:** System displays "Minimum order amount not met for this code"

**Postconditions:**
- Discount is applied to the cart total

**Requirement Traceability:**
- REQ 6.7 (Web — Cart Page coupon/promo code input)

---

### 2.4 Checkout & Payment

#### UC-022: Enter Shipping Address

| Field | Value |
|-------|-------|
| **ID** | UC-022 |
| **Name** | Enter Shipping Address |
| **Actors** | Customer, Guest |
| **Priority** | Must |

**Preconditions:**
- User has items in the cart
- User has initiated checkout

**Main Flow:**
1. System displays shipping address step
2. Authenticated users see their saved addresses with option to select one
3. User selects a saved address or enters a new address
4. System validates address fields
5. User proceeds to the next step

**Alternate Flows:**
- **A1 — New Address for Authenticated User:** User enters a new address; system offers to save it for future use
- **A2 — Validation Error:** System highlights invalid fields with error messages

**Postconditions:**
- Shipping address is set for the order

**Requirement Traceability:**
- REQ 2.8 (Checkout Endpoint)
- REQ 4.8 (Mobile — Checkout Flow step 1)
- REQ 6.9 (Web — Checkout Page shipping address form)

---

#### UC-023: Select Shipping Method

| Field | Value |
|-------|-------|
| **ID** | UC-023 |
| **Name** | Select Shipping Method |
| **Actors** | Customer, Guest |
| **Priority** | Must |

**Preconditions:**
- Shipping address has been provided (UC-022)

**Main Flow:**
1. System displays available shipping methods with cost and estimated delivery time
2. User selects a shipping method
3. System updates the order total with shipping cost
4. User proceeds to the next step

**Alternate Flows:**
- **A1 — Single Method Available:** System auto-selects the only available method

**Postconditions:**
- Shipping method and cost are set for the order

**Requirement Traceability:**
- REQ 2.8 (Checkout Endpoint — calculate totals with shipping costs)
- REQ 4.8 (Mobile — Checkout Flow step 2)
- REQ 6.9 (Web — Checkout Page shipping method selection)

---

#### UC-024: Enter Payment Information

| Field | Value |
|-------|-------|
| **ID** | UC-024 |
| **Name** | Enter Payment Information |
| **Actors** | Customer, Guest |
| **Priority** | Must |

**Preconditions:**
- Shipping method has been selected (UC-023)

**Main Flow:**
1. System displays payment method section
2. User enters credit card details via Stripe Elements secure form
3. System validates the payment method on the client side
4. User proceeds to review the order

**Alternate Flows:**
- **A1 — Invalid Card:** Payment gateway returns validation error; user corrects card details
- **A2 — Saved Payment (Web):** Authenticated user selects a saved payment method

**Postconditions:**
- Payment method is ready for processing

**Business Rules:**
- Raw credit card data is never stored on application servers (PCI-DSS)
- Payment form is provided by the gateway (Stripe Elements)

**Requirement Traceability:**
- REQ 1.8 (Payment Processing — PCI-DSS compliance)
- REQ 2.8 (Checkout Endpoint — process payment)
- REQ 4.8 (Mobile — Checkout Flow step 3)
- REQ 6.9 (Web — Checkout Page payment section)

---

#### UC-025: Review Order Summary

| Field | Value |
|-------|-------|
| **ID** | UC-025 |
| **Name** | Review Order Summary |
| **Actors** | Customer, Guest |
| **Priority** | Must |

**Preconditions:**
- Payment information has been provided (UC-024)

**Main Flow:**
1. System displays complete order summary: line items, quantities, prices, subtotal, tax, shipping cost, discounts, and grand total
2. System displays shipping address and payment method summary
3. User reviews all order details
4. User accepts terms (checkbox on web)
5. User taps/clicks "Place Order"

**Alternate Flows:**
- **A1 — Edit Previous Step:** User navigates back to change address, shipping, or payment without losing data
- **A2 — Terms Not Accepted (Web):** "Place Order" button remains disabled until terms checkbox is checked

**Postconditions:**
- Order is ready to be placed

**Requirement Traceability:**
- REQ 2.8 (Checkout Endpoint)
- REQ 4.8 (Mobile — Checkout Flow step 4)
- REQ 6.9 (Web — Checkout Page order summary)

---

#### UC-026: Place Order

| Field | Value |
|-------|-------|
| **ID** | UC-026 |
| **Name** | Place Order |
| **Actors** | Customer, Guest, Payment Gateway |
| **Priority** | Must |

**Preconditions:**
- Order has been reviewed (UC-025)
- Payment information is valid

**Main Flow:**
1. User confirms the order placement
2. System validates cart contents against current inventory
3. System calculates final totals with taxes and shipping
4. System sends payment request to the Payment Gateway
5. Payment Gateway processes the payment and returns success
6. System creates the order in the database with status "pending"
7. System clears the cart
8. System redirects to order confirmation (UC-028)

**Alternate Flows:**
- **A1 — Payment Failure:** Payment Gateway returns error; system displays "Payment failed" with option to retry or change payment method
- **A2 — Inventory Changed:** Item is no longer in stock; system displays error and returns user to cart to update
- **A3 — Network Error:** System displays error; order is not created; user can retry

**Postconditions:**
- Order is created with status "pending"
- Payment is captured
- Cart is cleared

**Business Rules:**
- Inventory is validated at the moment of order placement
- Payment is processed through the configured gateway
- Order confirmation email is sent

**Requirement Traceability:**
- REQ 1.8 (Payment Processing)
- REQ 2.8 (Checkout Endpoint — POST /api/checkout)
- REQ 4.8 (Mobile — Checkout Flow step 5)
- REQ 6.9 (Web — Checkout Page "Place Order")

---

#### UC-027: Guest Checkout

| Field | Value |
|-------|-------|
| **ID** | UC-027 |
| **Name** | Guest Checkout |
| **Actors** | Guest |
| **Priority** | Must |

**Preconditions:**
- Guest user has items in the cart
- Guest user is not authenticated

**Main Flow:**
1. Guest user proceeds to checkout from cart
2. System allows checkout without requiring login/registration
3. Guest completes shipping address, shipping method, and payment steps (UC-022 through UC-026)
4. After order confirmation, system offers optional account creation with pre-filled details

**Alternate Flows:**
- **A1 — Guest Creates Account:** Guest provides a password; system creates an account linked to the order
- **A2 — Guest Declines Account:** Guest continues without creating an account

**Postconditions:**
- Order is placed without requiring an account
- If account is created, it is linked to the order

**Requirement Traceability:**
- REQ 2.8 (Checkout Endpoint)
- REQ 6.9 (Web — Checkout Page guest checkout support)

---

#### UC-028: View Order Confirmation

| Field | Value |
|-------|-------|
| **ID** | UC-028 |
| **Name** | View Order Confirmation |
| **Actors** | Customer, Guest |
| **Priority** | Must |

**Preconditions:**
- Order has been successfully placed (UC-026)

**Main Flow:**
1. System displays the order confirmation page/screen
2. System shows: order number, order summary, estimated delivery date, shipping address, and payment summary
3. System sends order confirmation email
4. User can navigate to order history or continue shopping

**Postconditions:**
- User has received order confirmation
- Confirmation email is sent

**Requirement Traceability:**
- REQ 2.9 (Order Endpoints — POST /api/orders)
- REQ 4.8 (Mobile — Checkout Flow confirmation)
- REQ 6.9 (Web — Checkout Page order confirmation)

---

### 2.5 Order Management — Customer

#### UC-029: View Order History

| Field | Value |
|-------|-------|
| **ID** | UC-029 |
| **Name** | View Order History |
| **Actors** | Customer |
| **Priority** | Must |

**Preconditions:**
- User is authenticated
- User navigates to order history

**Main Flow:**
1. User navigates to order history page/view
2. System retrieves the user's orders from the API with pagination
3. System displays order list showing: order number, date, status (with color-coded badge), total amount, and item count
4. User can filter by status or date range
5. User can paginate through orders

**Alternate Flows:**
- **A1 — No Orders:** System displays "No orders yet" with "Start Shopping" link

**Postconditions:**
- User can see their order history

**Requirement Traceability:**
- REQ 2.9 (Order Endpoints — GET /api/orders)
- REQ 4.10 (Mobile — Order History View)
- REQ 6.11 (Web — Order History Page)

---

#### UC-030: View Order Details

| Field | Value |
|-------|-------|
| **ID** | UC-030 |
| **Name** | View Order Details |
| **Actors** | Customer |
| **Priority** | Must |

**Preconditions:**
- User is authenticated
- User has selected an order from order history

**Main Flow:**
1. User taps/clicks on an order from the history list
2. System retrieves order details from the API
3. System displays: all line items with images and prices, order status timeline/history, shipping tracking information with carrier link (if available), order totals breakdown

**Postconditions:**
- User can see full order details

**Requirement Traceability:**
- REQ 2.9 (Order Endpoints — GET /api/orders/{id})
- REQ 4.10 (Mobile — Order History detail view)
- REQ 6.11 (Web — Order History detail page)

---

#### UC-031: Track Order Status

| Field | Value |
|-------|-------|
| **ID** | UC-031 |
| **Name** | Track Order Status |
| **Actors** | Customer |
| **Priority** | Must |

**Preconditions:**
- User is viewing order details
- Order has been shipped

**Main Flow:**
1. System displays order status timeline (pending → processing → shipped → delivered)
2. System displays current status with timestamp
3. If tracking number is available, system displays tracking number and carrier link
4. User can click tracking link to view carrier's tracking page

**Alternate Flows:**
- **A1 — No Tracking Yet:** System displays "Tracking information will be available once the order ships"

**Postconditions:**
- User can track their order status and shipment

**Requirement Traceability:**
- REQ 2.9 (Order Endpoints — status history, shipping information)
- REQ 4.10 (Mobile — Order History shipping tracking)
- REQ 6.11 (Web — Order History tracking with carrier link)

---

#### UC-032: Reorder Previous Order

| Field | Value |
|-------|-------|
| **ID** | UC-032 |
| **Name** | Reorder Previous Order |
| **Actors** | Customer |
| **Priority** | Must |

**Preconditions:**
- User is viewing order details of a past order

**Main Flow:**
1. User taps/clicks the "Reorder" button
2. System adds all items from the previous order to the current cart
3. System validates stock availability for each item
4. System redirects user to the cart view

**Alternate Flows:**
- **A1 — Item Unavailable:** System adds available items and notifies the user about unavailable items
- **A2 — Item Price Changed:** System adds items at current prices and notifies user of price changes

**Postconditions:**
- Cart contains the items from the previous order (subject to availability)

**Requirement Traceability:**
- REQ 4.10 (Mobile — Order History reorder option)
- REQ 6.11 (Web — Order History reorder button)

---

#### UC-033: Download Invoice

| Field | Value |
|-------|-------|
| **ID** | UC-033 |
| **Name** | Download Invoice |
| **Actors** | Customer |
| **Priority** | Should |

**Preconditions:**
- User is viewing order details
- Order has been delivered or is in progress

**Main Flow:**
1. User clicks the "Download Invoice" link on the order detail page
2. System generates or retrieves the invoice PDF
3. Browser downloads the invoice file

**Postconditions:**
- User has a copy of the order invoice

**Requirement Traceability:**
- REQ 6.11 (Web — Order History invoice download option)

---

### 2.6 Admin: Product Management

#### UC-034: Create Product

| Field | Value |
|-------|-------|
| **ID** | UC-034 |
| **Name** | Create Product |
| **Actors** | Admin |
| **Priority** | Must |

**Preconditions:**
- Admin is authenticated with administrator role
- Admin is on the product management page

**Main Flow:**
1. Admin clicks "Create Product"
2. System displays the product creation form
3. Admin enters: name, description, price, sale price, SKU, categories, attributes, and inventory quantity
4. Admin uploads product images via drag-and-drop
5. System validates all fields
6. Admin saves the product
7. System creates the product and displays success confirmation

**Alternate Flows:**
- **A1 — Duplicate SKU:** System displays "SKU already exists" error
- **A2 — Validation Error:** System highlights invalid fields

**Postconditions:**
- New product is created and visible in the catalog

**Business Rules:**
- Requires administrator role
- Product images served via CDN

**Requirement Traceability:**
- REQ 5.2 (Admin Panel — Product Management)

---

#### UC-035: Edit Product

| Field | Value |
|-------|-------|
| **ID** | UC-035 |
| **Name** | Edit Product |
| **Actors** | Admin |
| **Priority** | Must |

**Preconditions:**
- Admin is authenticated with administrator role
- Product exists in the system

**Main Flow:**
1. Admin selects a product from the product list
2. System displays the product edit form with current values
3. Admin modifies desired fields
4. System validates changes
5. Admin saves the updated product
6. System updates the product

**Postconditions:**
- Product is updated in the catalog

**Requirement Traceability:**
- REQ 5.2 (Admin Panel — Product Management)

---

#### UC-036: Delete Product

| Field | Value |
|-------|-------|
| **ID** | UC-036 |
| **Name** | Delete Product |
| **Actors** | Admin |
| **Priority** | Must |

**Preconditions:**
- Admin is authenticated with administrator role
- Product exists in the system

**Main Flow:**
1. Admin selects a product and clicks "Delete" or "Archive"
2. System displays confirmation dialog
3. Admin confirms deletion
4. System deletes/archives the product
5. System displays success confirmation

**Alternate Flows:**
- **A1 — Cancel:** Admin cancels; product remains unchanged
- **A2 — Product in Active Orders:** System warns that the product has pending orders

**Postconditions:**
- Product is removed/archived from the catalog

**Requirement Traceability:**
- REQ 5.2 (Admin Panel — Product Management)

---

#### UC-037: Bulk Import Products

| Field | Value |
|-------|-------|
| **ID** | UC-037 |
| **Name** | Bulk Import Products |
| **Actors** | Admin |
| **Priority** | Must |

**Preconditions:**
- Admin is authenticated with administrator role
- Admin has a CSV file with product data

**Main Flow:**
1. Admin clicks "Import Products"
2. System displays the import dialog with CSV format requirements
3. Admin uploads a CSV file
4. System parses and validates the CSV data
5. System displays a preview of the import with any validation errors
6. Admin confirms the import
7. System creates/updates products from the CSV data
8. System displays import summary with success and error counts

**Alternate Flows:**
- **A1 — Invalid CSV Format:** System displays format errors and rejects the file
- **A2 — Partial Failure:** System imports valid rows and reports failed rows with reasons

**Postconditions:**
- Products from the CSV are created/updated in the catalog

**Requirement Traceability:**
- REQ 5.2 (Admin Panel — Product Management bulk import)

---

#### UC-038: Bulk Export Products

| Field | Value |
|-------|-------|
| **ID** | UC-038 |
| **Name** | Bulk Export Products |
| **Actors** | Admin |
| **Priority** | Should |

**Preconditions:**
- Admin is authenticated with administrator role

**Main Flow:**
1. Admin clicks "Export Products"
2. Admin optionally selects filters (category, status)
3. System generates a CSV file with product data
4. Browser downloads the CSV file

**Postconditions:**
- Admin has a CSV export of product data

**Requirement Traceability:**
- REQ 5.2 (Admin Panel — Product Management CSV export)

---

#### UC-039: Upload Product Images

| Field | Value |
|-------|-------|
| **ID** | UC-039 |
| **Name** | Upload Product Images |
| **Actors** | Admin |
| **Priority** | Must |

**Preconditions:**
- Admin is creating or editing a product

**Main Flow:**
1. Admin drags and drops images into the upload area or clicks to browse
2. System uploads images and generates CDN URLs in multiple resolutions (thumbnail, medium, full)
3. System displays image previews
4. Admin can reorder images or set a primary image
5. Admin can delete individual images

**Postconditions:**
- Product images are uploaded and available via CDN

**Requirement Traceability:**
- REQ 3.2 (Image Asset Delivery — CDN, multiple resolutions)
- REQ 5.2 (Admin Panel — Product Management drag-and-drop upload)

---

### 2.7 Admin: Category Management

#### UC-040: Create Category

| Field | Value |
|-------|-------|
| **ID** | UC-040 |
| **Name** | Create Category |
| **Actors** | Admin |
| **Priority** | Should |

**Preconditions:**
- Admin is authenticated with administrator role

**Main Flow:**
1. Admin clicks "Create Category"
2. Admin enters category name and optional parent category
3. System validates the category name
4. Admin saves the category
5. System creates the category and updates the hierarchy

**Postconditions:**
- New category is created in the hierarchy

**Requirement Traceability:**
- REQ 5.3 (Admin Panel — Category Management)

---

#### UC-041: Edit Category

| Field | Value |
|-------|-------|
| **ID** | UC-041 |
| **Name** | Edit Category |
| **Actors** | Admin |
| **Priority** | Should |

**Preconditions:**
- Admin is authenticated with administrator role
- Category exists in the system

**Main Flow:**
1. Admin selects a category from the hierarchy
2. System displays category edit form
3. Admin modifies name, parent, or display order
4. Admin saves changes
5. System updates the category

**Postconditions:**
- Category is updated

**Requirement Traceability:**
- REQ 5.3 (Admin Panel — Category Management)

---

#### UC-042: Delete Category

| Field | Value |
|-------|-------|
| **ID** | UC-042 |
| **Name** | Delete Category |
| **Actors** | Admin |
| **Priority** | Should |

**Preconditions:**
- Admin is authenticated with administrator role
- Category exists in the system

**Main Flow:**
1. Admin selects a category and clicks "Delete"
2. System displays confirmation with warning about affected products
3. Admin confirms deletion
4. System removes the category and re-assigns or orphans child categories/products

**Alternate Flows:**
- **A1 — Category Has Products:** System warns and offers to re-assign products to another category

**Postconditions:**
- Category is deleted from the hierarchy

**Requirement Traceability:**
- REQ 5.3 (Admin Panel — Category Management)

---

#### UC-043: Arrange Category Hierarchy

| Field | Value |
|-------|-------|
| **ID** | UC-043 |
| **Name** | Arrange Category Hierarchy |
| **Actors** | Admin |
| **Priority** | Should |

**Preconditions:**
- Admin is authenticated with administrator role
- Multiple categories exist

**Main Flow:**
1. System displays the category tree structure
2. Admin drags and drops categories to reorder or re-parent them
3. System updates the display order and hierarchy
4. Changes are saved automatically or on confirmation

**Postconditions:**
- Category hierarchy and display order are updated

**Requirement Traceability:**
- REQ 5.3 (Admin Panel — Category Management hierarchical tree, drag-and-drop reordering)

---

#### UC-044: Toggle Category Visibility

| Field | Value |
|-------|-------|
| **ID** | UC-044 |
| **Name** | Toggle Category Visibility |
| **Actors** | Admin |
| **Priority** | Should |

**Preconditions:**
- Admin is authenticated with administrator role
- Category exists in the system

**Main Flow:**
1. Admin toggles the visibility switch on a category
2. System updates the category visibility
3. Hidden categories are no longer visible on customer-facing apps

**Postconditions:**
- Category visibility is updated across all customer-facing apps

**Requirement Traceability:**
- REQ 5.3 (Admin Panel — Category Management visibility toggle)

---

### 2.8 Admin: Order Management

#### UC-045: View All Orders

| Field | Value |
|-------|-------|
| **ID** | UC-045 |
| **Name** | View All Orders |
| **Actors** | Admin |
| **Priority** | Must |

**Preconditions:**
- Admin is authenticated with administrator role

**Main Flow:**
1. Admin navigates to order management
2. System retrieves all orders with pagination
3. System displays order list: order number, customer name, date, status, total amount
4. Admin can sort by date, status, or amount

**Postconditions:**
- Admin can see all system orders

**Requirement Traceability:**
- REQ 5.4 (Admin Panel — Order Management)

---

#### UC-046: Filter Orders

| Field | Value |
|-------|-------|
| **ID** | UC-046 |
| **Name** | Filter Orders |
| **Actors** | Admin |
| **Priority** | Must |

**Preconditions:**
- Admin is on the order management page

**Main Flow:**
1. Admin applies filters: status, date range, customer name/email, amount range
2. System queries with filter parameters
3. System refreshes the order list with filtered results
4. Active filters are displayed and can be cleared

**Postconditions:**
- Order list reflects applied filters

**Requirement Traceability:**
- REQ 5.4 (Admin Panel — Order Management filtering)

---

#### UC-047: View Order Details (Admin)

| Field | Value |
|-------|-------|
| **ID** | UC-047 |
| **Name** | View Order Details (Admin) |
| **Actors** | Admin |
| **Priority** | Must |

**Preconditions:**
- Admin has selected an order from the list

**Main Flow:**
1. Admin clicks on an order
2. System retrieves order details
3. System displays: customer information, all line items, payment details, status history, shipping information, and internal notes

**Postconditions:**
- Admin has full visibility into the order

**Requirement Traceability:**
- REQ 5.4 (Admin Panel — Order Management)

---

#### UC-048: Update Order Status

| Field | Value |
|-------|-------|
| **ID** | UC-048 |
| **Name** | Update Order Status |
| **Actors** | Admin |
| **Priority** | Must |

**Preconditions:**
- Admin is viewing order details
- Order has valid next status transitions

**Main Flow:**
1. Admin selects the new status from the defined workflow (pending → processing → shipped → delivered)
2. System validates the status transition
3. Admin confirms the change
4. System updates the order status
5. System records the status change in the order history

**Alternate Flows:**
- **A1 — Invalid Transition:** System prevents invalid status transitions (e.g., pending → delivered)

**Postconditions:**
- Order status is updated
- Status change is recorded in history

**Business Rules:**
- Status transitions follow the defined workflow
- All status changes are logged with timestamp and admin ID

**Requirement Traceability:**
- REQ 5.4 (Admin Panel — Order Management status workflow)

---

#### UC-049: Add Tracking Number

| Field | Value |
|-------|-------|
| **ID** | UC-049 |
| **Name** | Add Tracking Number |
| **Actors** | Admin |
| **Priority** | Must |

**Preconditions:**
- Admin is viewing order details
- Order status is "processing" or "shipped"

**Main Flow:**
1. Admin enters a tracking number and selects the shipping carrier
2. System validates the tracking number format
3. Admin saves the tracking information
4. System updates the order with tracking data
5. If order status is "processing," system may auto-update to "shipped"

**Postconditions:**
- Tracking information is associated with the order
- Customer can view tracking in their order details

**Requirement Traceability:**
- REQ 5.4 (Admin Panel — Order Management add tracking numbers)

---

#### UC-050: Process Refund

| Field | Value |
|-------|-------|
| **ID** | UC-050 |
| **Name** | Process Refund |
| **Actors** | Admin, Payment Gateway |
| **Priority** | Must |

**Preconditions:**
- Admin is viewing order details
- Order has been paid

**Main Flow:**
1. Admin clicks "Process Refund"
2. System displays refund form: full or partial refund amount
3. Admin enters the refund amount and reason
4. Admin confirms the refund
5. System sends refund request to the Payment Gateway
6. Payment Gateway processes the refund and returns success
7. System updates the order status and records the refund

**Alternate Flows:**
- **A1 — Refund Exceeds Paid Amount:** System prevents refund amount from exceeding the order total
- **A2 — Gateway Failure:** System displays error; admin can retry
- **A3 — Partial Refund:** Only the specified amount is refunded; order remains active

**Postconditions:**
- Refund is processed through the payment gateway
- Order records are updated with refund details

**Requirement Traceability:**
- REQ 1.8 (Payment Processing)
- REQ 5.4 (Admin Panel — Order Management refunds)

---

#### UC-051: Add Order Notes

| Field | Value |
|-------|-------|
| **ID** | UC-051 |
| **Name** | Add Order Notes |
| **Actors** | Admin |
| **Priority** | Should |

**Preconditions:**
- Admin is viewing order details

**Main Flow:**
1. Admin enters a note in the internal notes section
2. Admin saves the note
3. System records the note with timestamp and admin ID
4. Note is visible to other admins viewing the order

**Postconditions:**
- Internal note is attached to the order

**Business Rules:**
- Notes are internal only and not visible to customers

**Requirement Traceability:**
- REQ 5.4 (Admin Panel — Order Management internal notes)

---

### 2.9 Admin: User Management

#### UC-052: View All Users

| Field | Value |
|-------|-------|
| **ID** | UC-052 |
| **Name** | View All Users |
| **Actors** | Admin |
| **Priority** | Must |

**Preconditions:**
- Admin is authenticated with administrator role

**Main Flow:**
1. Admin navigates to user management
2. System retrieves all registered users with pagination
3. System displays user list: name, email, role, status, registration date
4. Admin can sort by name, date, or role

**Postconditions:**
- Admin can see all registered users

**Requirement Traceability:**
- REQ 5.5 (Admin Panel — User Management)

---

#### UC-053: Search Users

| Field | Value |
|-------|-------|
| **ID** | UC-053 |
| **Name** | Search Users |
| **Actors** | Admin |
| **Priority** | Must |

**Preconditions:**
- Admin is on the user management page

**Main Flow:**
1. Admin enters search criteria (name, email, or other filters)
2. System queries with search parameters
3. System displays matching users

**Postconditions:**
- User list is filtered by search criteria

**Requirement Traceability:**
- REQ 5.5 (Admin Panel — User Management search)

---

#### UC-054: View User Details

| Field | Value |
|-------|-------|
| **ID** | UC-054 |
| **Name** | View User Details |
| **Actors** | Admin |
| **Priority** | Must |

**Preconditions:**
- Admin has selected a user from the list

**Main Flow:**
1. Admin clicks on a user
2. System retrieves user details
3. System displays: personal information, account status, role, registration date, order history, and activity summary

**Postconditions:**
- Admin has full visibility into the user account

**Requirement Traceability:**
- REQ 5.5 (Admin Panel — User Management user details)

---

#### UC-055: Activate/Deactivate User Account

| Field | Value |
|-------|-------|
| **ID** | UC-055 |
| **Name** | Activate/Deactivate User Account |
| **Actors** | Admin |
| **Priority** | Must |

**Preconditions:**
- Admin is viewing user details

**Main Flow:**
1. Admin clicks "Deactivate" or "Activate" on a user account
2. System displays confirmation dialog
3. Admin confirms the action
4. System updates the account status
5. Change takes immediate effect

**Alternate Flows:**
- **A1 — Self-Deactivation Prevention:** System prevents admin from deactivating their own account

**Postconditions:**
- User account status is updated
- Deactivated users cannot log in

**Requirement Traceability:**
- REQ 5.5 (Admin Panel — User Management activate/deactivate)

---

#### UC-056: Assign User Roles

| Field | Value |
|-------|-------|
| **ID** | UC-056 |
| **Name** | Assign User Roles |
| **Actors** | Admin |
| **Priority** | Must |

**Preconditions:**
- Admin is viewing user details
- Admin has appropriate permissions (super-admin for role changes)

**Main Flow:**
1. Admin selects a new role for the user (customer, administrator, super-admin)
2. System displays confirmation dialog
3. Admin confirms the role change
4. System updates the user role
5. Role change takes effect on the user's next token refresh

**Alternate Flows:**
- **A1 — Insufficient Permissions:** Only super-admin can promote to admin or super-admin roles

**Postconditions:**
- User role is updated
- Permissions change on next login

**Requirement Traceability:**
- REQ 1.6 (Role-Based Access Control)
- REQ 5.5 (Admin Panel — User Management role assignment)

---

#### UC-057: Send Password Reset Email

| Field | Value |
|-------|-------|
| **ID** | UC-057 |
| **Name** | Send Password Reset Email |
| **Actors** | Admin |
| **Priority** | Should |

**Preconditions:**
- Admin is viewing user details

**Main Flow:**
1. Admin clicks "Send Password Reset"
2. System sends a password reset email to the user
3. System displays confirmation that the email was sent

**Postconditions:**
- User receives a password reset email

**Requirement Traceability:**
- REQ 5.5 (Admin Panel — User Management password reset emails)

---

### 2.10 Admin: Inventory Management

#### UC-058: View Inventory Levels

| Field | Value |
|-------|-------|
| **ID** | UC-058 |
| **Name** | View Inventory Levels |
| **Actors** | Admin |
| **Priority** | Should |

**Preconditions:**
- Admin is authenticated with administrator role

**Main Flow:**
1. Admin navigates to inventory management
2. System retrieves inventory data
3. System displays all products with current stock quantities
4. Products below low-stock threshold are highlighted
5. Admin can sort by stock level, product name, or category

**Postconditions:**
- Admin has visibility into current inventory levels

**Requirement Traceability:**
- REQ 5.6 (Admin Panel — Inventory Management)

---

#### UC-059: Update Stock Quantity

| Field | Value |
|-------|-------|
| **ID** | UC-059 |
| **Name** | Update Stock Quantity |
| **Actors** | Admin |
| **Priority** | Should |

**Preconditions:**
- Admin is viewing inventory levels

**Main Flow:**
1. Admin selects a product
2. Admin enters the new stock quantity
3. System validates the quantity
4. Admin saves the change
5. System updates the inventory
6. System records the adjustment in inventory history

**Postconditions:**
- Stock quantity is updated
- Adjustment is logged in history

**Requirement Traceability:**
- REQ 5.6 (Admin Panel — Inventory Management)

---

#### UC-060: Bulk Update Inventory

| Field | Value |
|-------|-------|
| **ID** | UC-060 |
| **Name** | Bulk Update Inventory |
| **Actors** | Admin |
| **Priority** | Should |

**Preconditions:**
- Admin is on the inventory management page

**Main Flow:**
1. Admin selects multiple products
2. Admin enters stock adjustment quantities
3. System validates all entries
4. Admin confirms the bulk update
5. System applies all updates
6. System displays update summary

**Alternate Flows:**
- **A1 — Partial Failure:** System applies successful updates and reports failures

**Postconditions:**
- Stock quantities are updated for all selected products

**Requirement Traceability:**
- REQ 5.6 (Admin Panel — Inventory Management bulk updates)

---

#### UC-061: Configure Low-Stock Alerts

| Field | Value |
|-------|-------|
| **ID** | UC-061 |
| **Name** | Configure Low-Stock Alerts |
| **Actors** | Admin, System |
| **Priority** | Should |

**Preconditions:**
- Admin is on the inventory management page

**Main Flow:**
1. Admin configures the low-stock threshold for products (globally or per-product)
2. System saves the threshold configuration
3. System monitors inventory levels against thresholds
4. When a product falls below the threshold, system highlights it on the dashboard and inventory views

**Postconditions:**
- Low-stock thresholds are configured
- Products below thresholds are highlighted

**Requirement Traceability:**
- REQ 5.6 (Admin Panel — Inventory Management low-stock highlighting)

---

#### UC-062: View Inventory History

| Field | Value |
|-------|-------|
| **ID** | UC-062 |
| **Name** | View Inventory History |
| **Actors** | Admin |
| **Priority** | Should |

**Preconditions:**
- Admin is on the inventory management page

**Main Flow:**
1. Admin selects a product to view its inventory history
2. System displays adjustment history: date, quantity change, reason, and admin who made the change
3. Admin can filter by date range

**Postconditions:**
- Admin can see the full inventory adjustment history for a product

**Requirement Traceability:**
- REQ 5.6 (Admin Panel — Inventory Management adjustment history with reason tracking)

---

### 2.11 Admin: Content Management

#### UC-063: Manage Featured Products

| Field | Value |
|-------|-------|
| **ID** | UC-063 |
| **Name** | Manage Featured Products |
| **Actors** | Admin |
| **Priority** | Could |

**Preconditions:**
- Admin is authenticated with administrator role

**Main Flow:**
1. Admin navigates to content management
2. System displays current featured products
3. Admin adds, removes, or reorders featured products
4. Admin saves changes
5. Featured products are reflected on customer-facing home pages

**Postconditions:**
- Home page featured products are updated

**Requirement Traceability:**
- REQ 5.7 (Admin Panel — Content Management featured products)

---

#### UC-064: Manage Promotional Banners

| Field | Value |
|-------|-------|
| **ID** | UC-064 |
| **Name** | Manage Promotional Banners |
| **Actors** | Admin |
| **Priority** | Could |

**Preconditions:**
- Admin is authenticated with administrator role

**Main Flow:**
1. Admin navigates to banner management
2. System displays current banners/hero slider content
3. Admin creates, edits, or removes banners with images and links
4. Admin sets display order and active dates
5. Admin saves changes
6. Banners are reflected on customer-facing home pages

**Postconditions:**
- Promotional banners are updated on home pages

**Requirement Traceability:**
- REQ 5.7 (Admin Panel — Content Management promotional banners and display order)

---

#### UC-065: Edit Static Pages

| Field | Value |
|-------|-------|
| **ID** | UC-065 |
| **Name** | Edit Static Pages |
| **Actors** | Admin |
| **Priority** | Could |

**Preconditions:**
- Admin is authenticated with administrator role

**Main Flow:**
1. Admin navigates to static page management
2. System displays list of static pages (About, FAQ, Terms, Privacy Policy)
3. Admin selects a page to edit
4. System displays the page content in an editor
5. Admin edits the content
6. Admin publishes the changes
7. Updated content is live on the website

**Postconditions:**
- Static page content is updated and published

**Requirement Traceability:**
- REQ 5.7 (Admin Panel — Content Management static pages)

---

### 2.12 Admin: Analytics

#### UC-066: View Dashboard Metrics

| Field | Value |
|-------|-------|
| **ID** | UC-066 |
| **Name** | View Dashboard Metrics |
| **Actors** | Admin |
| **Priority** | Should |

**Preconditions:**
- Admin is authenticated with administrator role

**Main Flow:**
1. Admin navigates to the admin dashboard
2. System retrieves aggregated metrics
3. System displays: daily/weekly/monthly sales totals with trend comparisons, order counts grouped by status, new user registration count, low-stock product alerts, and recent order activity feed
4. Data refreshes within a 5-minute window

**Postconditions:**
- Admin has an at-a-glance view of business health

**Requirement Traceability:**
- REQ 5.1 (Admin Panel — Admin Dashboard)

---

#### UC-067: View Sales Reports

| Field | Value |
|-------|-------|
| **ID** | UC-067 |
| **Name** | View Sales Reports |
| **Actors** | Admin |
| **Priority** | Should |

**Preconditions:**
- Admin is on the dashboard

**Main Flow:**
1. Admin views sales totals section
2. System displays daily, weekly, and monthly sales totals
3. System shows trend comparison (e.g., percentage change from previous period)
4. Admin can toggle between time periods

**Postconditions:**
- Admin can analyze sales trends

**Requirement Traceability:**
- REQ 5.1 (Admin Panel — Admin Dashboard sales with trend comparison)

---

#### UC-068: View Top Products

| Field | Value |
|-------|-------|
| **ID** | UC-068 |
| **Name** | View Top Products |
| **Actors** | Admin |
| **Priority** | Should |

**Preconditions:**
- Admin is on the dashboard

**Main Flow:**
1. Admin views the top products section
2. System displays the top 10 best-selling products
3. Admin can see product name, units sold, and revenue generated

**Postconditions:**
- Admin can identify best-performing products

**Requirement Traceability:**
- REQ 5.1 (Admin Panel — Admin Dashboard top 10 best-selling products)

---

## 3. Traceability Matrix

### 3.1 Use Case to Requirement Mapping

| Use Case | Requirements |
|----------|-------------|
| UC-001 User Registration | 1.5, 2.4, 4.2, 6.2 |
| UC-002 User Login | 1.5, 2.4, 3.5, 4.1, 6.1 |
| UC-003 Password Recovery Request | 2.4, 4.3, 6.3 |
| UC-004 Password Reset | 2.4, 4.3, 6.3 |
| UC-005 Token Refresh | 1.5, 2.4, 3.5 |
| UC-006 User Logout | 2.4 |
| UC-007 Update Profile | 2.10, 4.9, 6.10 |
| UC-008 Manage Addresses | 2.10, 4.9, 6.10 |
| UC-009 Browse Product Catalog | 2.5, 4.5, 6.5 |
| UC-010 Search Products | 2.5, 4.4, 4.5, 6.4, 6.5 |
| UC-011 Filter Products | 2.5, 4.5, 6.5 |
| UC-012 Sort Products | 2.5, 4.5, 6.5 |
| UC-013 View Product Details | 2.6, 4.6, 6.6 |
| UC-014 View Related Products | 2.6, 4.6, 6.6 |
| UC-015 Browse Categories | 2.5, 4.4, 6.4 |
| UC-016 Add Item to Cart | 2.7, 4.6, 4.7, 6.5, 6.6 |
| UC-017 Update Cart Quantity | 2.7, 4.7, 6.7 |
| UC-018 Remove Item from Cart | 2.7, 4.7, 6.7 |
| UC-019 View Cart | 2.7, 4.7, 6.7, 6.8 |
| UC-020 Clear Cart | 2.7 |
| UC-021 Apply Promo Code | 6.7 |
| UC-022 Enter Shipping Address | 2.8, 4.8, 6.9 |
| UC-023 Select Shipping Method | 2.8, 4.8, 6.9 |
| UC-024 Enter Payment Information | 1.8, 2.8, 4.8, 6.9 |
| UC-025 Review Order Summary | 2.8, 4.8, 6.9 |
| UC-026 Place Order | 1.8, 2.8, 4.8, 6.9 |
| UC-027 Guest Checkout | 2.8, 6.9 |
| UC-028 View Order Confirmation | 2.9, 4.8, 6.9 |
| UC-029 View Order History | 2.9, 4.10, 6.11 |
| UC-030 View Order Details | 2.9, 4.10, 6.11 |
| UC-031 Track Order Status | 2.9, 4.10, 6.11 |
| UC-032 Reorder Previous Order | 4.10, 6.11 |
| UC-033 Download Invoice | 6.11 |
| UC-034 Create Product | 2.11, 5.2 |
| UC-035 Edit Product | 2.11, 5.2 |
| UC-036 Delete Product | 2.11, 5.2 |
| UC-037 Bulk Import Products | 2.11, 5.2 |
| UC-038 Bulk Export Products | 5.2 |
| UC-039 Upload Product Images | 3.2, 5.2 |
| UC-040 Create Category | 5.3 |
| UC-041 Edit Category | 5.3 |
| UC-042 Delete Category | 5.3 |
| UC-043 Arrange Category Hierarchy | 5.3 |
| UC-044 Toggle Category Visibility | 5.3 |
| UC-045 View All Orders | 2.12, 5.4 |
| UC-046 Filter Orders | 2.12, 5.4 |
| UC-047 View Order Details (Admin) | 2.12, 5.4 |
| UC-048 Update Order Status | 2.12, 5.4 |
| UC-049 Add Tracking Number | 5.4 |
| UC-050 Process Refund | 1.8, 2.12, 5.4 |
| UC-051 Add Order Notes | 5.4 |
| UC-052 View All Users | 2.13, 5.5 |
| UC-053 Search Users | 2.13, 5.5 |
| UC-054 View User Details | 2.13, 5.5 |
| UC-055 Activate/Deactivate Account | 2.13, 5.5 |
| UC-056 Assign User Roles | 1.6, 2.13, 5.5 |
| UC-057 Send Password Reset Email | 5.5 |
| UC-058 View Inventory Levels | 2.14, 5.6 |
| UC-059 Update Stock Quantity | 2.14, 5.6 |
| UC-060 Bulk Update Inventory | 5.6 |
| UC-061 Configure Low-Stock Alerts | 2.14, 5.6 |
| UC-062 View Inventory History | 5.6 |
| UC-063 Manage Featured Products | 5.7 |
| UC-064 Manage Promotional Banners | 5.7 |
| UC-065 Edit Static Pages | 5.7 |
| UC-066 View Dashboard Metrics | 2.15, 5.1 |
| UC-067 View Sales Reports | 2.15, 5.1 |
| UC-068 View Top Products | 2.15, 5.1 |

### 3.2 Requirement to Use Case Mapping

| Requirement | Use Cases |
|-------------|-----------|
| REQ 1.5 User Authentication | UC-001, UC-002, UC-005 |
| REQ 1.6 Role-Based Access Control | UC-056 |
| REQ 1.8 Payment Processing | UC-024, UC-026, UC-050 |
| REQ 2.4 Auth Endpoints | UC-001, UC-002, UC-003, UC-004, UC-005, UC-006 |
| REQ 2.5 Catalog Endpoints | UC-009, UC-010, UC-011, UC-012, UC-015 |
| REQ 2.6 Product Detail Endpoint | UC-013, UC-014 |
| REQ 2.7 Cart Endpoints | UC-016, UC-017, UC-018, UC-019, UC-020 |
| REQ 2.8 Checkout Endpoint | UC-022, UC-023, UC-024, UC-025, UC-026, UC-027 |
| REQ 2.9 Order Endpoints | UC-028, UC-029, UC-030, UC-031 |
| REQ 2.10 User Profile Endpoints | UC-007, UC-008 |
| REQ 3.2 Image Asset Delivery | UC-039 |
| REQ 3.5 Auth Token Contract | UC-002, UC-005 |
| REQ 4.1 Login Screen | UC-002 |
| REQ 4.2 Registration Screen | UC-001 |
| REQ 4.3 Password Recovery | UC-003, UC-004 |
| REQ 4.4 Home View | UC-010, UC-015 |
| REQ 4.5 Catalog View | UC-009, UC-010, UC-011, UC-012 |
| REQ 4.6 Product Detail View | UC-013, UC-014, UC-016 |
| REQ 4.7 Cart View | UC-016, UC-017, UC-018, UC-019 |
| REQ 4.8 Checkout Flow | UC-022, UC-023, UC-024, UC-025, UC-026, UC-028 |
| REQ 4.9 User Profile View | UC-007, UC-008 |
| REQ 4.10 Order History View | UC-029, UC-030, UC-031, UC-032 |
| REQ 5.1 Admin Dashboard | UC-066, UC-067, UC-068 |
| REQ 5.2 Product Management | UC-034, UC-035, UC-036, UC-037, UC-038, UC-039 |
| REQ 5.3 Category Management | UC-040, UC-041, UC-042, UC-043, UC-044 |
| REQ 5.4 Order Management | UC-045, UC-046, UC-047, UC-048, UC-049, UC-050, UC-051 |
| REQ 5.5 User Management | UC-052, UC-053, UC-054, UC-055, UC-056, UC-057 |
| REQ 5.6 Inventory Management | UC-058, UC-059, UC-060, UC-061, UC-062 |
| REQ 5.7 Content Management | UC-063, UC-064, UC-065 |
| REQ 6.1 Web Login Page | UC-002 |
| REQ 6.2 Web Registration Page | UC-001 |
| REQ 6.3 Web Password Recovery | UC-003, UC-004 |
| REQ 6.4 Web Home Page | UC-010, UC-015 |
| REQ 6.5 Web Catalog Page | UC-009, UC-010, UC-011, UC-012, UC-016 |
| REQ 6.6 Web Product Detail Page | UC-013, UC-014, UC-016 |
| REQ 6.7 Web Cart Page | UC-017, UC-018, UC-019, UC-021 |
| REQ 6.8 Web Mini Cart | UC-019 |
| REQ 6.9 Web Checkout Page | UC-022, UC-023, UC-024, UC-025, UC-026, UC-027, UC-028 |
| REQ 6.10 Web User Profile Page | UC-007, UC-008 |
| REQ 6.11 Web Order History Page | UC-029, UC-030, UC-031, UC-032, UC-033 |

---

## 4. Use Case Summary

| Group | Count | Must | Should | Could |
|-------|-------|------|--------|-------|
| Authentication & User Management | 8 | 8 | 0 | 0 |
| Product Discovery | 7 | 7 | 0 | 0 |
| Shopping & Cart | 6 | 5 | 1 | 0 |
| Checkout & Payment | 7 | 7 | 0 | 0 |
| Order Management — Customer | 5 | 4 | 1 | 0 |
| Admin: Product Management | 6 | 5 | 1 | 0 |
| Admin: Category Management | 5 | 0 | 5 | 0 |
| Admin: Order Management | 7 | 6 | 1 | 0 |
| Admin: User Management | 6 | 5 | 1 | 0 |
| Admin: Inventory Management | 5 | 0 | 5 | 0 |
| Admin: Content Management | 3 | 0 | 0 | 3 |
| Admin: Analytics | 3 | 0 | 3 | 0 |
| **Total** | **68** | **47** | **18** | **3** |

### Revision History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | 2026-02-13 | — | Initial use case extraction from SRS v1.0 |
