# Graph Report - api  (2026-05-07)

## Corpus Check
- 176 files · ~25,253 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 766 nodes · 804 edges · 95 communities detected
- Extraction: 86% EXTRACTED · 14% INFERRED · 0% AMBIGUOUS · INFERRED: 113 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 84|Community 84]]
- [[_COMMUNITY_Community 85|Community 85]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 89|Community 89]]
- [[_COMMUNITY_Community 90|Community 90]]
- [[_COMMUNITY_Community 91|Community 91]]
- [[_COMMUNITY_Community 92|Community 92]]
- [[_COMMUNITY_Community 93|Community 93]]
- [[_COMMUNITY_Community 94|Community 94]]

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
- `ProductImage` --calls--> `deleteProductImages()`  [INFERRED]
  Models/ProductImage.php → Http/Controllers/Web/Products/ManagesProductData.php
- `ProcessProductImage` --calls--> `storeNewImages()`  [INFERRED]
  Jobs/ProcessProductImage.php → Http/Controllers/Web/Products/ManagesProductData.php

## Communities

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (12): ReorderAction, AddCartItemController, ClearCartController, GetCartController, RemoveCartItemController, UpdateCartItemController, ConfirmPaymentController, GetShippingQuotesController (+4 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (9): FeaturedProductsController, ProductsController, Product, IndexProductsController, StoreProductController, ProductResource, CartController, ContentFeaturedProductsController (+1 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (7): IndexBusinessesController, StartBusinessScrapeController, ImportBusinessResults, PollBusinessScrapeStatus, StartBusinessScrape, Business, BusinessScrapeRun

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (6): ShowCheckoutPaymentController, ShowCheckoutThankYouController, OrderNote, IndexOrdersController, DashboardController, OrderController

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (7): BannersController, Banner, BannerResource, MobileBannerResource, BannersController, CustomerDashboardController, HomeController

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (6): CategoriesController, CreateProductController, EditProductController, CategoryResource, CatalogController, CategoriesController

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (5): Order, ShippingMethodResource, ParcelCalculator, ShippingQuoteService, GetShippingMethodsController

### Community 7 - "Community 7"
Cohesion: 0.14
Nodes (3): CreateShippingLabel, HandleStripeWebhook, RetryShippingLabelController

### Community 8 - "Community 8"
Cohesion: 0.08
Nodes (6): GetAddressesController, StoreAddressController, ShowCheckoutShippingController, Address, AddressResource, AddressesController

### Community 9 - "Community 9"
Cohesion: 0.09
Nodes (5): GoogleCallbackController, LoginController, RegisterController, StoreGoogleCompleteRegistrationController, IndexUsersController

### Community 10 - "Community 10"
Cohesion: 0.11
Nodes (4): InsufficientStockException, HandleInertiaRequests, Category, HorizonServiceProvider

### Community 11 - "Community 11"
Cohesion: 0.19
Nodes (1): SkydropxService

### Community 12 - "Community 12"
Cohesion: 0.16
Nodes (3): PaymentMethodData, VerifySetupSessionController, PaymentMethodController

### Community 13 - "Community 13"
Cohesion: 0.14
Nodes (4): ProcessProductImage, ProductImage, deleteProductImages(), storeNewImages()

### Community 14 - "Community 14"
Cohesion: 0.14
Nodes (4): StaticPagesController, StaticPage, StaticPageController, StaticPagesController

### Community 15 - "Community 15"
Cohesion: 0.23
Nodes (2): CreateCheckoutController, OrderItem

### Community 16 - "Community 16"
Cohesion: 0.17
Nodes (4): GetOrdersController, OrderItemResource, OrderResource, OrderStatusHistoryResource

### Community 17 - "Community 17"
Cohesion: 0.22
Nodes (3): AppSettings, ShowSettingsController, UpdateSettingsController

### Community 18 - "Community 18"
Cohesion: 0.29
Nodes (1): RegisterRequest

### Community 19 - "Community 19"
Cohesion: 0.47
Nodes (1): ProductionApiService

### Community 20 - "Community 20"
Cohesion: 0.4
Nodes (1): OutscraperService

### Community 21 - "Community 21"
Cohesion: 0.33
Nodes (1): LoginRequest

### Community 22 - "Community 22"
Cohesion: 0.33
Nodes (2): CartItemResource, CartResource

### Community 23 - "Community 23"
Cohesion: 0.33
Nodes (2): ProductDetailResource, ProductImageResource

### Community 24 - "Community 24"
Cohesion: 0.5
Nodes (1): TelescopeServiceProvider

### Community 25 - "Community 25"
Cohesion: 0.4
Nodes (1): User

### Community 26 - "Community 26"
Cohesion: 0.4
Nodes (1): OrderStatusHistory

### Community 27 - "Community 27"
Cohesion: 0.6
Nodes (1): CreateOrderRefundController

### Community 28 - "Community 28"
Cohesion: 0.4
Nodes (1): ToggleUserActiveRequest

### Community 29 - "Community 29"
Cohesion: 0.4
Nodes (1): UpdateUserRoleRequest

### Community 30 - "Community 30"
Cohesion: 0.4
Nodes (1): UpdateSettingsRequest

### Community 31 - "Community 31"
Cohesion: 0.4
Nodes (1): UpdateOrderStatusRequest

### Community 32 - "Community 32"
Cohesion: 0.4
Nodes (1): CreateOrderRefundRequest

### Community 33 - "Community 33"
Cohesion: 0.4
Nodes (1): UpdateOrderTrackingRequest

### Community 34 - "Community 34"
Cohesion: 0.4
Nodes (1): StoreOrderNoteRequest

### Community 35 - "Community 35"
Cohesion: 0.4
Nodes (1): AddCartItemRequest

### Community 36 - "Community 36"
Cohesion: 0.4
Nodes (1): UpdateCartItemRequest

### Community 37 - "Community 37"
Cohesion: 0.4
Nodes (1): CreateSetupSessionRequest

### Community 38 - "Community 38"
Cohesion: 0.4
Nodes (1): VerifySetupSessionRequest

### Community 39 - "Community 39"
Cohesion: 0.4
Nodes (1): StoreAddressRequest

### Community 40 - "Community 40"
Cohesion: 0.4
Nodes (1): UpdateAddressRequest

### Community 41 - "Community 41"
Cohesion: 0.4
Nodes (1): UpdateUserRequest

### Community 42 - "Community 42"
Cohesion: 0.4
Nodes (1): UpdateNotificationPreferencesRequest

### Community 43 - "Community 43"
Cohesion: 0.4
Nodes (1): ListProductsRequest

### Community 44 - "Community 44"
Cohesion: 0.4
Nodes (1): GoogleCompleteRegistrationRequest

### Community 45 - "Community 45"
Cohesion: 0.4
Nodes (1): VerifyCheckoutRequest

### Community 46 - "Community 46"
Cohesion: 0.4
Nodes (1): CreateCheckoutRequest

### Community 47 - "Community 47"
Cohesion: 0.4
Nodes (1): ConfirmPaymentRequest

### Community 48 - "Community 48"
Cohesion: 0.4
Nodes (1): OrderStatusChanged

### Community 49 - "Community 49"
Cohesion: 0.4
Nodes (1): OrderConfirmation

### Community 50 - "Community 50"
Cohesion: 0.5
Nodes (1): AppServiceProvider

### Community 51 - "Community 51"
Cohesion: 0.5
Nodes (1): ShippingMethod

### Community 52 - "Community 52"
Cohesion: 0.5
Nodes (1): LogoutController

### Community 53 - "Community 53"
Cohesion: 0.5
Nodes (1): StorePaymentMethodRequest

### Community 54 - "Community 54"
Cohesion: 0.5
Nodes (1): CheckoutRequest

### Community 55 - "Community 55"
Cohesion: 0.5
Nodes (1): ShippingQuotesRequest

### Community 56 - "Community 56"
Cohesion: 0.5
Nodes (1): UpdateFeaturedProductsRequest

### Community 57 - "Community 57"
Cohesion: 0.5
Nodes (1): UpdateBannerRequest

### Community 58 - "Community 58"
Cohesion: 0.5
Nodes (1): StoreBannerRequest

### Community 59 - "Community 59"
Cohesion: 0.5
Nodes (1): UpdateStaticPageRequest

### Community 60 - "Community 60"
Cohesion: 0.5
Nodes (1): UpdateProductRequest

### Community 61 - "Community 61"
Cohesion: 0.5
Nodes (1): StoreProductRequest

### Community 62 - "Community 62"
Cohesion: 0.67
Nodes (1): ProductDetailController

### Community 63 - "Community 63"
Cohesion: 0.67
Nodes (1): UpdateUserController

### Community 64 - "Community 64"
Cohesion: 0.67
Nodes (1): UserController

### Community 65 - "Community 65"
Cohesion: 0.67
Nodes (1): ToggleUserActiveController

### Community 66 - "Community 66"
Cohesion: 0.67
Nodes (1): ShowUserController

### Community 67 - "Community 67"
Cohesion: 0.67
Nodes (1): UpdateUserRoleController

### Community 68 - "Community 68"
Cohesion: 0.67
Nodes (1): ShowOrderController

### Community 69 - "Community 69"
Cohesion: 0.67
Nodes (1): UpdateOrderTrackingController

### Community 70 - "Community 70"
Cohesion: 0.67
Nodes (1): UpdateOrderStatusController

### Community 71 - "Community 71"
Cohesion: 0.67
Nodes (1): StoreOrderNoteController

### Community 72 - "Community 72"
Cohesion: 1.0
Nodes (2): formatOrder(), renderOrderShow()

### Community 73 - "Community 73"
Cohesion: 0.67
Nodes (1): CreateSetupSessionController

### Community 74 - "Community 74"
Cohesion: 0.67
Nodes (1): DestroyAddressController

### Community 75 - "Community 75"
Cohesion: 0.67
Nodes (1): UpdateAddressController

### Community 76 - "Community 76"
Cohesion: 0.67
Nodes (1): GetNotificationPreferencesController

### Community 77 - "Community 77"
Cohesion: 0.67
Nodes (1): UpdateNotificationPreferencesController

### Community 78 - "Community 78"
Cohesion: 0.67
Nodes (1): AccountController

### Community 79 - "Community 79"
Cohesion: 0.67
Nodes (1): UpdateProfileController

### Community 80 - "Community 80"
Cohesion: 0.67
Nodes (1): ProfileController

### Community 81 - "Community 81"
Cohesion: 0.67
Nodes (1): NotificationPreferencesController

### Community 82 - "Community 82"
Cohesion: 0.67
Nodes (1): UpdateNotificationPreferencesController

### Community 83 - "Community 83"
Cohesion: 0.67
Nodes (1): UpdateProductController

### Community 84 - "Community 84"
Cohesion: 0.67
Nodes (1): DestroyProductController

### Community 85 - "Community 85"
Cohesion: 0.67
Nodes (1): ShowGoogleCompleteRegistrationController

### Community 86 - "Community 86"
Cohesion: 0.67
Nodes (1): GoogleRedirectController

### Community 87 - "Community 87"
Cohesion: 0.67
Nodes (1): GetOrderController

### Community 88 - "Community 88"
Cohesion: 0.67
Nodes (1): DownloadInvoiceController

### Community 89 - "Community 89"
Cohesion: 0.67
Nodes (1): ReorderController

### Community 90 - "Community 90"
Cohesion: 0.67
Nodes (1): NotificationPreferencesResource

### Community 91 - "Community 91"
Cohesion: 0.67
Nodes (1): UserResource

### Community 92 - "Community 92"
Cohesion: 0.67
Nodes (1): StaticPageResource

### Community 93 - "Community 93"
Cohesion: 0.67
Nodes (1): RoleMiddleware

### Community 94 - "Community 94"
Cohesion: 1.0
Nodes (1): Controller

## Knowledge Gaps
- **1 isolated node(s):** `Controller`
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 11`** (21 nodes): `SkydropxService.php`, `SkydropxService`, `.addressFrom()`, `.buildShipmentPayload()`, `.cacheTokenResponse()`, `.__construct()`, `.createShipment()`, `.fetchQuotes()`, `.fullAddressFrom()`, `.getLabel()`, `.getOauthToken()`, `.getQuote()`, `.getQuotes()`, `.getTracking()`, `.getTrackingInfo()`, `.normalizeResponse()`, `.pollUntilCompleted()`, `.pollUntilTracking()`, `.requestQuotation()`, `.requestTokenViaCredentials()`, `.requestTokenViaRefresh()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (12 nodes): `CreateCheckoutController`, `.buildLineItems()`, `.createOrder()`, `.__invoke()`, `.resolveShipping()`, `.validateStock()`, `CreateCheckoutController.php`, `OrderItem`, `.casts()`, `.order()`, `.product()`, `OrderItem.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (7 nodes): `RegisterRequest`, `.authorize()`, `.bodyParameters()`, `.messages()`, `.rules()`, `RegisterRequest.php`, `RegisterRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (6 nodes): `ProductionApiService.php`, `ProductionApiService`, `.__construct()`, `.fetchFormulas()`, `.getAccessToken()`, `.getFormulas()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (6 nodes): `OutscraperService`, `.__construct()`, `.flattenData()`, `.getRequestStatus()`, `.startSearch()`, `OutscraperService.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (6 nodes): `LoginRequest`, `.authorize()`, `.bodyParameters()`, `.rules()`, `LoginRequest.php`, `LoginRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (6 nodes): `CartItemResource.php`, `CartResource.php`, `CartItemResource`, `.toArray()`, `CartResource`, `.toArray()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (6 nodes): `ProductDetailResource.php`, `ProductImageResource.php`, `ProductDetailResource`, `.toArray()`, `ProductImageResource`, `.toArray()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (5 nodes): `TelescopeServiceProvider.php`, `TelescopeServiceProvider`, `.gate()`, `.hideSensitiveRequestDetails()`, `.register()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (5 nodes): `User.php`, `User`, `.addresses()`, `.casts()`, `.orders()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (5 nodes): `OrderStatusHistory`, `.admin()`, `.casts()`, `.order()`, `OrderStatusHistory.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (5 nodes): `CreateOrderRefundController.php`, `CreateOrderRefundController`, `.__invoke()`, `.processStripeRefund()`, `.validateRefundEligibility()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (5 nodes): `ToggleUserActiveRequest.php`, `ToggleUserActiveRequest`, `.authorize()`, `.messages()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (5 nodes): `UpdateUserRoleRequest.php`, `UpdateUserRoleRequest`, `.authorize()`, `.messages()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (5 nodes): `UpdateSettingsRequest.php`, `UpdateSettingsRequest`, `.authorize()`, `.messages()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (5 nodes): `UpdateOrderStatusRequest.php`, `UpdateOrderStatusRequest`, `.authorize()`, `.messages()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (5 nodes): `CreateOrderRefundRequest.php`, `CreateOrderRefundRequest`, `.authorize()`, `.messages()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (5 nodes): `UpdateOrderTrackingRequest.php`, `UpdateOrderTrackingRequest`, `.authorize()`, `.messages()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (5 nodes): `StoreOrderNoteRequest.php`, `StoreOrderNoteRequest`, `.authorize()`, `.messages()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 35`** (5 nodes): `AddCartItemRequest`, `.authorize()`, `.bodyParameters()`, `.rules()`, `AddCartItemRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 36`** (5 nodes): `UpdateCartItemRequest`, `.authorize()`, `.bodyParameters()`, `.rules()`, `UpdateCartItemRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (5 nodes): `CreateSetupSessionRequest.php`, `CreateSetupSessionRequest`, `.authorize()`, `.bodyParameters()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 38`** (5 nodes): `VerifySetupSessionRequest.php`, `VerifySetupSessionRequest`, `.authorize()`, `.queryParameters()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 39`** (5 nodes): `StoreAddressRequest`, `.authorize()`, `.bodyParameters()`, `.rules()`, `StoreAddressRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 40`** (5 nodes): `UpdateAddressRequest`, `.authorize()`, `.bodyParameters()`, `.rules()`, `UpdateAddressRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 41`** (5 nodes): `UpdateUserRequest.php`, `UpdateUserRequest`, `.authorize()`, `.bodyParameters()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 42`** (5 nodes): `UpdateNotificationPreferencesRequest.php`, `UpdateNotificationPreferencesRequest`, `.authorize()`, `.bodyParameters()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 43`** (5 nodes): `ListProductsRequest.php`, `ListProductsRequest`, `.authorize()`, `.queryParameters()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 44`** (5 nodes): `GoogleCompleteRegistrationRequest`, `.authorize()`, `.messages()`, `.rules()`, `GoogleCompleteRegistrationRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 45`** (5 nodes): `VerifyCheckoutRequest`, `.authorize()`, `.queryParameters()`, `.rules()`, `VerifyCheckoutRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 46`** (5 nodes): `CreateCheckoutRequest`, `.authorize()`, `.bodyParameters()`, `.rules()`, `CreateCheckoutRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 47`** (5 nodes): `ConfirmPaymentRequest`, `.authorize()`, `.bodyParameters()`, `.rules()`, `ConfirmPaymentRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 48`** (5 nodes): `OrderStatusChanged.php`, `OrderStatusChanged`, `.__construct()`, `.toMail()`, `.via()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 49`** (5 nodes): `OrderConfirmation.php`, `OrderConfirmation`, `.__construct()`, `.toMail()`, `.via()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 50`** (4 nodes): `AppServiceProvider`, `.boot()`, `.register()`, `AppServiceProvider.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 51`** (4 nodes): `ShippingMethod.php`, `ShippingMethod`, `.casts()`, `.orders()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 52`** (4 nodes): `LogoutController`, `.__invoke()`, `LogoutController.php`, `LogoutController.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 53`** (4 nodes): `StorePaymentMethodRequest.php`, `StorePaymentMethodRequest`, `.authorize()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 54`** (4 nodes): `CheckoutRequest.php`, `CheckoutRequest`, `.authorize()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 55`** (4 nodes): `ShippingQuotesRequest.php`, `ShippingQuotesRequest`, `.authorize()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 56`** (4 nodes): `UpdateFeaturedProductsRequest`, `.authorize()`, `.rules()`, `UpdateFeaturedProductsRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 57`** (4 nodes): `UpdateBannerRequest`, `.authorize()`, `.rules()`, `UpdateBannerRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 58`** (4 nodes): `StoreBannerRequest`, `.authorize()`, `.rules()`, `StoreBannerRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 59`** (4 nodes): `UpdateStaticPageRequest`, `.authorize()`, `.rules()`, `UpdateStaticPageRequest.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 60`** (4 nodes): `UpdateProductRequest.php`, `UpdateProductRequest`, `.authorize()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 61`** (4 nodes): `StoreProductRequest.php`, `StoreProductRequest`, `.authorize()`, `.rules()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 62`** (3 nodes): `ProductDetailController`, `.__invoke()`, `ProductDetailController.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 63`** (3 nodes): `UpdateUserController`, `.__invoke()`, `UpdateUserController.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 64`** (3 nodes): `UserController`, `.__invoke()`, `UserController.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 65`** (3 nodes): `ToggleUserActiveController.php`, `ToggleUserActiveController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 66`** (3 nodes): `ShowUserController.php`, `ShowUserController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 67`** (3 nodes): `UpdateUserRoleController.php`, `UpdateUserRoleController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 68`** (3 nodes): `ShowOrderController.php`, `ShowOrderController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 69`** (3 nodes): `UpdateOrderTrackingController.php`, `UpdateOrderTrackingController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 70`** (3 nodes): `UpdateOrderStatusController.php`, `UpdateOrderStatusController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 71`** (3 nodes): `StoreOrderNoteController.php`, `StoreOrderNoteController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 72`** (3 nodes): `formatOrder()`, `renderOrderShow()`, `BuildsOrderShowResponse.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 73`** (3 nodes): `CreateSetupSessionController.php`, `CreateSetupSessionController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 74`** (3 nodes): `DestroyAddressController`, `.__invoke()`, `DestroyAddressController.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 75`** (3 nodes): `UpdateAddressController`, `.__invoke()`, `UpdateAddressController.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 76`** (3 nodes): `GetNotificationPreferencesController.php`, `GetNotificationPreferencesController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 77`** (3 nodes): `UpdateNotificationPreferencesController.php`, `UpdateNotificationPreferencesController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 78`** (3 nodes): `AccountController.php`, `AccountController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 79`** (3 nodes): `UpdateProfileController.php`, `UpdateProfileController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 80`** (3 nodes): `ProfileController.php`, `ProfileController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 81`** (3 nodes): `NotificationPreferencesController.php`, `NotificationPreferencesController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 82`** (3 nodes): `UpdateNotificationPreferencesController.php`, `UpdateNotificationPreferencesController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 83`** (3 nodes): `UpdateProductController.php`, `UpdateProductController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 84`** (3 nodes): `DestroyProductController.php`, `DestroyProductController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 85`** (3 nodes): `ShowGoogleCompleteRegistrationController`, `.__invoke()`, `ShowGoogleCompleteRegistrationController.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 86`** (3 nodes): `GoogleRedirectController`, `.__invoke()`, `GoogleRedirectController.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 87`** (3 nodes): `GetOrderController.php`, `GetOrderController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 88`** (3 nodes): `DownloadInvoiceController.php`, `DownloadInvoiceController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 89`** (3 nodes): `ReorderController.php`, `ReorderController`, `.__invoke()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 90`** (3 nodes): `NotificationPreferencesResource.php`, `NotificationPreferencesResource`, `.toArray()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 91`** (3 nodes): `UserResource.php`, `UserResource`, `.toArray()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 92`** (3 nodes): `StaticPageResource.php`, `StaticPageResource`, `.toArray()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 93`** (3 nodes): `RoleMiddleware.php`, `RoleMiddleware`, `.handle()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 94`** (2 nodes): `Controller`, `Controller.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Cart` connect `Community 0` to `Community 1`, `Community 7`, `Community 8`, `Community 9`, `Community 10`, `Community 15`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **Why does `Product` connect `Community 1` to `Community 0`, `Community 3`, `Community 4`, `Community 5`, `Community 10`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Are the 13 inferred relationships involving `Product` (e.g. with `.__invoke()` and `.__invoke()`) actually correct?**
  _`Product` has 13 INFERRED edges - model-reasoned connections that need verification._
- **Are the 15 inferred relationships involving `Cart` (e.g. with `.__invoke()` and `.__invoke()`) actually correct?**
  _`Cart` has 15 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `Banner` (e.g. with `.__invoke()` and `.__invoke()`) actually correct?**
  _`Banner` has 6 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Controller` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._