# Graph Report - ./app  (2026-05-02)

## Corpus Check
- Corpus is ~25,611 words - fits in a single context window. You may not need a graph.

## Summary
- 768 nodes · 810 edges · 95 communities detected
- Extraction: 86% EXTRACTED · 14% INFERRED · 0% AMBIGUOUS · INFERRED: 112 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Public Catalog & Products|Public Catalog & Products]]
- [[_COMMUNITY_Cart Operations|Cart Operations]]
- [[_COMMUNITY_Business Scraping|Business Scraping]]
- [[_COMMUNITY_Checkout & Order History|Checkout & Order History]]
- [[_COMMUNITY_Banners & Home|Banners & Home]]
- [[_COMMUNITY_Categories & Catalog Admin|Categories & Catalog Admin]]
- [[_COMMUNITY_Order Model & Shipping|Order Model & Shipping]]
- [[_COMMUNITY_Address & Shipping Selection|Address & Shipping Selection]]
- [[_COMMUNITY_Skydropx Label Job|Skydropx Label Job]]
- [[_COMMUNITY_Auth Login & Google OAuth|Auth Login & Google OAuth]]
- [[_COMMUNITY_Skydropx Service|Skydropx Service]]
- [[_COMMUNITY_Inertia Shared Props|Inertia Shared Props]]
- [[_COMMUNITY_Stripe Payment Methods|Stripe Payment Methods]]
- [[_COMMUNITY_Product Image Pipeline|Product Image Pipeline]]
- [[_COMMUNITY_Static Pages|Static Pages]]
- [[_COMMUNITY_Checkout Creation|Checkout Creation]]
- [[_COMMUNITY_Order API Resources|Order API Resources]]
- [[_COMMUNITY_Product Detail Resources|Product Detail Resources]]
- [[_COMMUNITY_Register Form Request|Register Form Request]]
- [[_COMMUNITY_Pricing Tier Validation|Pricing Tier Validation]]
- [[_COMMUNITY_Production API (Formulas)|Production API (Formulas)]]
- [[_COMMUNITY_Outscraper Service|Outscraper Service]]
- [[_COMMUNITY_Login Form Request|Login Form Request]]
- [[_COMMUNITY_Cart API Resources|Cart API Resources]]
- [[_COMMUNITY_Telescope Provider|Telescope Provider]]
- [[_COMMUNITY_User Model|User Model]]
- [[_COMMUNITY_Order Status History|Order Status History]]
- [[_COMMUNITY_Order Refunds|Order Refunds]]
- [[_COMMUNITY_Toggle User Active Request|Toggle User Active Request]]
- [[_COMMUNITY_Update User Role Request|Update User Role Request]]
- [[_COMMUNITY_Update Order Status Request|Update Order Status Request]]
- [[_COMMUNITY_Create Order Refund Request|Create Order Refund Request]]
- [[_COMMUNITY_Update Order Tracking Request|Update Order Tracking Request]]
- [[_COMMUNITY_Store Order Note Request|Store Order Note Request]]
- [[_COMMUNITY_Add Cart Item Request|Add Cart Item Request]]
- [[_COMMUNITY_Update Cart Item Request|Update Cart Item Request]]
- [[_COMMUNITY_Create Setup Session Request|Create Setup Session Request]]
- [[_COMMUNITY_Verify Setup Session Request|Verify Setup Session Request]]
- [[_COMMUNITY_Store Address Request|Store Address Request]]
- [[_COMMUNITY_Update Address Request|Update Address Request]]
- [[_COMMUNITY_Update User Request|Update User Request]]
- [[_COMMUNITY_Update Notification Prefs Request|Update Notification Prefs Request]]
- [[_COMMUNITY_List Products Request|List Products Request]]
- [[_COMMUNITY_Google Complete Registration Request|Google Complete Registration Request]]
- [[_COMMUNITY_Verify Checkout Request|Verify Checkout Request]]
- [[_COMMUNITY_Create Checkout Request|Create Checkout Request]]
- [[_COMMUNITY_Confirm Payment Request|Confirm Payment Request]]
- [[_COMMUNITY_Order Status Mail|Order Status Mail]]
- [[_COMMUNITY_Order Confirmation Mail|Order Confirmation Mail]]
- [[_COMMUNITY_App Service Provider|App Service Provider]]
- [[_COMMUNITY_Shipping Method Model|Shipping Method Model]]
- [[_COMMUNITY_Pricing Tier Model|Pricing Tier Model]]
- [[_COMMUNITY_Logout Controller|Logout Controller]]
- [[_COMMUNITY_Store Payment Method Request|Store Payment Method Request]]
- [[_COMMUNITY_Checkout Request|Checkout Request]]
- [[_COMMUNITY_Shipping Quotes Request|Shipping Quotes Request]]
- [[_COMMUNITY_Update Featured Products Request|Update Featured Products Request]]
- [[_COMMUNITY_Update Banner Request|Update Banner Request]]
- [[_COMMUNITY_Store Banner Request|Store Banner Request]]
- [[_COMMUNITY_Update Static Page Request|Update Static Page Request]]
- [[_COMMUNITY_Update Product Request|Update Product Request]]
- [[_COMMUNITY_Store Product Request|Store Product Request]]
- [[_COMMUNITY_Product Detail Controller|Product Detail Controller]]
- [[_COMMUNITY_Update User Controller|Update User Controller]]
- [[_COMMUNITY_User List Controller|User List Controller]]
- [[_COMMUNITY_Toggle User Active Controller|Toggle User Active Controller]]
- [[_COMMUNITY_Show User Controller|Show User Controller]]
- [[_COMMUNITY_Update User Role Controller|Update User Role Controller]]
- [[_COMMUNITY_Show Order Controller|Show Order Controller]]
- [[_COMMUNITY_Update Order Tracking Controller|Update Order Tracking Controller]]
- [[_COMMUNITY_Update Order Status Controller|Update Order Status Controller]]
- [[_COMMUNITY_Store Order Note Controller|Store Order Note Controller]]
- [[_COMMUNITY_Order Show Response Builder|Order Show Response Builder]]
- [[_COMMUNITY_Create Setup Session Controller|Create Setup Session Controller]]
- [[_COMMUNITY_Destroy Address Controller|Destroy Address Controller]]
- [[_COMMUNITY_Update Address Controller|Update Address Controller]]
- [[_COMMUNITY_Get Notification Prefs Controller|Get Notification Prefs Controller]]
- [[_COMMUNITY_Update Notif Prefs Controller (API)|Update Notif Prefs Controller (API)]]
- [[_COMMUNITY_Account Controller|Account Controller]]
- [[_COMMUNITY_Update Profile Controller|Update Profile Controller]]
- [[_COMMUNITY_Profile Controller|Profile Controller]]
- [[_COMMUNITY_Notification Prefs Controller (Web)|Notification Prefs Controller (Web)]]
- [[_COMMUNITY_Update Notif Prefs Controller (Web)|Update Notif Prefs Controller (Web)]]
- [[_COMMUNITY_Update Product Controller|Update Product Controller]]
- [[_COMMUNITY_Destroy Product Controller|Destroy Product Controller]]
- [[_COMMUNITY_Google Registration Page Controller|Google Registration Page Controller]]
- [[_COMMUNITY_Google Redirect Controller|Google Redirect Controller]]
- [[_COMMUNITY_Get Order Controller|Get Order Controller]]
- [[_COMMUNITY_Download Invoice Controller|Download Invoice Controller]]
- [[_COMMUNITY_Reorder Controller|Reorder Controller]]
- [[_COMMUNITY_Notification Prefs Resource|Notification Prefs Resource]]
- [[_COMMUNITY_User Resource|User Resource]]
- [[_COMMUNITY_Static Page Resource|Static Page Resource]]
- [[_COMMUNITY_Role Middleware|Role Middleware]]
- [[_COMMUNITY_Base Controller|Base Controller]]

