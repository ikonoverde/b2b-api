# Graph Report - .  (2026-06-05)

## Corpus Check
- 168 files · ~26,277 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 814 nodes · 872 edges · 98 communities detected
- Extraction: 86% EXTRACTED · 14% INFERRED · 0% AMBIGUOUS · INFERRED: 119 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Product Catalog Controllers|Product Catalog Controllers]]
- [[_COMMUNITY_Cart & Reorder Actions|Cart & Reorder Actions]]
- [[_COMMUNITY_Admin Business Scraping|Admin Business Scraping]]
- [[_COMMUNITY_Checkout & Order Admin|Checkout & Order Admin]]
- [[_COMMUNITY_Auth & Google OAuth|Auth & Google OAuth]]
- [[_COMMUNITY_Shipping Methods & Order Model|Shipping Methods & Order Model]]
- [[_COMMUNITY_Banners & Dashboards|Banners & Dashboards]]
- [[_COMMUNITY_Categories & Product Forms|Categories & Product Forms]]
- [[_COMMUNITY_Payment Events & Shipping Labels|Payment Events & Shipping Labels]]
- [[_COMMUNITY_Addresses & Checkout Shipping|Addresses & Checkout Shipping]]
- [[_COMMUNITY_Inertia Middleware & Errors|Inertia Middleware & Errors]]
- [[_COMMUNITY_Payment Methods & Stripe|Payment Methods & Stripe]]
- [[_COMMUNITY_Skydropx Shipping Service|Skydropx Shipping Service]]
- [[_COMMUNITY_Product Image Processing|Product Image Processing]]
- [[_COMMUNITY_Static Pages|Static Pages]]
- [[_COMMUNITY_Image Optimization Command|Image Optimization Command]]
- [[_COMMUNITY_Create Checkout Flow|Create Checkout Flow]]
- [[_COMMUNITY_Order API Resources|Order API Resources]]
- [[_COMMUNITY_App Settings Admin|App Settings Admin]]
- [[_COMMUNITY_Register Request Validation|Register Request Validation]]
- [[_COMMUNITY_Production API Service|Production API Service]]
- [[_COMMUNITY_Login Request Validation|Login Request Validation]]
- [[_COMMUNITY_Cart Resources|Cart Resources]]
- [[_COMMUNITY_Product Detail Resources|Product Detail Resources]]
- [[_COMMUNITY_Telescope Provider|Telescope Provider]]
- [[_COMMUNITY_User Model|User Model]]
- [[_COMMUNITY_Order Status History|Order Status History]]
- [[_COMMUNITY_Order Refund Controller|Order Refund Controller]]
- [[_COMMUNITY_Toggle User Active Request|Toggle User Active Request]]
- [[_COMMUNITY_Update User Role Request|Update User Role Request]]
- [[_COMMUNITY_Update Settings Request|Update Settings Request]]
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
- [[_COMMUNITY_Update Notif Prefs Request|Update Notif Prefs Request]]
- [[_COMMUNITY_List Products Request|List Products Request]]
- [[_COMMUNITY_Update Product Request|Update Product Request]]
- [[_COMMUNITY_Store Product Request|Store Product Request]]
- [[_COMMUNITY_Google Complete Reg Request|Google Complete Reg Request]]
- [[_COMMUNITY_Verify Checkout Request|Verify Checkout Request]]
- [[_COMMUNITY_Create Checkout Request|Create Checkout Request]]
- [[_COMMUNITY_Confirm Payment Request|Confirm Payment Request]]
- [[_COMMUNITY_New Order Notification|New Order Notification]]
- [[_COMMUNITY_Order Status Notification|Order Status Notification]]
- [[_COMMUNITY_Order Confirmation Notification|Order Confirmation Notification]]
- [[_COMMUNITY_App Service Provider|App Service Provider]]
- [[_COMMUNITY_Shipping Method Model|Shipping Method Model]]
- [[_COMMUNITY_Logout Controller|Logout Controller]]
- [[_COMMUNITY_Store Payment Method Request|Store Payment Method Request]]
- [[_COMMUNITY_Checkout Request|Checkout Request]]
- [[_COMMUNITY_Shipping Quotes Request|Shipping Quotes Request]]
- [[_COMMUNITY_Update Featured Products Req|Update Featured Products Req]]
- [[_COMMUNITY_Update Banner Request|Update Banner Request]]
- [[_COMMUNITY_Store Banner Request|Store Banner Request]]
- [[_COMMUNITY_Update Static Page Request|Update Static Page Request]]
- [[_COMMUNITY_Generate Image Command|Generate Image Command]]
- [[_COMMUNITY_Product Detail Controller|Product Detail Controller]]
- [[_COMMUNITY_Update User Controller|Update User Controller]]
- [[_COMMUNITY_User Controller|User Controller]]
- [[_COMMUNITY_Toggle User Active Ctrl|Toggle User Active Ctrl]]
- [[_COMMUNITY_Show User Controller|Show User Controller]]
- [[_COMMUNITY_Update User Role Controller|Update User Role Controller]]
- [[_COMMUNITY_Show Order Controller|Show Order Controller]]
- [[_COMMUNITY_Update Order Tracking Ctrl|Update Order Tracking Ctrl]]
- [[_COMMUNITY_Update Order Status Ctrl|Update Order Status Ctrl]]
- [[_COMMUNITY_Store Order Note Controller|Store Order Note Controller]]
- [[_COMMUNITY_Builds Order Show Response|Builds Order Show Response]]
- [[_COMMUNITY_Create Setup Session Ctrl|Create Setup Session Ctrl]]
- [[_COMMUNITY_Destroy Address Controller|Destroy Address Controller]]
- [[_COMMUNITY_Update Address Controller|Update Address Controller]]
- [[_COMMUNITY_Get Notif Prefs Controller|Get Notif Prefs Controller]]
- [[_COMMUNITY_Update Notif Prefs Ctrl|Update Notif Prefs Ctrl]]
- [[_COMMUNITY_Account Controller|Account Controller]]
- [[_COMMUNITY_Update Profile Controller|Update Profile Controller]]
- [[_COMMUNITY_Profile Controller|Profile Controller]]
- [[_COMMUNITY_Notif Prefs Controller|Notif Prefs Controller]]
- [[_COMMUNITY_Update Notif Prefs Ctrl Web|Update Notif Prefs Ctrl Web]]
- [[_COMMUNITY_Update Product Controller|Update Product Controller]]
- [[_COMMUNITY_Destroy Product Controller|Destroy Product Controller]]
- [[_COMMUNITY_Show Google Complete Reg|Show Google Complete Reg]]
- [[_COMMUNITY_Google Redirect Controller|Google Redirect Controller]]
- [[_COMMUNITY_Get Order Controller|Get Order Controller]]
- [[_COMMUNITY_Download Invoice Controller|Download Invoice Controller]]
- [[_COMMUNITY_Reorder Controller|Reorder Controller]]
- [[_COMMUNITY_Notif Prefs Resource|Notif Prefs Resource]]
- [[_COMMUNITY_User Resource|User Resource]]
- [[_COMMUNITY_Static Page Resource|Static Page Resource]]
- [[_COMMUNITY_Role Middleware|Role Middleware]]
- [[_COMMUNITY_Order Confirmation Listener|Order Confirmation Listener]]
- [[_COMMUNITY_Base Controller|Base Controller]]

