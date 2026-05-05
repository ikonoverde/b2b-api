# Graph Report - .  (2026-05-04)

## Corpus Check
- Corpus is ~25,045 words - fits in a single context window. You may not need a graph.

## Summary
- 752 nodes · 792 edges · 93 communities detected
- Extraction: 86% EXTRACTED · 14% INFERRED · 0% AMBIGUOUS · INFERRED: 111 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Product Catalog|Product Catalog]]
- [[_COMMUNITY_Cart & Checkout API|Cart & Checkout API]]
- [[_COMMUNITY_Business Scraping Pipeline|Business Scraping Pipeline]]
- [[_COMMUNITY_Order Dashboard & Views|Order Dashboard & Views]]
- [[_COMMUNITY_Banners & Homepage Content|Banners & Homepage Content]]
- [[_COMMUNITY_Categories & Catalog Browse|Categories & Catalog Browse]]
- [[_COMMUNITY_Order Lifecycle & Shipping Methods|Order Lifecycle & Shipping Methods]]
- [[_COMMUNITY_Shipping Label Creation Job|Shipping Label Creation Job]]
- [[_COMMUNITY_Address Management|Address Management]]
- [[_COMMUNITY_Authentication (LoginGoogle OAuth)|Authentication (Login/Google OAuth)]]
- [[_COMMUNITY_Stock & Inertia Middleware|Stock & Inertia Middleware]]
- [[_COMMUNITY_Skydropx Shipping Service|Skydropx Shipping Service]]
- [[_COMMUNITY_Payment Methods (Stripe Setup)|Payment Methods (Stripe Setup)]]
- [[_COMMUNITY_Product Image Processing|Product Image Processing]]
- [[_COMMUNITY_Static Pages|Static Pages]]
- [[_COMMUNITY_Checkout Order Creation|Checkout Order Creation]]
- [[_COMMUNITY_Order API Resources|Order API Resources]]
- [[_COMMUNITY_Register Form Request|Register Form Request]]
- [[_COMMUNITY_Production API Service|Production API Service]]
- [[_COMMUNITY_Outscraper Service|Outscraper Service]]
- [[_COMMUNITY_Login Form Request|Login Form Request]]
- [[_COMMUNITY_Cart API Resources|Cart API Resources]]
- [[_COMMUNITY_Product Detail Resource|Product Detail Resource]]
- [[_COMMUNITY_Telescope Service Provider|Telescope Service Provider]]
- [[_COMMUNITY_User Model|User Model]]
- [[_COMMUNITY_Order Status History Model|Order Status History Model]]
- [[_COMMUNITY_Order Refund (Stripe)|Order Refund (Stripe)]]
- [[_COMMUNITY_Toggle User Active Request|Toggle User Active Request]]
- [[_COMMUNITY_Update User Role Request|Update User Role Request]]
- [[_COMMUNITY_Update Order Status Request|Update Order Status Request]]
- [[_COMMUNITY_Create Order Refund Request|Create Order Refund Request]]
- [[_COMMUNITY_Update Order Tracking Request|Update Order Tracking Request]]
- [[_COMMUNITY_Store Order Note Request|Store Order Note Request]]
- [[_COMMUNITY_Add Cart Item Request|Add Cart Item Request]]
- [[_COMMUNITY_Update Cart Item Request|Update Cart Item Request]]
- [[_COMMUNITY_Create Stripe Setup Session Request|Create Stripe Setup Session Request]]
- [[_COMMUNITY_Verify Stripe Setup Session Request|Verify Stripe Setup Session Request]]
- [[_COMMUNITY_Store Address Request|Store Address Request]]
- [[_COMMUNITY_Update Address Request|Update Address Request]]
- [[_COMMUNITY_Update User Profile Request|Update User Profile Request]]
- [[_COMMUNITY_Update Notification Preferences Request|Update Notification Preferences Request]]
- [[_COMMUNITY_List Products Request|List Products Request]]
- [[_COMMUNITY_Google Complete Registration Request|Google Complete Registration Request]]
- [[_COMMUNITY_Verify Checkout Request|Verify Checkout Request]]
- [[_COMMUNITY_Create Checkout Request|Create Checkout Request]]
- [[_COMMUNITY_Confirm Payment Request|Confirm Payment Request]]
- [[_COMMUNITY_Order Status Changed Notification|Order Status Changed Notification]]
- [[_COMMUNITY_Order Confirmation Notification|Order Confirmation Notification]]
- [[_COMMUNITY_App Service Provider|App Service Provider]]
- [[_COMMUNITY_Shipping Method Model|Shipping Method Model]]
- [[_COMMUNITY_Logout Controller|Logout Controller]]
- [[_COMMUNITY_Store Payment Method Request|Store Payment Method Request]]
- [[_COMMUNITY_Web Checkout Request|Web Checkout Request]]
- [[_COMMUNITY_Web Shipping Quotes Request|Web Shipping Quotes Request]]
- [[_COMMUNITY_Update Featured Products Request|Update Featured Products Request]]
- [[_COMMUNITY_Update Banner Request|Update Banner Request]]
- [[_COMMUNITY_Store Banner Request|Store Banner Request]]
- [[_COMMUNITY_Update Static Page Request|Update Static Page Request]]
- [[_COMMUNITY_Update Product Request|Update Product Request]]
- [[_COMMUNITY_Store Product Request|Store Product Request]]
- [[_COMMUNITY_Product Detail Controller|Product Detail Controller]]
- [[_COMMUNITY_Update User Controller (API)|Update User Controller (API)]]
- [[_COMMUNITY_User Controller (API)|User Controller (API)]]
- [[_COMMUNITY_Toggle User Active Controller|Toggle User Active Controller]]
- [[_COMMUNITY_Show User Controller|Show User Controller]]
- [[_COMMUNITY_Update User Role Controller|Update User Role Controller]]
- [[_COMMUNITY_Show Order Controller (Admin)|Show Order Controller (Admin)]]
- [[_COMMUNITY_Update Order Tracking Controller|Update Order Tracking Controller]]
- [[_COMMUNITY_Update Order Status Controller|Update Order Status Controller]]
- [[_COMMUNITY_Store Order Note Controller|Store Order Note Controller]]
- [[_COMMUNITY_Order Show Response Concern|Order Show Response Concern]]
- [[_COMMUNITY_Create Stripe Setup Session Controller|Create Stripe Setup Session Controller]]
- [[_COMMUNITY_Destroy Address Controller|Destroy Address Controller]]
- [[_COMMUNITY_Update Address Controller|Update Address Controller]]
- [[_COMMUNITY_Get Notification Preferences Controller|Get Notification Preferences Controller]]
- [[_COMMUNITY_Update Notification Preferences Controller|Update Notification Preferences Controller]]
- [[_COMMUNITY_Account Controller (Web)|Account Controller (Web)]]
- [[_COMMUNITY_Update Profile Controller (Web)|Update Profile Controller (Web)]]
- [[_COMMUNITY_Profile Controller (Web)|Profile Controller (Web)]]
- [[_COMMUNITY_Notification Preferences Controller (Web)|Notification Preferences Controller (Web)]]
- [[_COMMUNITY_Update Notification Preferences Controller (Web)|Update Notification Preferences Controller (Web)]]
- [[_COMMUNITY_Update Product Controller (Web)|Update Product Controller (Web)]]
- [[_COMMUNITY_Destroy Product Controller (Web)|Destroy Product Controller (Web)]]
- [[_COMMUNITY_Show Google Complete Registration Controller|Show Google Complete Registration Controller]]
- [[_COMMUNITY_Google Redirect Controller|Google Redirect Controller]]
- [[_COMMUNITY_Get Order Controller (API)|Get Order Controller (API)]]
- [[_COMMUNITY_Download Invoice Controller|Download Invoice Controller]]
- [[_COMMUNITY_Reorder Controller|Reorder Controller]]
- [[_COMMUNITY_Notification Preferences Resource|Notification Preferences Resource]]
- [[_COMMUNITY_User Resource|User Resource]]
- [[_COMMUNITY_Static Page Resource|Static Page Resource]]
- [[_COMMUNITY_Role Middleware|Role Middleware]]
- [[_COMMUNITY_Base Controller|Base Controller]]

