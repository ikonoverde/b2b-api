<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use Carbon\CarbonImmutable;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Builder;

class MarketingSalesSummaryService
{
    /**
     * Build the sales performance payload from raw tool arguments.
     *
     * @param  array<string, mixed>  $arguments
     * @return array{date_range: array{start_date: string, end_date: string}, filters: array{payment_status: string, excluded_order_statuses: array<int, string>, limit: int}, summary: array{order_count: int, total_revenue: float, product_revenue: float, total_shipping: float, average_order_value: float}, top_products: array<int, array<string, mixed>>}
     */
    public function build(array $arguments): array
    {
        $startDate = $this->date($arguments['start_date'] ?? null, now()->subDays(30)->startOfDay());
        $endDate = $this->date($arguments['end_date'] ?? null, now()->endOfDay())->endOfDay();
        $limit = min(max((int) ($arguments['limit'] ?? 10), 1), 50);

        $orders = Order::query()
            ->where('payment_status', 'completed')
            ->where('status', '!=', 'cancelled')
            ->whereBetween('created_at', [$startDate, $endDate]);

        $orderCount = (clone $orders)->count();
        $totalRevenue = (float) (clone $orders)->sum('total_amount');
        $totalShipping = (float) (clone $orders)->sum('shipping_cost');
        $productRevenue = (float) $this->qualifyingOrderItems($startDate, $endDate)->sum('order_items.subtotal');

        $topProducts = $this->qualifyingOrderItems($startDate, $endDate)
            ->select('order_items.product_id')
            ->selectRaw('COALESCE(products.name, order_items.product_name) as product_name')
            ->selectRaw('products.sku as sku')
            ->selectRaw('products.slug as slug')
            ->selectRaw('categories.name as category')
            ->selectRaw('SUM(order_items.quantity) as quantity_sold')
            ->selectRaw('SUM(order_items.subtotal) as revenue')
            ->selectRaw('COUNT(DISTINCT order_items.order_id) as order_count')
            ->leftJoin('products', 'products.id', '=', 'order_items.product_id')
            ->leftJoin('categories', 'categories.id', '=', 'products.category_id')
            ->groupBy('order_items.product_id', 'products.name', 'order_items.product_name', 'products.sku', 'products.slug', 'categories.name')
            ->orderByDesc('revenue')
            ->limit($limit)
            ->get()
            ->map(fn (OrderItem $item): array => [
                'product_id' => $item->product_id,
                'product_name' => $item->product_name,
                'sku' => $item->sku,
                'slug' => $item->slug,
                'category' => $item->category,
                'quantity_sold' => (int) $item->quantity_sold,
                'revenue' => (float) $item->revenue,
                'order_count' => (int) $item->order_count,
            ]);

        return [
            'date_range' => [
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
            ],
            'filters' => [
                'payment_status' => 'completed',
                'excluded_order_statuses' => ['cancelled'],
                'limit' => $limit,
            ],
            'summary' => [
                'order_count' => $orderCount,
                'total_revenue' => $totalRevenue,
                'product_revenue' => $productRevenue,
                'total_shipping' => $totalShipping,
                'average_order_value' => $orderCount > 0 ? round($totalRevenue / $orderCount, 2) : 0.0,
            ],
            'top_products' => $topProducts->all(),
        ];
    }

    /**
     * Order items belonging to completed, non-cancelled orders within the range.
     *
     * @return Builder<OrderItem>
     */
    private function qualifyingOrderItems(CarbonImmutable $startDate, CarbonImmutable $endDate): Builder
    {
        return OrderItem::query()
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('orders.payment_status', 'completed')
            ->where('orders.status', '!=', 'cancelled')
            ->whereBetween('orders.created_at', [$startDate, $endDate]);
    }

    private function date(mixed $value, DateTimeInterface $default): CarbonImmutable
    {
        if (! is_string($value) || trim($value) === '') {
            return CarbonImmutable::instance($default);
        }

        return CarbonImmutable::parse($value);
    }
}