## God Nodes (most connected - your core abstractions)
1. `Product` - 28 edges
2. `SkydropxService` - 20 edges
3. `Cart` - 20 edges
4. `DashboardController` - 13 edges
5. `Banner` - 12 edges
6. `CreateShippingLabel` - 12 edges
7. `ImportBusinessResults` - 12 edges
8. `OptimizeImageCommand` - 11 edges
9. `CategoriesController` - 11 edges
10. `Order` - 10 edges

## Surprising Connections (you probably didn't know these)
- `ProductImage` --calls--> `deleteProductImages()`  [INFERRED]
  Models/ProductImage.php → Http/Controllers/Web/Products/ManagesProductData.php
- `ProcessProductImage` --calls--> `storeNewImages()`  [INFERRED]
  Jobs/ProcessProductImage.php → Http/Controllers/Web/Products/ManagesProductData.php

## Communities

### Community 0 - "Product Catalog Controllers"
Cohesion: 0.05
Nodes (9): FeaturedProductsController, ProductsController, Product, IndexProductsController, StoreProductController, ProductResource, CartController, ContentFeaturedProductsController (+1 more)

### Community 1 - "Cart & Reorder Actions"
Cohesion: 0.05
Nodes (12): ReorderAction, AddCartItemController, ClearCartController, GetCartController, RemoveCartItemController, UpdateCartItemController, ConfirmPaymentController, GetShippingQuotesController (+4 more)