## God Nodes (most connected - your core abstractions)
1. `Product` - 28 edges
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

### Community 0 - "Product Catalog"
Cohesion: 0.05
Nodes (9): FeaturedProductsController, ProductsController, Product, IndexProductsController, StoreProductController, ProductResource, CartController, ContentFeaturedProductsController (+1 more)

### Community 1 - "Cart & Checkout API"
Cohesion: 0.05
Nodes (12): ReorderAction, AddCartItemController, ClearCartController, GetCartController, RemoveCartItemController, UpdateCartItemController, ConfirmPaymentController, GetShippingQuotesController (+4 more)

### Community 2 - "Business Scraping Pipeline"
Cohesion: 0.06
Nodes (7): IndexBusinessesController, StartBusinessScrapeController, ImportBusinessResults, PollBusinessScrapeStatus, StartBusinessScrape, Business, BusinessScrapeRun

### Community 3 - "Order Dashboard & Views"
Cohesion: 0.08
Nodes (6): ShowCheckoutPaymentController, ShowCheckoutThankYouController, OrderNote, IndexOrdersController, DashboardController, OrderController

### Community 4 - "Banners & Homepage Content"
Cohesion: 0.07
Nodes (7): BannersController, Banner, BannerResource, MobileBannerResource, BannersController, CustomerDashboardController, HomeController

