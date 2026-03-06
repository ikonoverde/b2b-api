<?php

namespace App\Http\Middleware;

use App\Models\Cart;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'initials' => $this->getInitials($user->name),
                ] : null,
            ],
            'miniCart' => fn () => $user ? $this->getMiniCart($user) : null,
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'password_status' => fn () => $request->session()->get('password_status'),
            ],
        ];
    }

    /**
     * Get mini cart data for the header dropdown.
     */
    private function getMiniCart(\App\Models\User $user): array
    {
        $cart = Cart::where('user_id', $user->id)
            ->where('status', 'active')
            ->with('items.product.images')
            ->first();

        if (! $cart || $cart->items->isEmpty()) {
            return ['items' => [], 'subtotal' => 0, 'totalCount' => 0];
        }

        $recentItems = $cart->items->sortByDesc('created_at')->take(3);

        return [
            'items' => $recentItems->map(fn ($item) => [
                'id' => $item->id,
                'name' => $item->product->name,
                'image' => $item->product->images->first()?->image_url,
                'price' => (float) $item->unit_price,
                'quantity' => $item->quantity,
                'subtotal' => $item->subtotal,
            ])->values()->all(),
            'subtotal' => round($cart->items->sum(fn ($item) => $item->subtotal), 2),
            'totalCount' => $cart->items->count(),
        ];
    }

    /**
     * Get initials from a name.
     */
    private function getInitials(string $name): string
    {
        $words = explode(' ', trim($name));
        $initials = '';

        foreach ($words as $word) {
            if (! empty($word)) {
                $initials .= strtoupper($word[0]);
            }
        }

        return substr($initials, 0, 2);
    }
}