## God Nodes (most connected - your core abstractions)
1. `Product` - 29 edges
2. `SkydropxService` - 20 edges
3. `Cart` - 20 edges
4. `DashboardController` - 13 edges
5. `Banner` - 12 edges
6. `CreateShippingLabel` - 12 edges
7. `CategoriesController` - 11 edges
8. `Order` - 10 edges
9. `BusinessScrapeRun` - 10 edges
10. `PaymentMethodController` - 10 edges

## Surprising Connections (you probably didn't know these)
- `deleteProductImages()` --calls--> `ProductImage`  [INFERRED]
  Http/Controllers/Web/Products/ManagesProductData.php → Models/ProductImage.php
- `storeNewImages()` --calls--> `ProcessProductImage`  [INFERRED]
  Http/Controllers/Web/Products/ManagesProductData.php → Jobs/ProcessProductImage.php

## Communities

### Community 0 - "Public Catalog & Products"
Cohesion: 0.05
Nodes (9): FeaturedProductsController, ProductsController, Product, IndexProductsController, StoreProductController, ProductResource, CartController, ContentFeaturedProductsController (+1 more)

### Community 1 - "Cart Operations"
Cohesion: 0.05
Nodes (12): ReorderAction, AddCartItemController, ClearCartController, GetCartController, RemoveCartItemController, UpdateCartItemController, ConfirmPaymentController, GetShippingQuotesController (+4 more)

