<?php

use App\Http\Controllers\Admin\Businesses\IndexBusinessesController;
use App\Http\Controllers\Admin\Businesses\StartBusinessScrapeController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\Orders\RetryShippingLabelController;
use App\Http\Controllers\Admin\Users\IndexUsersController;
use App\Http\Controllers\Admin\Users\SendUserPasswordResetController;
use App\Http\Controllers\Admin\Users\ShowUserController;
use App\Http\Controllers\Admin\Users\ToggleUserActiveController;
use App\Http\Controllers\Admin\Users\UpdateUserRoleController;
use App\Http\Controllers\Web\Auth\LoginController;
use App\Http\Controllers\Web\BannersController;
use App\Http\Controllers\Web\CategoriesController;
use App\Http\Controllers\Web\ContentFeaturedProductsController;
use App\Http\Controllers\Web\DashboardController;
use App\Http\Controllers\Web\Products\CreateProductController;
use App\Http\Controllers\Web\Products\DestroyProductController;
use App\Http\Controllers\Web\Products\EditProductController;
use App\Http\Controllers\Web\Products\IndexProductsController;
use App\Http\Controllers\Web\Products\StoreProductController;
use App\Http\Controllers\Web\Products\UpdateProductController;
use App\Http\Controllers\Web\StaticPagesController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');
});

Route::middleware(['auth', 'role:admin,super_admin'])->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/products', IndexProductsController::class)->name('products');
    Route::get('/products/create', CreateProductController::class)->name('products.create');
    Route::post('/products', StoreProductController::class)->name('products.store');
    Route::get('/products/{product}/edit', EditProductController::class)->name('products.edit');
    Route::put('/products/{product}', UpdateProductController::class)->name('products.update');
    Route::delete('/products/{product}', DestroyProductController::class)->name('products.destroy');

    Route::get('/categories', [CategoriesController::class, 'index'])->name('categories');
    Route::post('/categories', [CategoriesController::class, 'store'])->name('categories.store');
    Route::put('/categories/{category}', [CategoriesController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [CategoriesController::class, 'destroy'])->name('categories.destroy');
    Route::post('/categories/reorder', [CategoriesController::class, 'reorder'])->name('categories.reorder');
    Route::patch('/categories/{category}/visibility', [CategoriesController::class, 'toggleVisibility'])
        ->name('categories.toggle-visibility');
    Route::get('/categories/{category}/stats', [CategoriesController::class, 'stats'])->name('categories.stats');

    Route::get('/featured-products', [ContentFeaturedProductsController::class, 'index'])
        ->name('featured-products');
    Route::put('/featured-products', [ContentFeaturedProductsController::class, 'update'])
        ->name('featured-products.update');

    Route::get('/banners', [BannersController::class, 'index'])->name('banners');
    Route::post('/banners', [BannersController::class, 'store'])->name('banners.store');
    Route::put('/banners/{banner}', [BannersController::class, 'update'])->name('banners.update');
    Route::delete('/banners/{banner}', [BannersController::class, 'destroy'])->name('banners.destroy');
    Route::post('/banners/reorder', [BannersController::class, 'reorder'])->name('banners.reorder');
    Route::patch('/banners/{banner}/visibility', [BannersController::class, 'toggleVisibility'])
        ->name('banners.toggle-visibility');

    Route::get('/static-pages', [StaticPagesController::class, 'index'])->name('static-pages');
    Route::get('/static-pages/{staticPage}/edit', [StaticPagesController::class, 'edit'])
        ->name('static-pages.edit');
    Route::put('/static-pages/{staticPage}', [StaticPagesController::class, 'update'])
        ->name('static-pages.update');

    Route::get('/users', IndexUsersController::class)->name('users');
    Route::get('/users/{user}', ShowUserController::class)->name('users.show');
    Route::patch('/users/{user}/role', UpdateUserRoleController::class)->name('users.update-role');
    Route::patch('/users/{user}/toggle-active', ToggleUserActiveController::class)
        ->name('users.toggle-active');
    Route::post('/users/{user}/send-password-reset', SendUserPasswordResetController::class)
        ->name('users.send-password-reset');

    Route::get('/orders', [OrderController::class, 'index'])->name('orders');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.update-status');
    Route::patch('/orders/{order}/tracking', [OrderController::class, 'updateTracking'])
        ->name('orders.update-tracking');
    Route::post('/orders/{order}/refund', [OrderController::class, 'createRefund'])->name('orders.create-refund');
    Route::post('/orders/{order}/notes', [OrderController::class, 'storeNote'])->name('orders.store-note');
    Route::post('/orders/{order}/retry-label', RetryShippingLabelController::class)
        ->name('orders.retry-label');

    Route::get('/businesses', IndexBusinessesController::class)->name('businesses');
    Route::post('/businesses/scrape', StartBusinessScrapeController::class)->name('businesses.scrape');
});