### Community 5 - "Categories & Catalog Browse"
Cohesion: 0.09
Nodes (6): CategoriesController, CreateProductController, EditProductController, CategoryResource, CatalogController, CategoriesController

### Community 6 - "Order Lifecycle & Shipping Methods"
Cohesion: 0.08
Nodes (5): Order, ShippingMethodResource, ParcelCalculator, ShippingQuoteService, GetShippingMethodsController

### Community 7 - "Shipping Label Creation Job"
Cohesion: 0.14
Nodes (3): CreateShippingLabel, HandleStripeWebhook, RetryShippingLabelController

### Community 8 - "Address Management"
Cohesion: 0.08
Nodes (6): GetAddressesController, StoreAddressController, ShowCheckoutShippingController, Address, AddressResource, AddressesController

### Community 9 - "Authentication (Login/Google OAuth)"
Cohesion: 0.09
Nodes (5): GoogleCallbackController, LoginController, RegisterController, StoreGoogleCompleteRegistrationController, IndexUsersController

### Community 10 - "Stock & Inertia Middleware"
Cohesion: 0.11
Nodes (4): InsufficientStockException, HandleInertiaRequests, Category, HorizonServiceProvider

### Community 11 - "Skydropx Shipping Service"
Cohesion: 0.19
Nodes (1): SkydropxService

### Community 12 - "Payment Methods (Stripe Setup)"
Cohesion: 0.16
Nodes (3): PaymentMethodData, VerifySetupSessionController, PaymentMethodController

### Community 13 - "Product Image Processing"
Cohesion: 0.14
Nodes (4): ProcessProductImage, ProductImage, deleteProductImages(), storeNewImages()

### Community 14 - "Static Pages"
Cohesion: 0.14
Nodes (4): StaticPagesController, StaticPage, StaticPageController, StaticPagesController

### Community 15 - "Checkout Order Creation"
Cohesion: 0.23
Nodes (2): CreateCheckoutController, OrderItem

### Community 16 - "Order API Resources"
Cohesion: 0.17
Nodes (4): GetOrdersController, OrderItemResource, OrderResource, OrderStatusHistoryResource

### Community 17 - "Register Form Request"
Cohesion: 0.29
Nodes (1): RegisterRequest

### Community 18 - "Production API Service"
Cohesion: 0.47
Nodes (1): ProductionApiService

### Community 19 - "Outscraper Service"
Cohesion: 0.4
Nodes (1): OutscraperService

### Community 20 - "Login Form Request"
Cohesion: 0.33
Nodes (1): LoginRequest

### Community 21 - "Cart API Resources"
Cohesion: 0.33
Nodes (2): CartItemResource, CartResource

### Community 22 - "Product Detail Resource"
Cohesion: 0.33
Nodes (2): ProductDetailResource, ProductImageResource

### Community 23 - "Telescope Service Provider"
Cohesion: 0.5
Nodes (1): TelescopeServiceProvider

### Community 24 - "User Model"
Cohesion: 0.4
Nodes (1): User

### Community 25 - "Order Status History Model"
Cohesion: 0.4
Nodes (1): OrderStatusHistory

### Community 26 - "Order Refund (Stripe)"
Cohesion: 0.6
Nodes (1): CreateOrderRefundController

### Community 27 - "Toggle User Active Request"
Cohesion: 0.4
Nodes (1): ToggleUserActiveRequest