### Community 2 - "Business Scraping"
Cohesion: 0.06
Nodes (7): IndexBusinessesController, StartBusinessScrapeController, ImportBusinessResults, PollBusinessScrapeStatus, StartBusinessScrape, Business, BusinessScrapeRun

### Community 3 - "Checkout & Order History"
Cohesion: 0.08
Nodes (6): ShowCheckoutPaymentController, ShowCheckoutThankYouController, OrderNote, IndexOrdersController, DashboardController, OrderController

### Community 4 - "Banners & Home"
Cohesion: 0.07
Nodes (7): BannersController, Banner, BannerResource, MobileBannerResource, BannersController, CustomerDashboardController, HomeController

### Community 5 - "Categories & Catalog Admin"
Cohesion: 0.09
Nodes (6): CategoriesController, CreateProductController, EditProductController, CategoryResource, CatalogController, CategoriesController

### Community 6 - "Order Model & Shipping"
Cohesion: 0.08
Nodes (5): Order, ShippingMethodResource, ParcelCalculator, ShippingQuoteService, GetShippingMethodsController

### Community 7 - "Address & Shipping Selection"
Cohesion: 0.08
Nodes (6): GetAddressesController, StoreAddressController, ShowCheckoutShippingController, Address, AddressResource, AddressesController

### Community 8 - "Skydropx Label Job"
Cohesion: 0.14
Nodes (3): CreateShippingLabel, HandleStripeWebhook, RetryShippingLabelController

### Community 9 - "Auth Login & Google OAuth"
Cohesion: 0.09
Nodes (5): GoogleCallbackController, LoginController, RegisterController, StoreGoogleCompleteRegistrationController, IndexUsersController

### Community 10 - "Skydropx Service"
Cohesion: 0.19
Nodes (1): SkydropxService

### Community 11 - "Inertia Shared Props"
Cohesion: 0.11
Nodes (4): InsufficientStockException, HandleInertiaRequests, Category, HorizonServiceProvider

### Community 12 - "Stripe Payment Methods"
Cohesion: 0.16
Nodes (3): PaymentMethodData, VerifySetupSessionController, PaymentMethodController

### Community 13 - "Product Image Pipeline"
Cohesion: 0.13
Nodes (4): ProcessProductImage, ProductImage, deleteProductImages(), storeNewImages()

### Community 14 - "Static Pages"
Cohesion: 0.14
Nodes (4): StaticPagesController, StaticPage, StaticPageController, StaticPagesController

### Community 15 - "Checkout Creation"
Cohesion: 0.23
Nodes (2): CreateCheckoutController, OrderItem

### Community 16 - "Order API Resources"
Cohesion: 0.17
Nodes (4): GetOrdersController, OrderItemResource, OrderResource, OrderStatusHistoryResource

### Community 17 - "Product Detail Resources"
Cohesion: 0.22
Nodes (3): PricingTierResource, ProductDetailResource, ProductImageResource

### Community 18 - "Register Form Request"
Cohesion: 0.29
Nodes (1): RegisterRequest

### Community 19 - "Pricing Tier Validation"
Cohesion: 0.48
Nodes (1): NonOverlappingPricingTiers

### Community 20 - "Production API (Formulas)"
Cohesion: 0.47
Nodes (1): ProductionApiService

### Community 21 - "Outscraper Service"
Cohesion: 0.4
Nodes (1): OutscraperService