### Community 2 - "Admin Business Scraping"
Cohesion: 0.06
Nodes (7): IndexBusinessesController, StartBusinessScrapeController, ImportBusinessResults, PollBusinessScrapeStatus, StartBusinessScrape, Business, BusinessScrapeRun

### Community 3 - "Checkout & Order Admin"
Cohesion: 0.09
Nodes (5): ShowCheckoutThankYouController, OrderNote, IndexOrdersController, DashboardController, OrderController

### Community 4 - "Auth & Google OAuth"
Cohesion: 0.07
Nodes (7): GoogleCallbackController, LoginController, RegisterController, StoreGoogleCompleteRegistrationController, NotifyStaffOfNewOrder, OutscraperService, IndexUsersController

### Community 5 - "Shipping Methods & Order Model"
Cohesion: 0.07
Nodes (5): Order, ShippingMethodResource, ParcelCalculator, ShippingQuoteService, GetShippingMethodsController

### Community 6 - "Banners & Dashboards"
Cohesion: 0.07
Nodes (7): BannersController, Banner, BannerResource, MobileBannerResource, BannersController, CustomerDashboardController, HomeController

### Community 7 - "Categories & Product Forms"
Cohesion: 0.08
Nodes (6): CategoriesController, CreateProductController, EditProductController, CategoryResource, CatalogController, CategoriesController

### Community 8 - "Payment Events & Shipping Labels"
Cohesion: 0.13
Nodes (4): PaymentCompleted, CreateShippingLabel, HandleStripeWebhook, RetryShippingLabelController

### Community 9 - "Addresses & Checkout Shipping"
Cohesion: 0.08
Nodes (6): GetAddressesController, StoreAddressController, ShowCheckoutShippingController, Address, AddressResource, AddressesController

### Community 10 - "Inertia Middleware & Errors"
Cohesion: 0.11
Nodes (4): InsufficientStockException, HandleInertiaRequests, Category, HorizonServiceProvider

### Community 11 - "Payment Methods & Stripe"
Cohesion: 0.13
Nodes (4): ShowCheckoutPaymentController, PaymentMethodData, VerifySetupSessionController, PaymentMethodController

### Community 12 - "Skydropx Shipping Service"
Cohesion: 0.19
Nodes (1): SkydropxService

### Community 13 - "Product Image Processing"
Cohesion: 0.14
Nodes (4): ProcessProductImage, ProductImage, deleteProductImages(), storeNewImages()

### Community 14 - "Static Pages"
Cohesion: 0.14
Nodes (4): StaticPagesController, StaticPage, StaticPageController, StaticPagesController

### Community 15 - "Image Optimization Command"
Cohesion: 0.3
Nodes (1): OptimizeImageCommand

### Community 16 - "Create Checkout Flow"
Cohesion: 0.23
Nodes (2): CreateCheckoutController, OrderItem

### Community 17 - "Order API Resources"
Cohesion: 0.17
Nodes (4): GetOrdersController, OrderItemResource, OrderResource, OrderStatusHistoryResource

### Community 18 - "App Settings Admin"
Cohesion: 0.22
Nodes (3): AppSettings, ShowSettingsController, UpdateSettingsController

