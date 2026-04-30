<?php

namespace App\Http\Controllers\Admin\Orders;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexOrdersController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $sortBy = $this->resolveSortField($request->query('sort_by', 'created_at'));
        $sortOrder = in_array($request->query('sort_order'), ['asc', 'desc'])
            ? $request->query('sort_order')
            : 'desc';
        $perPage = min((int) $request->query('per_page', 15), 100);

        $orders = Order::query()
            ->with('user')
            ->when($request->filled('status'), fn ($q) => $q
                ->where('status', $request->query('status')))
            ->when($request->filled('payment_status'), fn ($q) => $q
                ->where('payment_status', $request->query('payment_status')))
            ->when($request->filled('date_from'), fn ($q) => $q
                ->whereDate('created_at', '>=', $request->query('date_from')))
            ->when($request->filled('date_to'), fn ($q) => $q
                ->whereDate('created_at', '<=', $request->query('date_to')))
            ->when($request->filled('customer'), function ($q) use ($request) {
                $search = $request->query('customer');
                $q->whereHas('user', fn ($uq) => $uq
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%"));
            })
            ->when($request->filled('amount_min'), fn ($q) => $q
                ->where('total_amount', '>=', $request->query('amount_min')))
            ->when($request->filled('amount_max'), fn ($q) => $q
                ->where('total_amount', '<=', $request->query('amount_max')))
            ->orderBy($sortBy, $sortOrder)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('admin/orders/Index', [
            'orders' => $orders,
            'filters' => $this->buildFilterState($request, $sortBy, $sortOrder),
        ]);
    }

    private function resolveSortField(string $field): string
    {
        $allowedSortFields = ['created_at', 'status', 'total_amount', 'payment_status'];

        return in_array($field, $allowedSortFields) ? $field : 'created_at';
    }

    /**
     * @return array<string, string>
     */
    private function buildFilterState(Request $request, string $sortBy, string $sortOrder): array
    {
        return [
            'status' => $request->query('status', ''),
            'payment_status' => $request->query('payment_status', ''),
            'date_from' => $request->query('date_from', ''),
            'date_to' => $request->query('date_to', ''),
            'customer' => $request->query('customer', ''),
            'amount_min' => $request->query('amount_min', ''),
            'amount_max' => $request->query('amount_max', ''),
            'sort_by' => $sortBy,
            'sort_order' => $sortOrder,
        ];
    }
}