### Community 28 - "Update User Role Request"
Cohesion: 0.4
Nodes (1): UpdateUserRoleRequest

### Community 29 - "Update Order Status Request"
Cohesion: 0.4
Nodes (1): UpdateOrderStatusRequest

### Community 30 - "Create Order Refund Request"
Cohesion: 0.4
Nodes (1): CreateOrderRefundRequest

### Community 31 - "Update Order Tracking Request"
Cohesion: 0.4
Nodes (1): UpdateOrderTrackingRequest

### Community 32 - "Store Order Note Request"
Cohesion: 0.4
Nodes (1): StoreOrderNoteRequest

### Community 33 - "Add Cart Item Request"
Cohesion: 0.4
Nodes (1): AddCartItemRequest

### Community 34 - "Update Cart Item Request"
Cohesion: 0.4
Nodes (1): UpdateCartItemRequest

### Community 35 - "Create Stripe Setup Session Request"
Cohesion: 0.4
Nodes (1): CreateSetupSessionRequest

### Community 36 - "Verify Stripe Setup Session Request"
Cohesion: 0.4
Nodes (1): VerifySetupSessionRequest

### Community 37 - "Store Address Request"
Cohesion: 0.4
Nodes (1): StoreAddressRequest

### Community 38 - "Update Address Request"
Cohesion: 0.4
Nodes (1): UpdateAddressRequest

### Community 39 - "Update User Profile Request"
Cohesion: 0.4
Nodes (1): UpdateUserRequest

### Community 40 - "Update Notification Preferences Request"
Cohesion: 0.4
Nodes (1): UpdateNotificationPreferencesRequest

### Community 41 - "List Products Request"
Cohesion: 0.4
Nodes (1): ListProductsRequest

### Community 42 - "Google Complete Registration Request"
Cohesion: 0.4
Nodes (1): GoogleCompleteRegistrationRequest

### Community 43 - "Verify Checkout Request"
Cohesion: 0.4
Nodes (1): VerifyCheckoutRequest

### Community 44 - "Create Checkout Request"
Cohesion: 0.4
Nodes (1): CreateCheckoutRequest

### Community 45 - "Confirm Payment Request"
Cohesion: 0.4
Nodes (1): ConfirmPaymentRequest

### Community 46 - "Order Status Changed Notification"
Cohesion: 0.4
Nodes (1): OrderStatusChanged

### Community 47 - "Order Confirmation Notification"
Cohesion: 0.4
Nodes (1): OrderConfirmation

### Community 48 - "App Service Provider"
Cohesion: 0.5
Nodes (1): AppServiceProvider

### Community 49 - "Shipping Method Model"
Cohesion: 0.5
Nodes (1): ShippingMethod

### Community 50 - "Logout Controller"
Cohesion: 0.5
Nodes (1): LogoutController

### Community 51 - "Store Payment Method Request"
Cohesion: 0.5
Nodes (1): StorePaymentMethodRequest

### Community 52 - "Web Checkout Request"
Cohesion: 0.5
Nodes (1): CheckoutRequest

### Community 53 - "Web Shipping Quotes Request"
Cohesion: 0.5
Nodes (1): ShippingQuotesRequest

### Community 54 - "Update Featured Products Request"
Cohesion: 0.5
Nodes (1): UpdateFeaturedProductsRequest

### Community 55 - "Update Banner Request"
Cohesion: 0.5
Nodes (1): UpdateBannerRequest

### Community 56 - "Store Banner Request"
Cohesion: 0.5
Nodes (1): StoreBannerRequest

### Community 57 - "Update Static Page Request"
Cohesion: 0.5
Nodes (1): UpdateStaticPageRequest

### Community 58 - "Update Product Request"
Cohesion: 0.5
Nodes (1): UpdateProductRequest

### Community 59 - "Store Product Request"
Cohesion: 0.5
Nodes (1): StoreProductRequest

### Community 60 - "Product Detail Controller"
Cohesion: 0.67
Nodes (1): ProductDetailController

### Community 61 - "Update User Controller (API)"
Cohesion: 0.67
Nodes (1): UpdateUserController

### Community 62 - "User Controller (API)"
Cohesion: 0.67
Nodes (1): UserController

### Community 63 - "Toggle User Active Controller"
Cohesion: 0.67
Nodes (1): ToggleUserActiveController

