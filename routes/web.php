<?php

use App\Http\Controllers\Web\AccountController;
use App\Http\Controllers\Web\AddressesController;
use App\Http\Controllers\Web\Auth\ForgotPasswordController;
use App\Http\Controllers\Web\Auth\GoogleCallbackController;
use App\Http\Controllers\Web\Auth\GoogleRedirectController;
use App\Http\Controllers\Web\Auth\LoginController;
use App\Http\Controllers\Web\Auth\LogoutController;
use App\Http\Controllers\Web\Auth\RegisterController;
use App\Http\Controllers\Web\Auth\ResetPasswordController;
use App\Http\Controllers\Web\Auth\ShowGoogleCompleteRegistrationController;
use App\Http\Controllers\Web\Auth\StoreGoogleCompleteRegistrationController;
use App\Http\Controllers\Web\CartController;
use App\Http\Controllers\Web\CatalogController;
use App\Http\Controllers\Web\Checkout\GetShippingQuotesController;
use App\Http\Controllers\Web\Checkout\ShowCheckoutPaymentController;
use App\Http\Controllers\Web\Checkout\ShowCheckoutShippingController;
use App\Http\Controllers\Web\Checkout\ShowCheckoutThankYouController;
use App\Http\Controllers\Web\Checkout\StoreCheckoutShippingController;
use App\Http\Controllers\Web\CustomerDashboardController;
use App\Http\Controllers\Web\HomeController;
use App\Http\Controllers\Web\NotificationPreferencesController;
use App\Http\Controllers\Web\OrderController;
use App\Http\Controllers\Web\PaymentMethodController;
use App\Http\Controllers\Web\ProductController;
use App\Http\Controllers\Web\ProfileController;
use App\Http\Controllers\Web\StaticPageController;
use App\Http\Controllers\Web\UpdateNotificationPreferencesController;
use App\Http\Controllers\Web\UpdateProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/catalog', CatalogController::class)->name('catalog');

Route::middleware('guest')->group(function () {
    Route::get('/reset-password/{token}', function (string $token, Request $request) {
        return Inertia::render('Auth/ResetPassword', [
            'token' => $token,
            'email' => $request->input('email', ''),
        ]);
    })->name('password.reset');

    Route::post('/reset-password', ResetPasswordController::class)->name('password.update');
});

Route::get('/terms', [StaticPageController::class, 'show'])->defaults('slug', 'terms')->name('terms');
Route::get('/privacy', [StaticPageController::class, 'show'])->defaults('slug', 'privacy')->name('privacy');
Route::get('/about', [StaticPageController::class, 'show'])->defaults('slug', 'about')->name('about');
Route::get('/faq', [StaticPageController::class, 'show'])->defaults('slug', 'faq')->name('faq');

Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisterController::class, 'create'])->name('register');
    Route::post('/register', [RegisterController::class, 'store']);
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);
    Route::get('/forgot-password', fn () => Inertia::render('Auth/ForgotPassword'))->name('password.request');
    Route::post('/forgot-password', ForgotPasswordController::class)->name('password.email');

    Route::get('/auth/google', GoogleRedirectController::class)->name('google.redirect');
    Route::get('/auth/google/callback', GoogleCallbackController::class)->name('google.callback');
    Route::get('/auth/google/complete-registration', ShowGoogleCompleteRegistrationController::class)
        ->name('google.complete-registration');
    Route::post('/auth/google/complete-registration', StoreGoogleCompleteRegistrationController::class)
        ->name('google.complete-registration.store');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', LogoutController::class)->name('logout');
    Route::get('/dashboard', CustomerDashboardController::class)->name('dashboard');
    Route::get('/products/{slug}', [ProductController::class, 'show'])->name('product.show');
    Route::get('/cart', [CartController::class, 'index'])->name('cart');
    Route::post('/cart/items', [CartController::class, 'addItem'])->name('cart.addItem');
    Route::post('/cart/items/{cartItem}', [CartController::class, 'updateItem'])->name('cart.updateItem');
    Route::delete('/cart/items/{cartItem}', [CartController::class, 'removeItem'])->name('cart.removeItem');
    Route::delete('/cart', [CartController::class, 'clear'])->name('cart.clear');
    Route::get('/checkout/shipping', ShowCheckoutShippingController::class)->name('checkout.shipping');
    Route::post('/checkout/shipping', StoreCheckoutShippingController::class)->name('checkout.shipping.store');
    Route::post('/checkout/shipping-quotes', GetShippingQuotesController::class)->name('checkout.shipping-quotes');
    Route::get('/checkout/payment', ShowCheckoutPaymentController::class)->name('checkout.payment');
    Route::get('/checkout/thank-you', ShowCheckoutThankYouController::class)->name('checkout.thank-you');
    Route::get('/account', AccountController::class)->name('account');
    Route::get('/account/profile', ProfileController::class)->name('account.profile');
    Route::put('/account/profile', UpdateProfileController::class)->name('account.profile.update');
    Route::get('/account/addresses', [AddressesController::class, 'show'])->name('account.addresses');
    Route::post('/account/addresses', [AddressesController::class, 'store'])->name('account.addresses.store');
    Route::put('/account/addresses/{address}', [AddressesController::class, 'update'])
        ->name('account.addresses.update');
    Route::delete('/account/addresses/{address}', [AddressesController::class, 'destroy'])
        ->name('account.addresses.destroy');
    Route::get('/account/notifications', NotificationPreferencesController::class)->name('account.notifications');
    Route::put('/account/notifications', UpdateNotificationPreferencesController::class)
        ->name('account.notifications.update');
    Route::get('/account/payment-methods', [PaymentMethodController::class, 'show'])
        ->name('account.payment-methods');
    Route::post('/account/payment-methods', [PaymentMethodController::class, 'store'])
        ->name('account.payment-methods.store');
    Route::patch('/account/payment-methods/{payment_method}/default', [PaymentMethodController::class, 'setDefault'])
        ->name('account.payment-methods.set-default');
    Route::delete('/account/payment-methods/{payment_method}', [PaymentMethodController::class, 'destroy'])
        ->name('account.payment-methods.destroy');
    Route::get('/account/orders', [OrderController::class, 'index'])->name('orders');
    Route::get('/account/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::post('/account/orders/{order}/reorder', [OrderController::class, 'reorder'])->name('orders.reorder');
    Route::get('/account/orders/{order}/invoice', [OrderController::class, 'invoice'])->name('orders.invoice');
});
