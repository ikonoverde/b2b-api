<?php

use App\Http\Controllers\Web\AccountController;
use App\Http\Controllers\Web\Auth\LoginController;
use App\Http\Controllers\Web\Auth\LogoutController;
use App\Http\Controllers\Web\Auth\RegisterController;
use App\Http\Controllers\Web\CartController;
use App\Http\Controllers\Web\CatalogController;
use App\Http\Controllers\Web\CheckoutController;
use App\Http\Controllers\Web\CustomerDashboardController;
use App\Http\Controllers\Web\HomeController;
use App\Http\Controllers\Web\OrderController;
use App\Http\Controllers\Web\ProductController;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/catalog', CatalogController::class)->name('catalog');

Route::get('/checkout/success', fn () => view('checkout.success'))->name('checkout.success');
Route::get('/checkout/cancel', fn () => view('checkout.cancel'))->name('checkout.cancel');

Route::get('/reset-password/{token}', fn (string $token) => view('auth.reset-password', ['token' => $token]))
    ->middleware('guest')
    ->name('password.reset');

Route::post('/reset-password', function (Request $request) {
    $request->validate([
        'token' => ['required'],
        'email' => ['required', 'email'],
        'password' => ['required', 'min:8', 'confirmed'],
    ]);

    $status = Password::reset(
        $request->only('email', 'password', 'password_confirmation', 'token'),
        function (User $user, string $password) {
            $user->forceFill([
                'password' => Hash::make($password),
            ])->setRememberToken(Str::random(60));

            $user->save();

            event(new PasswordReset($user));
        }
    );

    if ($status === Password::PasswordReset) {
        return view('auth.reset-password-success');
    }

    return back()->withErrors(['email' => [__($status)]]);
})->middleware('guest')->name('password.update');

Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisterController::class, 'create'])->name('register');
    Route::post('/register', [RegisterController::class, 'store']);
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', LogoutController::class)->name('logout');
    Route::get('/dashboard', CustomerDashboardController::class)->name('dashboard');
    Route::get('/product/{product}', [ProductController::class, 'show'])->name('product.show');
    Route::get('/cart', [CartController::class, 'index'])->name('cart');
    Route::post('/cart/items', [CartController::class, 'addItem'])->name('cart.addItem');
    Route::post('/cart/items/{cartItem}', [CartController::class, 'updateItem'])->name('cart.updateItem');
    Route::delete('/cart/items/{cartItem}', [CartController::class, 'removeItem'])->name('cart.removeItem');
    Route::delete('/cart', [CartController::class, 'clear'])->name('cart.clear');
    Route::get('/checkout', [CheckoutController::class, 'create'])->name('checkout');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
    Route::get('/account', AccountController::class)->name('account');
    Route::get('/orders', [OrderController::class, 'index'])->name('orders');
});