### Community 64 - "Show User Controller"
Cohesion: 0.67
Nodes (1): ShowUserController

### Community 65 - "Update User Role Controller"
Cohesion: 0.67
Nodes (1): UpdateUserRoleController

### Community 66 - "Show Order Controller (Admin)"
Cohesion: 0.67
Nodes (1): ShowOrderController

### Community 67 - "Update Order Tracking Controller"
Cohesion: 0.67
Nodes (1): UpdateOrderTrackingController

### Community 68 - "Update Order Status Controller"
Cohesion: 0.67
Nodes (1): UpdateOrderStatusController

### Community 69 - "Store Order Note Controller"
Cohesion: 0.67
Nodes (1): StoreOrderNoteController

### Community 70 - "Order Show Response Concern"
Cohesion: 1.0
Nodes (2): formatOrder(), renderOrderShow()

### Community 71 - "Create Stripe Setup Session Controller"
Cohesion: 0.67
Nodes (1): CreateSetupSessionController

### Community 72 - "Destroy Address Controller"
Cohesion: 0.67
Nodes (1): DestroyAddressController

### Community 73 - "Update Address Controller"
Cohesion: 0.67
Nodes (1): UpdateAddressController

### Community 74 - "Get Notification Preferences Controller"
Cohesion: 0.67
Nodes (1): GetNotificationPreferencesController

### Community 75 - "Update Notification Preferences Controller"
Cohesion: 0.67
Nodes (1): UpdateNotificationPreferencesController

### Community 76 - "Account Controller (Web)"
Cohesion: 0.67
Nodes (1): AccountController

### Community 77 - "Update Profile Controller (Web)"
Cohesion: 0.67
Nodes (1): UpdateProfileController

### Community 78 - "Profile Controller (Web)"
Cohesion: 0.67
Nodes (1): ProfileController

### Community 79 - "Notification Preferences Controller (Web)"
Cohesion: 0.67
Nodes (1): NotificationPreferencesController

### Community 80 - "Update Notification Preferences Controller (Web)"
Cohesion: 0.67
Nodes (1): UpdateNotificationPreferencesController

### Community 81 - "Update Product Controller (Web)"
Cohesion: 0.67
Nodes (1): UpdateProductController

### Community 82 - "Destroy Product Controller (Web)"
Cohesion: 0.67
Nodes (1): DestroyProductController

### Community 83 - "Show Google Complete Registration Controller"
Cohesion: 0.67
Nodes (1): ShowGoogleCompleteRegistrationController

### Community 84 - "Google Redirect Controller"
Cohesion: 0.67
Nodes (1): GoogleRedirectController

### Community 85 - "Get Order Controller (API)"
Cohesion: 0.67
Nodes (1): GetOrderController

### Community 86 - "Download Invoice Controller"
Cohesion: 0.67
Nodes (1): DownloadInvoiceController

### Community 87 - "Reorder Controller"
Cohesion: 0.67
Nodes (1): ReorderController

### Community 88 - "Notification Preferences Resource"
Cohesion: 0.67
Nodes (1): NotificationPreferencesResource

### Community 89 - "User Resource"
Cohesion: 0.67
Nodes (1): UserResource

### Community 90 - "Static Page Resource"
Cohesion: 0.67
Nodes (1): StaticPageResource

### Community 91 - "Role Middleware"
Cohesion: 0.67
Nodes (1): RoleMiddleware

### Community 92 - "Base Controller"
Cohesion: 1.0
Nodes (1): Controller