### Community 19 - "Register Request Validation"
Cohesion: 0.29
Nodes (1): RegisterRequest

### Community 20 - "Production API Service"
Cohesion: 0.47
Nodes (1): ProductionApiService

### Community 21 - "Login Request Validation"
Cohesion: 0.33
Nodes (1): LoginRequest

### Community 22 - "Cart Resources"
Cohesion: 0.33
Nodes (2): CartItemResource, CartResource

### Community 23 - "Product Detail Resources"
Cohesion: 0.33
Nodes (2): ProductDetailResource, ProductImageResource

### Community 24 - "Telescope Provider"
Cohesion: 0.5
Nodes (1): TelescopeServiceProvider

### Community 25 - "User Model"
Cohesion: 0.4
Nodes (1): User

### Community 26 - "Order Status History"
Cohesion: 0.4
Nodes (1): OrderStatusHistory

### Community 27 - "Order Refund Controller"
Cohesion: 0.6
Nodes (1): CreateOrderRefundController

### Community 28 - "Toggle User Active Request"
Cohesion: 0.4
Nodes (1): ToggleUserActiveRequest

### Community 29 - "Update User Role Request"
Cohesion: 0.4
Nodes (1): UpdateUserRoleRequest

### Community 30 - "Update Settings Request"
Cohesion: 0.4
Nodes (1): UpdateSettingsRequest

### Community 31 - "Update Order Status Request"
Cohesion: 0.4
Nodes (1): UpdateOrderStatusRequest

### Community 32 - "Create Order Refund Request"
Cohesion: 0.4
Nodes (1): CreateOrderRefundRequest

### Community 33 - "Update Order Tracking Request"
Cohesion: 0.4
Nodes (1): UpdateOrderTrackingRequest

### Community 34 - "Store Order Note Request"
Cohesion: 0.4
Nodes (1): StoreOrderNoteRequest

### Community 35 - "Add Cart Item Request"
Cohesion: 0.4
Nodes (1): AddCartItemRequest

### Community 36 - "Update Cart Item Request"
Cohesion: 0.4
Nodes (1): UpdateCartItemRequest

### Community 37 - "Create Setup Session Request"
Cohesion: 0.4
Nodes (1): CreateSetupSessionRequest

### Community 38 - "Verify Setup Session Request"
Cohesion: 0.4
Nodes (1): VerifySetupSessionRequest

### Community 39 - "Store Address Request"
Cohesion: 0.4
Nodes (1): StoreAddressRequest

### Community 40 - "Update Address Request"
Cohesion: 0.4
Nodes (1): UpdateAddressRequest

### Community 41 - "Update User Request"
Cohesion: 0.4
Nodes (1): UpdateUserRequest

### Community 42 - "Update Notif Prefs Request"
Cohesion: 0.4
Nodes (1): UpdateNotificationPreferencesRequest

### Community 43 - "List Products Request"
Cohesion: 0.4
Nodes (1): ListProductsRequest

### Community 44 - "Update Product Request"
Cohesion: 0.4
Nodes (1): UpdateProductRequest

### Community 45 - "Store Product Request"
Cohesion: 0.4
Nodes (1): StoreProductRequest

### Community 46 - "Google Complete Reg Request"
Cohesion: 0.4
Nodes (1): GoogleCompleteRegistrationRequest

### Community 47 - "Verify Checkout Request"
Cohesion: 0.4
Nodes (1): VerifyCheckoutRequest

### Community 48 - "Create Checkout Request"
Cohesion: 0.4
Nodes (1): CreateCheckoutRequest

### Community 49 - "Confirm Payment Request"
Cohesion: 0.4
Nodes (1): ConfirmPaymentRequest

### Community 50 - "New Order Notification"
Cohesion: 0.4
Nodes (1): NewOrderReceived

### Community 51 - "Order Status Notification"
Cohesion: 0.4
Nodes (1): OrderStatusChanged

### Community 52 - "Order Confirmation Notification"
Cohesion: 0.4
Nodes (1): OrderConfirmation