### Community 22 - "Login Form Request"
Cohesion: 0.33
Nodes (1): LoginRequest

### Community 23 - "Cart API Resources"
Cohesion: 0.33
Nodes (2): CartItemResource, CartResource

### Community 24 - "Telescope Provider"
Cohesion: 0.5
Nodes (1): TelescopeServiceProvider

### Community 25 - "User Model"
Cohesion: 0.4
Nodes (1): User

### Community 26 - "Order Status History"
Cohesion: 0.4
Nodes (1): OrderStatusHistory

### Community 27 - "Order Refunds"
Cohesion: 0.6
Nodes (1): CreateOrderRefundController

### Community 28 - "Toggle User Active Request"
Cohesion: 0.4
Nodes (1): ToggleUserActiveRequest

### Community 29 - "Update User Role Request"
Cohesion: 0.4
Nodes (1): UpdateUserRoleRequest

### Community 30 - "Update Order Status Request"
Cohesion: 0.4
Nodes (1): UpdateOrderStatusRequest

### Community 31 - "Create Order Refund Request"
Cohesion: 0.4
Nodes (1): CreateOrderRefundRequest

### Community 32 - "Update Order Tracking Request"
Cohesion: 0.4
Nodes (1): UpdateOrderTrackingRequest

### Community 33 - "Store Order Note Request"
Cohesion: 0.4
Nodes (1): StoreOrderNoteRequest

### Community 34 - "Add Cart Item Request"
Cohesion: 0.4
Nodes (1): AddCartItemRequest

### Community 35 - "Update Cart Item Request"
Cohesion: 0.4
Nodes (1): UpdateCartItemRequest

### Community 36 - "Create Setup Session Request"
Cohesion: 0.4
Nodes (1): CreateSetupSessionRequest

### Community 37 - "Verify Setup Session Request"
Cohesion: 0.4
Nodes (1): VerifySetupSessionRequest

### Community 38 - "Store Address Request"
Cohesion: 0.4
Nodes (1): StoreAddressRequest

### Community 39 - "Update Address Request"
Cohesion: 0.4
Nodes (1): UpdateAddressRequest

### Community 40 - "Update User Request"
Cohesion: 0.4
Nodes (1): UpdateUserRequest

### Community 41 - "Update Notification Prefs Request"
Cohesion: 0.4
Nodes (1): UpdateNotificationPreferencesRequest

### Community 42 - "List Products Request"
Cohesion: 0.4
Nodes (1): ListProductsRequest

### Community 43 - "Google Complete Registration Request"
Cohesion: 0.4
Nodes (1): GoogleCompleteRegistrationRequest

### Community 44 - "Verify Checkout Request"
Cohesion: 0.4
Nodes (1): VerifyCheckoutRequest

### Community 45 - "Create Checkout Request"
Cohesion: 0.4
Nodes (1): CreateCheckoutRequest

### Community 46 - "Confirm Payment Request"
Cohesion: 0.4
Nodes (1): ConfirmPaymentRequest

### Community 47 - "Order Status Mail"
Cohesion: 0.4
Nodes (1): OrderStatusChanged

### Community 48 - "Order Confirmation Mail"
Cohesion: 0.4
Nodes (1): OrderConfirmation

### Community 49 - "App Service Provider"
Cohesion: 0.5
Nodes (1): AppServiceProvider

### Community 50 - "Shipping Method Model"
Cohesion: 0.5
Nodes (1): ShippingMethod

### Community 51 - "Pricing Tier Model"
Cohesion: 0.5
Nodes (1): PricingTier

### Community 52 - "Logout Controller"
Cohesion: 0.5
Nodes (1): LogoutController

### Community 53 - "Store Payment Method Request"
Cohesion: 0.5
Nodes (1): StorePaymentMethodRequest

### Community 54 - "Checkout Request"
Cohesion: 0.5
Nodes (1): CheckoutRequest

### Community 55 - "Shipping Quotes Request"
Cohesion: 0.5
Nodes (1): ShippingQuotesRequest

### Community 56 - "Update Featured Products Request"
Cohesion: 0.5
Nodes (1): UpdateFeaturedProductsRequest