## Knowledge Gaps
- **1 isolated node(s):** `Controller`
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Skydropx Shipping Service`** (21 nodes): `SkydropxService.php`, `SkydropxService`, `.addressFrom()`, `.buildShipmentPayload()`, `.cacheTokenResponse()`, `.__construct()`, `.createShipment()`, `.fetchQuotes()`, `.fullAddressFrom()`, `.getLabel()`, `.getOauthToken()`, `.getQuote()`, `.getQuotes()`, `.getTracking()`, `.getTrackingInfo()`, `.normalizeResponse()`, `.pollUntilCompleted()`, `.pollUntilTracking()`, `.requestQuotation()`, `.requestTokenViaCredentials()`, `.requestTokenViaRefresh()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Checkout Order Creation`** (12 nodes): `CreateCheckoutController`, `.buildLineItems()`, `.createOrder()`, `.__invoke()`, `.resolveShipping()`, `.validateStock()`, `CreateCheckoutController.php`, `OrderItem`, `.casts()`, `.order()`, `.product()`, `OrderItem.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Register Form Request`** (7 nodes): `RegisterRequest`, `.authorize()`, `.bodyParameters()`, `.messages()`, `.rules()`, `RegisterRequest.php`, `RegisterRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Production API Service`** (6 nodes): `ProductionApiService.php`, `ProductionApiService`, `.__construct()`, `.fetchFormulas()`, `.getAccessToken()`, `.getFormulas()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Outscraper Service`** (6 nodes): `OutscraperService`, `.__construct()`, `.flattenData()`, `.getRequestStatus()`, `.startSearch()`, `OutscraperService.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Login Form Request`** (6 nodes): `LoginRequest`, `.authorize()`, `.bodyParameters()`, `.rules()`, `LoginRequest.php`, `LoginRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Cart API Resources`** (6 nodes): `CartItemResource.php`, `CartResource.php`, `CartItemResource`, `.toArray()`, `CartResource`, `.toArray()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Product Detail Resource`** (6 nodes): `ProductDetailResource.php`, `ProductImageResource.php`, `ProductDetailResource`, `.toArray()`, `ProductImageResource`, `.toArray()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Telescope Service Provider`** (5 nodes): `TelescopeServiceProvider.php`, `TelescopeServiceProvider`, `.gate()`, `.hideSensitiveRequestDetails()`, `.register()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `User Model`** (5 nodes): `User.php`, `User`, `.addresses()`, `.casts()`, `.orders()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Order Status History Model`** (5 nodes): `OrderStatusHistory`, `.admin()`, `.casts()`, `.order()`, `OrderStatusHistory.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Order Refund (Stripe)`** (5 nodes): `CreateOrderRefundController.php`, `CreateOrderRefundController`, `.__invoke()`, `.processStripeRefund()`, `.validateRefundEligibility()`
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
- **Thin community `Create Stripe Setup Session Request`** (5 nodes): `CreateSetupSessionRequest.php`, `CreateSetupSessionRequest`, `.authorize()`, `.bodyParameters()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Verify Stripe Setup Session Request`** (5 nodes): `VerifySetupSessionRequest.php`, `VerifySetupSessionRequest`, `.authorize()`, `.queryParameters()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Store Address Request`** (5 nodes): `StoreAddressRequest`, `.authorize()`, `.bodyParameters()`, `.rules()`, `StoreAddressRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Address Request`** (5 nodes): `UpdateAddressRequest`, `.authorize()`, `.bodyParameters()`, `.rules()`, `UpdateAddressRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update User Profile Request`** (5 nodes): `UpdateUserRequest.php`, `UpdateUserRequest`, `.authorize()`, `.bodyParameters()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Notification Preferences Request`** (5 nodes): `UpdateNotificationPreferencesRequest.php`, `UpdateNotificationPreferencesRequest`, `.authorize()`, `.bodyParameters()`, `.rules()`
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
- **Thin community `Order Status Changed Notification`** (5 nodes): `OrderStatusChanged.php`, `OrderStatusChanged`, `.__construct()`, `.toMail()`, `.via()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Order Confirmation Notification`** (5 nodes): `OrderConfirmation.php`, `OrderConfirmation`, `.__construct()`, `.toMail()`, `.via()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `App Service Provider`** (4 nodes): `AppServiceProvider`, `.boot()`, `.register()`, `AppServiceProvider.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Shipping Method Model`** (4 nodes): `ShippingMethod.php`, `ShippingMethod`, `.casts()`, `.orders()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Logout Controller`** (4 nodes): `LogoutController`, `.__invoke()`, `LogoutController.php`, `LogoutController.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Store Payment Method Request`** (4 nodes): `StorePaymentMethodRequest.php`, `StorePaymentMethodRequest`, `.authorize()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Web Checkout Request`** (4 nodes): `CheckoutRequest.php`, `CheckoutRequest`, `.authorize()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Web Shipping Quotes Request`** (4 nodes): `ShippingQuotesRequest.php`, `ShippingQuotesRequest`, `.authorize()`, `.rules()`
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
- **Thin community `Update User Controller (API)`** (3 nodes): `UpdateUserController`, `.__invoke()`, `UpdateUserController.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `User Controller (API)`** (3 nodes): `UserController`, `.__invoke()`, `UserController.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Toggle User Active Controller`** (3 nodes): `ToggleUserActiveController.php`, `ToggleUserActiveController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Show User Controller`** (3 nodes): `ShowUserController.php`, `ShowUserController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update User Role Controller`** (3 nodes): `UpdateUserRoleController.php`, `UpdateUserRoleController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Show Order Controller (Admin)`** (3 nodes): `ShowOrderController.php`, `ShowOrderController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Order Tracking Controller`** (3 nodes): `UpdateOrderTrackingController.php`, `UpdateOrderTrackingController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Order Status Controller`** (3 nodes): `UpdateOrderStatusController.php`, `UpdateOrderStatusController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Store Order Note Controller`** (3 nodes): `StoreOrderNoteController.php`, `StoreOrderNoteController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Order Show Response Concern`** (3 nodes): `formatOrder()`, `renderOrderShow()`, `BuildsOrderShowResponse.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Create Stripe Setup Session Controller`** (3 nodes): `CreateSetupSessionController.php`, `CreateSetupSessionController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Destroy Address Controller`** (3 nodes): `DestroyAddressController`, `.__invoke()`, `DestroyAddressController.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Address Controller`** (3 nodes): `UpdateAddressController`, `.__invoke()`, `UpdateAddressController.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Get Notification Preferences Controller`** (3 nodes): `GetNotificationPreferencesController.php`, `GetNotificationPreferencesController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Notification Preferences Controller`** (3 nodes): `UpdateNotificationPreferencesController.php`, `UpdateNotificationPreferencesController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Account Controller (Web)`** (3 nodes): `AccountController.php`, `AccountController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Profile Controller (Web)`** (3 nodes): `UpdateProfileController.php`, `UpdateProfileController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Profile Controller (Web)`** (3 nodes): `ProfileController.php`, `ProfileController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Notification Preferences Controller (Web)`** (3 nodes): `NotificationPreferencesController.php`, `NotificationPreferencesController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Notification Preferences Controller (Web)`** (3 nodes): `UpdateNotificationPreferencesController.php`, `UpdateNotificationPreferencesController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Product Controller (Web)`** (3 nodes): `UpdateProductController.php`, `UpdateProductController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Destroy Product Controller (Web)`** (3 nodes): `DestroyProductController.php`, `DestroyProductController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Show Google Complete Registration Controller`** (3 nodes): `ShowGoogleCompleteRegistrationController`, `.__invoke()`, `ShowGoogleCompleteRegistrationController.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Google Redirect Controller`** (3 nodes): `GoogleRedirectController`, `.__invoke()`, `GoogleRedirectController.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Get Order Controller (API)`** (3 nodes): `GetOrderController.php`, `GetOrderController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Download Invoice Controller`** (3 nodes): `DownloadInvoiceController.php`, `DownloadInvoiceController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Reorder Controller`** (3 nodes): `ReorderController.php`, `ReorderController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Notification Preferences Resource`** (3 nodes): `NotificationPreferencesResource.php`, `NotificationPreferencesResource`, `.toArray()`
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

- **Why does `Cart` connect `Cart & Checkout API` to `Product Catalog`, `Shipping Label Creation Job`, `Address Management`, `Authentication (Login/Google OAuth)`, `Stock & Inertia Middleware`, `Checkout Order Creation`?**
  _High betweenness centrality (0.118) - this node is a cross-community bridge._
- **Why does `Product` connect `Product Catalog` to `Cart & Checkout API`, `Order Dashboard & Views`, `Banners & Homepage Content`, `Categories & Catalog Browse`, `Stock & Inertia Middleware`?**
  _High betweenness centrality (0.099) - this node is a cross-community bridge._
- **Are the 13 inferred relationships involving `Product` (e.g. with `.__invoke()` and `.__invoke()`) actually correct?**
  _`Product` has 13 INFERRED edges - model-reasoned connections that need verification._
- **Are the 15 inferred relationships involving `Cart` (e.g. with `.__invoke()` and `.__invoke()`) actually correct?**
  _`Cart` has 15 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `Banner` (e.g. with `.__invoke()` and `.__invoke()`) actually correct?**
  _`Banner` has 6 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Controller` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Product Catalog` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._