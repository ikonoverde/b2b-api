<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Cart\AddCartItemController;
use App\Http\Controllers\Cart\ClearCartController;
use App\Http\Controllers\Cart\GetCartController;
use App\Http\Controllers\Cart\RemoveCartItemController;
use App\Http\Controllers\Cart\UpdateCartItemController;
use App\Http\Controllers\Checkout\ConfirmPaymentController;
use App\Http\Controllers\Checkout\CreateCheckoutController;
use App\Http\Controllers\FeaturedProductsController;
use App\Http\Controllers\Orders\GetOrderController;
use App\Http\Controllers\Orders\GetOrdersController;
use App\Http\Controllers\ProductDetailController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/register', RegisterController::class);
Route::post('/login', LoginController::class);

Route::get('/user', UserController::class)->middleware('auth:sanctum');

Route::get('/products', ProductsController::class);
Route::get('/products/featured', FeaturedProductsController::class);
Route::get('/products/{product}', ProductDetailController::class);

Route::prefix('cart')->middleware('auth:sanctum')->group(function () {
    Route::get('/', GetCartController::class);
    Route::post('/items', AddCartItemController::class);
    Route::put('/items/{item}', UpdateCartItemController::class);
    Route::delete('/items/{item}', RemoveCartItemController::class);
    Route::delete('/', ClearCartController::class);
});

Route::prefix('checkout')->middleware('auth:sanctum')->group(function () {
    Route::post('/', CreateCheckoutController::class);
    Route::post('/confirm', ConfirmPaymentController::class);
});

Route::prefix('orders')->middleware('auth:sanctum')->group(function () {
    Route::get('/', GetOrdersController::class);
    Route::get('/{order}', GetOrderController::class);
});