### Community 53 - "App Service Provider"
Cohesion: 0.5
Nodes (1): AppServiceProvider

### Community 54 - "Shipping Method Model"
Cohesion: 0.5
Nodes (1): ShippingMethod

### Community 55 - "Logout Controller"
Cohesion: 0.5
Nodes (1): LogoutController

### Community 56 - "Store Payment Method Request"
Cohesion: 0.5
Nodes (1): StorePaymentMethodRequest

### Community 57 - "Checkout Request"
Cohesion: 0.5
Nodes (1): CheckoutRequest

### Community 58 - "Shipping Quotes Request"
Cohesion: 0.5
Nodes (1): ShippingQuotesRequest

### Community 59 - "Update Featured Products Req"
Cohesion: 0.5
Nodes (1): UpdateFeaturedProductsRequest

### Community 60 - "Update Banner Request"
Cohesion: 0.5
Nodes (1): UpdateBannerRequest

### Community 61 - "Store Banner Request"
Cohesion: 0.5
Nodes (1): StoreBannerRequest

### Community 62 - "Update Static Page Request"
Cohesion: 0.5
Nodes (1): UpdateStaticPageRequest

### Community 63 - "Generate Image Command"
Cohesion: 0.67
Nodes (1): GenerateImageCommand

### Community 64 - "Product Detail Controller"
Cohesion: 0.67
Nodes (1): ProductDetailController

### Community 65 - "Update User Controller"
Cohesion: 0.67
Nodes (1): UpdateUserController

### Community 66 - "User Controller"
Cohesion: 0.67
Nodes (1): UserController

### Community 67 - "Toggle User Active Ctrl"
Cohesion: 0.67
Nodes (1): ToggleUserActiveController

### Community 68 - "Show User Controller"
Cohesion: 0.67
Nodes (1): ShowUserController

### Community 69 - "Update User Role Controller"
Cohesion: 0.67
Nodes (1): UpdateUserRoleController

### Community 70 - "Show Order Controller"
Cohesion: 0.67
Nodes (1): ShowOrderController

### Community 71 - "Update Order Tracking Ctrl"
Cohesion: 0.67
Nodes (1): UpdateOrderTrackingController

### Community 72 - "Update Order Status Ctrl"
Cohesion: 0.67
Nodes (1): UpdateOrderStatusController

### Community 73 - "Store Order Note Controller"
Cohesion: 0.67
Nodes (1): StoreOrderNoteController

### Community 74 - "Builds Order Show Response"
Cohesion: 1.0
Nodes (2): formatOrder(), renderOrderShow()

### Community 75 - "Create Setup Session Ctrl"
Cohesion: 0.67
Nodes (1): CreateSetupSessionController

### Community 76 - "Destroy Address Controller"
Cohesion: 0.67
Nodes (1): DestroyAddressController

### Community 77 - "Update Address Controller"
Cohesion: 0.67
Nodes (1): UpdateAddressController

### Community 78 - "Get Notif Prefs Controller"
Cohesion: 0.67
Nodes (1): GetNotificationPreferencesController

### Community 79 - "Update Notif Prefs Ctrl"
Cohesion: 0.67
Nodes (1): UpdateNotificationPreferencesController

### Community 80 - "Account Controller"
Cohesion: 0.67
Nodes (1): AccountController

### Community 81 - "Update Profile Controller"
Cohesion: 0.67
Nodes (1): UpdateProfileController

### Community 82 - "Profile Controller"
Cohesion: 0.67
Nodes (1): ProfileController

### Community 83 - "Notif Prefs Controller"
Cohesion: 0.67
Nodes (1): NotificationPreferencesController

### Community 84 - "Update Notif Prefs Ctrl Web"
Cohesion: 0.67
Nodes (1): UpdateNotificationPreferencesController

### Community 85 - "Update Product Controller"
Cohesion: 0.67
Nodes (1): UpdateProductController

### Community 86 - "Destroy Product Controller"
Cohesion: 0.67
Nodes (1): DestroyProductController

### Community 87 - "Show Google Complete Reg"
Cohesion: 0.67
Nodes (1): ShowGoogleCompleteRegistrationController

