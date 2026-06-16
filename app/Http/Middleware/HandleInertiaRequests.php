<?php

namespace App\Http\Middleware;

use App\Models\Cart;
use App\Models\Order;
use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Symfony\Component\HttpFoundation\Response;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     */
    protected $rootView = 'app';

    /**
     * Handle the incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->is('admin') || $request->is('admin/*') || $request->routeIs('checkout.payment')) {
            config(['inertia.ssr.enabled' => false]);
        }

        return parent::handle($request, $next);
    }

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
        $canAccessAdmin = $this->canAccessAdmin($user);

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
                'canAccessAdmin' => $canAccessAdmin,
            ],
            'adminNavigation' => fn () => $this->getAdminNavigation($request),
            'miniCart' => fn () => $user ? $this->getMiniCart($user) : null,
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'password_status' => fn () => $request->session()->get('password_status'),
                'reorder_warnings' => fn () => $request->session()->get('reorder_warnings'),
            ],
        ];
    }

    /**
     * Determine if the user can access the admin area.
     */
    private function canAccessAdmin(?User $user): bool
    {
        return $user !== null && in_array($user->role, ['admin', 'super_admin'], true);
    }

    /**
     * Get admin navigation data for the sidebar.
     *
     * @return array{ordersCount: int}|null
     */
    private function getAdminNavigation(Request $request): ?array
    {
        if (! ($request->is('admin') || $request->is('admin/*')) || ! $this->canAccessAdmin($request->user())) {
            return null;
        }

        return [
            'ordersCount' => Order::query()->count(),
        ];
    }

    /**
     * Get mini cart data for the header dropdown.
     */
    private function getMiniCart(User $user): array
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