### Community 57 - "Update Banner Request"
Cohesion: 0.5
Nodes (1): UpdateBannerRequest

### Community 58 - "Store Banner Request"
Cohesion: 0.5
Nodes (1): StoreBannerRequest

### Community 59 - "Update Static Page Request"
Cohesion: 0.5
Nodes (1): UpdateStaticPageRequest

### Community 60 - "Update Product Request"
Cohesion: 0.5
Nodes (1): UpdateProductRequest

### Community 61 - "Store Product Request"
Cohesion: 0.5
Nodes (1): StoreProductRequest

### Community 62 - "Product Detail Controller"
Cohesion: 0.67
Nodes (1): ProductDetailController

### Community 63 - "Update User Controller"
Cohesion: 0.67
Nodes (1): UpdateUserController

### Community 64 - "User List Controller"
Cohesion: 0.67
Nodes (1): UserController

### Community 65 - "Toggle User Active Controller"
Cohesion: 0.67
Nodes (1): ToggleUserActiveController

### Community 66 - "Show User Controller"
Cohesion: 0.67
Nodes (1): ShowUserController

### Community 67 - "Update User Role Controller"
Cohesion: 0.67
Nodes (1): UpdateUserRoleController

### Community 68 - "Show Order Controller"
Cohesion: 0.67
Nodes (1): ShowOrderController

### Community 69 - "Update Order Tracking Controller"
Cohesion: 0.67
Nodes (1): UpdateOrderTrackingController

### Community 70 - "Update Order Status Controller"
Cohesion: 0.67
Nodes (1): UpdateOrderStatusController

### Community 71 - "Store Order Note Controller"
Cohesion: 0.67
Nodes (1): StoreOrderNoteController

### Community 72 - "Order Show Response Builder"
Cohesion: 1.0
Nodes (2): formatOrder(), renderOrderShow()

### Community 73 - "Create Setup Session Controller"
Cohesion: 0.67
Nodes (1): CreateSetupSessionController

### Community 74 - "Destroy Address Controller"
Cohesion: 0.67
Nodes (1): DestroyAddressController

### Community 75 - "Update Address Controller"
Cohesion: 0.67
Nodes (1): UpdateAddressController

### Community 76 - "Get Notification Prefs Controller"
Cohesion: 0.67
Nodes (1): GetNotificationPreferencesController

### Community 77 - "Update Notif Prefs Controller (API)"
Cohesion: 0.67
Nodes (1): UpdateNotificationPreferencesController

### Community 78 - "Account Controller"
Cohesion: 0.67
Nodes (1): AccountController

### Community 79 - "Update Profile Controller"
Cohesion: 0.67
Nodes (1): UpdateProfileController

### Community 80 - "Profile Controller"
Cohesion: 0.67
Nodes (1): ProfileController

### Community 81 - "Notification Prefs Controller (Web)"
Cohesion: 0.67
Nodes (1): NotificationPreferencesController

### Community 82 - "Update Notif Prefs Controller (Web)"
Cohesion: 0.67
Nodes (1): UpdateNotificationPreferencesController

### Community 83 - "Update Product Controller"
Cohesion: 0.67
Nodes (1): UpdateProductController

### Community 84 - "Destroy Product Controller"
Cohesion: 0.67
Nodes (1): DestroyProductController

### Community 85 - "Google Registration Page Controller"
Cohesion: 0.67
Nodes (1): ShowGoogleCompleteRegistrationController

### Community 86 - "Google Redirect Controller"
Cohesion: 0.67
Nodes (1): GoogleRedirectController

### Community 87 - "Get Order Controller"
Cohesion: 0.67
Nodes (1): GetOrderController

### Community 88 - "Download Invoice Controller"
Cohesion: 0.67
Nodes (1): DownloadInvoiceController

### Community 89 - "Reorder Controller"
Cohesion: 0.67
Nodes (1): ReorderController

### Community 90 - "Notification Prefs Resource"
Cohesion: 0.67
Nodes (1): NotificationPreferencesResource

### Community 91 - "User Resource"
Cohesion: 0.67
Nodes (1): UserResource

### Community 92 - "Static Page Resource"
Cohesion: 0.67
Nodes (1): StaticPageResource

### Community 93 - "Role Middleware"
Cohesion: 0.67
Nodes (1): RoleMiddleware