### Community 88 - "Google Redirect Controller"
Cohesion: 0.67
Nodes (1): GoogleRedirectController

### Community 89 - "Get Order Controller"
Cohesion: 0.67
Nodes (1): GetOrderController

### Community 90 - "Download Invoice Controller"
Cohesion: 0.67
Nodes (1): DownloadInvoiceController

### Community 91 - "Reorder Controller"
Cohesion: 0.67
Nodes (1): ReorderController

### Community 93 - "Notif Prefs Resource"
Cohesion: 0.67
Nodes (1): NotificationPreferencesResource

### Community 94 - "User Resource"
Cohesion: 0.67
Nodes (1): UserResource

### Community 95 - "Static Page Resource"
Cohesion: 0.67
Nodes (1): StaticPageResource

### Community 96 - "Role Middleware"
Cohesion: 0.67
Nodes (1): RoleMiddleware

### Community 97 - "Order Confirmation Listener"
Cohesion: 0.67
Nodes (1): SendOrderConfirmationNotification

### Community 98 - "Base Controller"
Cohesion: 1.0
Nodes (1): Controller

## Knowledge Gaps
- **1 isolated node(s):** `Controller`
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Skydropx Shipping Service`** (21 nodes): `SkydropxService.php`, `SkydropxService`, `.addressFrom()`, `.buildShipmentPayload()`, `.cacheTokenResponse()`, `.__construct()`, `.createShipment()`, `.fetchQuotes()`, `.fullAddressFrom()`, `.getLabel()`, `.getOauthToken()`, `.getQuote()`, `.getQuotes()`, `.getTracking()`, `.getTrackingInfo()`, `.normalizeResponse()`, `.pollUntilCompleted()`, `.pollUntilTracking()`, `.requestQuotation()`, `.requestTokenViaCredentials()`, `.requestTokenViaRefresh()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Image Optimization Command`** (12 nodes): `OptimizeImageCommand`, `.destinationPath()`, `.encode()`, `.handle()`, `.humanBytes()`, `.imageManager()`, `.isImage()`, `.optimizeFile()`, `.resolveFiles()`, `.savings()`, `.targetExtension()`, `OptimizeImageCommand.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Create Checkout Flow`** (12 nodes): `CreateCheckoutController`, `.buildLineItems()`, `.createOrder()`, `.__invoke()`, `.resolveShipping()`, `.validateStock()`, `CreateCheckoutController.php`, `OrderItem`, `.casts()`, `.order()`, `.product()`, `OrderItem.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Register Request Validation`** (7 nodes): `RegisterRequest`, `.authorize()`, `.bodyParameters()`, `.messages()`, `.rules()`, `RegisterRequest.php`, `RegisterRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Production API Service`** (6 nodes): `ProductionApiService.php`, `ProductionApiService`, `.__construct()`, `.fetchFormulas()`, `.getAccessToken()`, `.getFormulas()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Login Request Validation`** (6 nodes): `LoginRequest`, `.authorize()`, `.bodyParameters()`, `.rules()`, `LoginRequest.php`, `LoginRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Cart Resources`** (6 nodes): `CartItemResource.php`, `CartResource.php`, `CartItemResource`, `.toArray()`, `CartResource`, `.toArray()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Product Detail Resources`** (6 nodes): `ProductDetailResource.php`, `ProductImageResource.php`, `ProductDetailResource`, `.toArray()`, `ProductImageResource`, `.toArray()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Telescope Provider`** (5 nodes): `TelescopeServiceProvider.php`, `TelescopeServiceProvider`, `.gate()`, `.hideSensitiveRequestDetails()`, `.register()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `User Model`** (5 nodes): `User.php`, `User`, `.addresses()`, `.casts()`, `.orders()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Order Status History`** (5 nodes): `OrderStatusHistory`, `.admin()`, `.casts()`, `.order()`, `OrderStatusHistory.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Order Refund Controller`** (5 nodes): `CreateOrderRefundController.php`, `CreateOrderRefundController`, `.__invoke()`, `.processStripeRefund()`, `.validateRefundEligibility()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Toggle User Active Request`** (5 nodes): `ToggleUserActiveRequest.php`, `ToggleUserActiveRequest`, `.authorize()`, `.messages()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update User Role Request`** (5 nodes): `UpdateUserRoleRequest.php`, `UpdateUserRoleRequest`, `.authorize()`, `.messages()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Settings Request`** (5 nodes): `UpdateSettingsRequest.php`, `UpdateSettingsRequest`, `.authorize()`, `.messages()`, `.rules()`
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
- **Thin community `Update Notif Prefs Request`** (5 nodes): `UpdateNotificationPreferencesRequest.php`, `UpdateNotificationPreferencesRequest`, `.authorize()`, `.bodyParameters()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `List Products Request`** (5 nodes): `ListProductsRequest.php`, `ListProductsRequest`, `.authorize()`, `.queryParameters()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Product Request`** (5 nodes): `UpdateProductRequest.php`, `UpdateProductRequest`, `.authorize()`, `.prepareForValidation()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Store Product Request`** (5 nodes): `StoreProductRequest.php`, `StoreProductRequest`, `.authorize()`, `.prepareForValidation()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Google Complete Reg Request`** (5 nodes): `GoogleCompleteRegistrationRequest`, `.authorize()`, `.messages()`, `.rules()`, `GoogleCompleteRegistrationRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Verify Checkout Request`** (5 nodes): `VerifyCheckoutRequest`, `.authorize()`, `.queryParameters()`, `.rules()`, `VerifyCheckoutRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Create Checkout Request`** (5 nodes): `CreateCheckoutRequest`, `.authorize()`, `.bodyParameters()`, `.rules()`, `CreateCheckoutRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Confirm Payment Request`** (5 nodes): `ConfirmPaymentRequest`, `.authorize()`, `.bodyParameters()`, `.rules()`, `ConfirmPaymentRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `New Order Notification`** (5 nodes): `NewOrderReceived.php`, `NewOrderReceived`, `.__construct()`, `.toMail()`, `.via()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Order Status Notification`** (5 nodes): `OrderStatusChanged.php`, `OrderStatusChanged`, `.__construct()`, `.toMail()`, `.via()`
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
- **Thin community `Checkout Request`** (4 nodes): `CheckoutRequest.php`, `CheckoutRequest`, `.authorize()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Shipping Quotes Request`** (4 nodes): `ShippingQuotesRequest.php`, `ShippingQuotesRequest`, `.authorize()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Featured Products Req`** (4 nodes): `UpdateFeaturedProductsRequest`, `.authorize()`, `.rules()`, `UpdateFeaturedProductsRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Banner Request`** (4 nodes): `UpdateBannerRequest`, `.authorize()`, `.rules()`, `UpdateBannerRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Store Banner Request`** (4 nodes): `StoreBannerRequest`, `.authorize()`, `.rules()`, `StoreBannerRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Static Page Request`** (4 nodes): `UpdateStaticPageRequest`, `.authorize()`, `.rules()`, `UpdateStaticPageRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Generate Image Command`** (3 nodes): `GenerateImageCommand`, `.handle()`, `GenerateImageCommand.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Product Detail Controller`** (3 nodes): `ProductDetailController`, `.__invoke()`, `ProductDetailController.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update User Controller`** (3 nodes): `UpdateUserController`, `.__invoke()`, `UpdateUserController.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `User Controller`** (3 nodes): `UserController`, `.__invoke()`, `UserController.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Toggle User Active Ctrl`** (3 nodes): `ToggleUserActiveController.php`, `ToggleUserActiveController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Show User Controller`** (3 nodes): `ShowUserController.php`, `ShowUserController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update User Role Controller`** (3 nodes): `UpdateUserRoleController.php`, `UpdateUserRoleController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Show Order Controller`** (3 nodes): `ShowOrderController.php`, `ShowOrderController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Order Tracking Ctrl`** (3 nodes): `UpdateOrderTrackingController.php`, `UpdateOrderTrackingController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Order Status Ctrl`** (3 nodes): `UpdateOrderStatusController.php`, `UpdateOrderStatusController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Store Order Note Controller`** (3 nodes): `StoreOrderNoteController.php`, `StoreOrderNoteController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Builds Order Show Response`** (3 nodes): `formatOrder()`, `renderOrderShow()`, `BuildsOrderShowResponse.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Create Setup Session Ctrl`** (3 nodes): `CreateSetupSessionController.php`, `CreateSetupSessionController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Destroy Address Controller`** (3 nodes): `DestroyAddressController`, `.__invoke()`, `DestroyAddressController.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Address Controller`** (3 nodes): `UpdateAddressController`, `.__invoke()`, `UpdateAddressController.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Get Notif Prefs Controller`** (3 nodes): `GetNotificationPreferencesController.php`, `GetNotificationPreferencesController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Notif Prefs Ctrl`** (3 nodes): `UpdateNotificationPreferencesController.php`, `UpdateNotificationPreferencesController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Account Controller`** (3 nodes): `AccountController.php`, `AccountController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Profile Controller`** (3 nodes): `UpdateProfileController.php`, `UpdateProfileController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Profile Controller`** (3 nodes): `ProfileController.php`, `ProfileController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Notif Prefs Controller`** (3 nodes): `NotificationPreferencesController.php`, `NotificationPreferencesController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Notif Prefs Ctrl Web`** (3 nodes): `UpdateNotificationPreferencesController.php`, `UpdateNotificationPreferencesController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Product Controller`** (3 nodes): `UpdateProductController.php`, `UpdateProductController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Destroy Product Controller`** (3 nodes): `DestroyProductController.php`, `DestroyProductController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Show Google Complete Reg`** (3 nodes): `ShowGoogleCompleteRegistrationController`, `.__invoke()`, `ShowGoogleCompleteRegistrationController.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Google Redirect Controller`** (3 nodes): `GoogleRedirectController`, `.__invoke()`, `GoogleRedirectController.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Get Order Controller`** (3 nodes): `GetOrderController.php`, `GetOrderController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Download Invoice Controller`** (3 nodes): `DownloadInvoiceController.php`, `DownloadInvoiceController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Reorder Controller`** (3 nodes): `ReorderController.php`, `ReorderController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Notif Prefs Resource`** (3 nodes): `NotificationPreferencesResource.php`, `NotificationPreferencesResource`, `.toArray()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `User Resource`** (3 nodes): `UserResource.php`, `UserResource`, `.toArray()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Static Page Resource`** (3 nodes): `StaticPageResource.php`, `StaticPageResource`, `.toArray()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Role Middleware`** (3 nodes): `RoleMiddleware.php`, `RoleMiddleware`, `.handle()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Order Confirmation Listener`** (3 nodes): `SendOrderConfirmationNotification.php`, `SendOrderConfirmationNotification`, `.handle()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Base Controller`** (2 nodes): `Controller`, `Controller.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Cart` connect `Cart & Reorder Actions` to `Product Catalog Controllers`, `Auth & Google OAuth`, `Payment Events & Shipping Labels`, `Addresses & Checkout Shipping`, `Inertia Middleware & Errors`, `Create Checkout Flow`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **Why does `Product` connect `Product Catalog Controllers` to `Cart & Reorder Actions`, `Checkout & Order Admin`, `Banners & Dashboards`, `Categories & Product Forms`, `Inertia Middleware & Errors`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Are the 13 inferred relationships involving `Product` (e.g. with `.__invoke()` and `.__invoke()`) actually correct?**
  _`Product` has 13 INFERRED edges - model-reasoned connections that need verification._
- **Are the 15 inferred relationships involving `Cart` (e.g. with `.__invoke()` and `.__invoke()`) actually correct?**
  _`Cart` has 15 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `Banner` (e.g. with `.__invoke()` and `.__invoke()`) actually correct?**
  _`Banner` has 6 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Controller` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Product Catalog Controllers` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._