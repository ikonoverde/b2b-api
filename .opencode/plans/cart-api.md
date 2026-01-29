# Cart API Implementation Plan

## Overview
Implement cart API endpoints for authenticated users with persistent database storage.

## Database Schema

### carts table
- id (primary key)
- user_id (foreign key to users, unique, cascade on delete)
- status (string, default: 'active')
- timestamps

### cart_items table
- id (primary key)
- cart_id (foreign key to carts, cascade on delete)
- product_id (foreign key to products, cascade on delete)
- quantity (integer)
- unit_price (decimal, 10, 2)
- timestamps
- unique constraint on [cart_id, product_id]

## Models

### Cart
- fillable: user_id, status
- casts: user_id (integer)
- relationships: user (BelongsTo), items (HasMany)
- methods: calculateTotals()

### CartItem
- fillable: cart_id, product_id, quantity, unit_price
- casts: cart_id (integer), product_id (integer), quantity (integer), unit_price (decimal:2)
- relationships: cart (BelongsTo), product (BelongsTo)
- accessors: subtotal

## API Endpoints

| Method | Endpoint | Controller | Description |
|--------|----------|------------|-------------|
| GET | /api/cart | GetCartController | Get current user's cart with items |
| POST | /api/cart/items | AddCartItemController | Add product to cart |
| PUT | /api/cart/items/{item} | UpdateCartItemController | Update item quantity |
| DELETE | /api/cart/items/{item} | RemoveCartItemController | Remove item from cart |
| DELETE | /api/cart | ClearCartController | Clear all items from cart |

All endpoints require authentication (auth:sanctum middleware).

## Files to Create

### Migrations
- database/migrations/2026_01_29_032956_create_carts_table.php (already created)
- database/migrations/2026_01_29_032956_create_cart_items_table.php (already created)

### Models
- app/Models/Cart.php (already created, needs implementation)
- app/Models/CartItem.php (already created, needs implementation)

### Controllers
- app/Http/Controllers/Cart/GetCartController.php
- app/Http/Controllers/Cart/AddCartItemController.php
- app/Http/Controllers/Cart/UpdateCartItemController.php
- app/Http/Controllers/Cart/RemoveCartItemController.php
- app/Http/Controllers/Cart/ClearCartController.php

### Form Requests
- app/Http/Requests/Cart/AddCartItemRequest.php
- app/Http/Requests/Cart/UpdateCartItemRequest.php

### Resources
- app/Http/Resources/CartResource.php
- app/Http/Resources/CartItemResource.php

### Routes
Add to routes/api.php:
```php
Route::prefix('cart')->middleware('auth:sanctum')->group(function () {
    Route::get('/', GetCartController::class);
    Route::post('/items', AddCartItemController::class);
    Route::put('/items/{item}', UpdateCartItemController::class);
    Route::delete('/items/{item}', RemoveCartItemController::class);
    Route::delete('/', ClearCartController::class);
});
```

### Tests
- tests/Feature/Cart/CartTest.php

## Features
- One cart per user (enforced by unique constraint)
- Price snapshot when adding items (protects against price changes)
- Stock validation before adding/updating
- Cart totals calculation (subtotal, item_count, total_quantity)
- Automatic cart creation on first item add
- Scribe API documentation annotations

## Validation Rules

### AddCartItemRequest
- product_id: required, exists:products,id
- quantity: required, integer, min:1

### UpdateCartItemRequest
- quantity: required, integer, min:1

## Implementation Complete