### Community 94 - "Base Controller"
Cohesion: 1.0
Nodes (1): Controller

## Knowledge Gaps
- **1 isolated node(s):** `Controller`
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Skydropx Service`** (21 nodes): `SkydropxService.php`, `SkydropxService`, `.addressFrom()`, `.buildShipmentPayload()`, `.cacheTokenResponse()`, `.__construct()`, `.createShipment()`, `.fetchQuotes()`, `.fullAddressFrom()`, `.getLabel()`, `.getOauthToken()`, `.getQuote()`, `.getQuotes()`, `.getTracking()`, `.getTrackingInfo()`, `.normalizeResponse()`, `.pollUntilCompleted()`, `.pollUntilTracking()`, `.requestQuotation()`, `.requestTokenViaCredentials()`, `.requestTokenViaRefresh()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Checkout Creation`** (12 nodes): `CreateCheckoutController`, `.buildLineItems()`, `.createOrder()`, `.__invoke()`, `.resolveShipping()`, `.validateStock()`, `CreateCheckoutController.php`, `OrderItem`, `.casts()`, `.order()`, `.product()`, `OrderItem.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Register Form Request`** (7 nodes): `RegisterRequest`, `.authorize()`, `.bodyParameters()`, `.messages()`, `.rules()`, `RegisterRequest.php`, `RegisterRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Pricing Tier Validation`** (7 nodes): `NonOverlappingPricingTiers`, `.findOverlap()`, `.hasUnlimitedMax()`, `.overlapMessage()`, `.rangesOverlap()`, `.validate()`, `NonOverlappingPricingTiers.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Production API (Formulas)`** (6 nodes): `ProductionApiService.php`, `ProductionApiService`, `.__construct()`, `.fetchFormulas()`, `.getAccessToken()`, `.getFormulas()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Outscraper Service`** (6 nodes): `OutscraperService`, `.__construct()`, `.flattenData()`, `.getRequestStatus()`, `.startSearch()`, `OutscraperService.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Login Form Request`** (6 nodes): `LoginRequest`, `.authorize()`, `.bodyParameters()`, `.rules()`, `LoginRequest.php`, `LoginRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Cart API Resources`** (6 nodes): `CartItemResource.php`, `CartResource.php`, `CartItemResource`, `.toArray()`, `CartResource`, `.toArray()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Telescope Provider`** (5 nodes): `TelescopeServiceProvider.php`, `TelescopeServiceProvider`, `.gate()`, `.hideSensitiveRequestDetails()`, `.register()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `User Model`** (5 nodes): `User.php`, `User`, `.addresses()`, `.casts()`, `.orders()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Order Status History`** (5 nodes): `OrderStatusHistory`, `.admin()`, `.casts()`, `.order()`, `OrderStatusHistory.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Order Refunds`** (5 nodes): `CreateOrderRefundController.php`, `CreateOrderRefundController`, `.__invoke()`, `.processStripeRefund()`, `.validateRefundEligibility()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Toggle User Active Request`** (5 nodes): `ToggleUserActiveRequest.php`, `ToggleUserActiveRequest`, `.authorize()`, `.messages()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update User Role Request`** (5 nodes): `UpdateUserRoleRequest.php`, `UpdateUserRoleRequest`, `.authorize()`, `.messages()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Order Status Request`** (5 nodes): `UpdateOrderStatusRequest.php`, `UpdateOrderStatusRequest`, `.authorize()`, `.messages()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Create Order Refund Request`** (5 nodes): `CreateOrderRefundRequest.php`, `CreateOrderRefundRequest`, `.authorize()`, `.messages()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Order Tracking Request`** (5 nodes): `UpdateOrderTrackingRequest.php`, `UpdateOrderTrackingRequest`, `.authorize()`, `.messages()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Store Order Note Request`** (5 nodes): `StoreOrderNoteRequest.php`, `StoreOrderNoteRequest`, `.authorize()`, `.messages()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Add Cart Item Request`** (5 nodes): `AddCartItemRequest`, `.authorize()`, `.bodyParameters()`, `.rules()`, `AddCartItemRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Cart Item Request`** (5 nodes): `UpdateCartItemRequest`, `.authorize()`, `.bodyParameters()`, `.rules()`, `UpdateCartItemRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Create Setup Session Request`** (5 nodes): `CreateSetupSessionRequest.php`, `CreateSetupSessionRequest`, `.authorize()`, `.bodyParameters()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Verify Setup Session Request`** (5 nodes): `VerifySetupSessionRequest.php`, `VerifySetupSessionRequest`, `.authorize()`, `.queryParameters()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Store Address Request`** (5 nodes): `StoreAddressRequest`, `.authorize()`, `.bodyParameters()`, `.rules()`, `StoreAddressRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Address Request`** (5 nodes): `UpdateAddressRequest`, `.authorize()`, `.bodyParameters()`, `.rules()`, `UpdateAddressRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update User Request`** (5 nodes): `UpdateUserRequest.php`, `UpdateUserRequest`, `.authorize()`, `.bodyParameters()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Notification Prefs Request`** (5 nodes): `UpdateNotificationPreferencesRequest.php`, `UpdateNotificationPreferencesRequest`, `.authorize()`, `.bodyParameters()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `List Products Request`** (5 nodes): `ListProductsRequest.php`, `ListProductsRequest`, `.authorize()`, `.queryParameters()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Google Complete Registration Request`** (5 nodes): `GoogleCompleteRegistrationRequest`, `.authorize()`, `.messages()`, `.rules()`, `GoogleCompleteRegistrationRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Verify Checkout Request`** (5 nodes): `VerifyCheckoutRequest`, `.authorize()`, `.queryParameters()`, `.rules()`, `VerifyCheckoutRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Create Checkout Request`** (5 nodes): `CreateCheckoutRequest`, `.authorize()`, `.bodyParameters()`, `.rules()`, `CreateCheckoutRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Confirm Payment Request`** (5 nodes): `ConfirmPaymentRequest`, `.authorize()`, `.bodyParameters()`, `.rules()`, `ConfirmPaymentRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Order Status Mail`** (5 nodes): `OrderStatusChanged.php`, `OrderStatusChanged`, `.__construct()`, `.toMail()`, `.via()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Order Confirmation Mail`** (5 nodes): `OrderConfirmation.php`, `OrderConfirmation`, `.__construct()`, `.toMail()`, `.via()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `App Service Provider`** (4 nodes): `AppServiceProvider`, `.boot()`, `.register()`, `AppServiceProvider.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Shipping Method Model`** (4 nodes): `ShippingMethod.php`, `ShippingMethod`, `.casts()`, `.orders()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Pricing Tier Model`** (4 nodes): `PricingTier.php`, `PricingTier`, `.casts()`, `.product()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Logout Controller`** (4 nodes): `LogoutController`, `.__invoke()`, `LogoutController.php`, `LogoutController.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Store Payment Method Request`** (4 nodes): `StorePaymentMethodRequest.php`, `StorePaymentMethodRequest`, `.authorize()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Checkout Request`** (4 nodes): `CheckoutRequest.php`, `CheckoutRequest`, `.authorize()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Shipping Quotes Request`** (4 nodes): `ShippingQuotesRequest.php`, `ShippingQuotesRequest`, `.authorize()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Featured Products Request`** (4 nodes): `UpdateFeaturedProductsRequest`, `.authorize()`, `.rules()`, `UpdateFeaturedProductsRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Banner Request`** (4 nodes): `UpdateBannerRequest`, `.authorize()`, `.rules()`, `UpdateBannerRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Store Banner Request`** (4 nodes): `StoreBannerRequest`, `.authorize()`, `.rules()`, `StoreBannerRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Static Page Request`** (4 nodes): `UpdateStaticPageRequest`, `.authorize()`, `.rules()`, `UpdateStaticPageRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Product Request`** (4 nodes): `UpdateProductRequest.php`, `UpdateProductRequest`, `.authorize()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Store Product Request`** (4 nodes): `StoreProductRequest.php`, `StoreProductRequest`, `.authorize()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Product Detail Controller`** (3 nodes): `ProductDetailController`, `.__invoke()`, `ProductDetailController.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update User Controller`** (3 nodes): `UpdateUserController`, `.__invoke()`, `UpdateUserController.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `User List Controller`** (3 nodes): `UserController`, `.__invoke()`, `UserController.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Toggle User Active Controller`** (3 nodes): `ToggleUserActiveController.php`, `ToggleUserActiveController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Show User Controller`** (3 nodes): `ShowUserController.php`, `ShowUserController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update User Role Controller`** (3 nodes): `UpdateUserRoleController.php`, `UpdateUserRoleController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Show Order Controller`** (3 nodes): `ShowOrderController.php`, `ShowOrderController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Order Tracking Controller`** (3 nodes): `UpdateOrderTrackingController.php`, `UpdateOrderTrackingController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Order Status Controller`** (3 nodes): `UpdateOrderStatusController.php`, `UpdateOrderStatusController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Store Order Note Controller`** (3 nodes): `StoreOrderNoteController.php`, `StoreOrderNoteController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Order Show Response Builder`** (3 nodes): `formatOrder()`, `renderOrderShow()`, `BuildsOrderShowResponse.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Create Setup Session Controller`** (3 nodes): `CreateSetupSessionController.php`, `CreateSetupSessionController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Destroy Address Controller`** (3 nodes): `DestroyAddressController`, `.__invoke()`, `DestroyAddressController.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Address Controller`** (3 nodes): `UpdateAddressController`, `.__invoke()`, `UpdateAddressController.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Get Notification Prefs Controller`** (3 nodes): `GetNotificationPreferencesController.php`, `GetNotificationPreferencesController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Notif Prefs Controller (API)`** (3 nodes): `UpdateNotificationPreferencesController.php`, `UpdateNotificationPreferencesController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Account Controller`** (3 nodes): `AccountController.php`, `AccountController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Profile Controller`** (3 nodes): `UpdateProfileController.php`, `UpdateProfileController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Profile Controller`** (3 nodes): `ProfileController.php`, `ProfileController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Notification Prefs Controller (Web)`** (3 nodes): `NotificationPreferencesController.php`, `NotificationPreferencesController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Notif Prefs Controller (Web)`** (3 nodes): `UpdateNotificationPreferencesController.php`, `UpdateNotificationPreferencesController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Product Controller`** (3 nodes): `UpdateProductController.php`, `UpdateProductController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Destroy Product Controller`** (3 nodes): `DestroyProductController.php`, `DestroyProductController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Google Registration Page Controller`** (3 nodes): `ShowGoogleCompleteRegistrationController`, `.__invoke()`, `ShowGoogleCompleteRegistrationController.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Google Redirect Controller`** (3 nodes): `GoogleRedirectController`, `.__invoke()`, `GoogleRedirectController.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Get Order Controller`** (3 nodes): `GetOrderController.php`, `GetOrderController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Download Invoice Controller`** (3 nodes): `DownloadInvoiceController.php`, `DownloadInvoiceController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Reorder Controller`** (3 nodes): `ReorderController.php`, `ReorderController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Notification Prefs Resource`** (3 nodes): `NotificationPreferencesResource.php`, `NotificationPreferencesResource`, `.toArray()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `User Resource`** (3 nodes): `UserResource.php`, `UserResource`, `.toArray()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Static Page Resource`** (3 nodes): `StaticPageResource.php`, `StaticPageResource`, `.toArray()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Role Middleware`** (3 nodes): `RoleMiddleware.php`, `RoleMiddleware`, `.handle()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Base Controller`** (2 nodes): `Controller`, `Controller.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Cart` connect `Cart Operations` to `Public Catalog & Products`, `Address & Shipping Selection`, `Skydropx Label Job`, `Auth Login & Google OAuth`, `Inertia Shared Props`, `Checkout Creation`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **Why does `Product` connect `Public Catalog & Products` to `Cart Operations`, `Checkout & Order History`, `Banners & Home`, `Categories & Catalog Admin`, `Inertia Shared Props`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Are the 13 inferred relationships involving `Product` (e.g. with `.__invoke()` and `.__invoke()`) actually correct?**
  _`Product` has 13 INFERRED edges - model-reasoned connections that need verification._
- **Are the 15 inferred relationships involving `Cart` (e.g. with `.__invoke()` and `.__invoke()`) actually correct?**
  _`Cart` has 15 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `Banner` (e.g. with `.__invoke()` and `.__invoke()`) actually correct?**
  _`Banner` has 6 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Controller` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Public Catalog & Products` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._