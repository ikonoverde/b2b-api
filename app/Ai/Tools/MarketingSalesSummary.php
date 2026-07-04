<?php

namespace App\Ai\Tools;

use App\Models\Order;
use App\Models\OrderItem;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

class MarketingSalesSummary implements Tool
{
    public function name(): string
    {
        return 'marketing_sales_summary';
    }

    public function description(): Stringable|string
    {
        return 'Return read-only product sales performance for marketing planning, including completed non-cancelled orders, revenue, quantity sold, average order value, and top products.';
    }

    public function handle(Request $request): Stringable|string
    {
        $data = $request->all();
        $startDate = $this->date($data['start_date'] ?? null, now()->subDays(30)->startOfDay());
        $endDate = $this->date($data['end_date'] ?? null, now()->endOfDay())->endOfDay();
        $limit = min(max((int) ($data['limit'] ?? 10), 1), 50);

        $orders = Order::query()
            ->where('payment_status', 'completed')
            ->where('status', '!=', 'cancelled')
            ->whereBetween('created_at', [$startDate, $endDate]);

        $orderCount = (clone $orders)->count();
        $totalRevenue = (float) (clone $orders)->sum('total_amount');

        $topProducts = OrderItem::query()
            ->select('order_items.product_id')
            ->selectRaw('COALESCE(products.name, order_items.product_name) as product_name')
            ->selectRaw('products.sku as sku')
            ->selectRaw('products.slug as slug')
            ->selectRaw('categories.name as category')
            ->selectRaw('SUM(order_items.quantity) as quantity_sold')
            ->selectRaw('SUM(order_items.subtotal) as revenue')
            ->selectRaw('COUNT(DISTINCT order_items.order_id) as order_count')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->leftJoin('products', 'products.id', '=', 'order_items.product_id')
            ->leftJoin('categories', 'categories.id', '=', 'products.category_id')
            ->where('orders.payment_status', 'completed')
            ->where('orders.status', '!=', 'cancelled')
            ->whereBetween('orders.created_at', [$startDate, $endDate])
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

        return $this->json([
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
                'average_order_value' => $orderCount > 0 ? round($totalRevenue / $orderCount, 2) : 0.0,
            ],
            'top_products' => $topProducts->all(),
        ]);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'start_date' => $schema->string()
                ->nullable()
                ->description('Optional start date in YYYY-MM-DD format. Defaults to 30 days ago.'),
            'end_date' => $schema->string()
                ->nullable()
                ->description('Optional end date in YYYY-MM-DD format. Defaults to today.'),
            'limit' => $schema->integer()
                ->nullable()
                ->description('Maximum top products to return. Defaults to 10 and caps at 50.'),
        ];
    }

    private function date(mixed $value, \DateTimeInterface $default): CarbonImmutable
    {
        if (! is_string($value) || trim($value) === '') {
            return CarbonImmutable::instance($default);
        }

        return CarbonImmutable::parse($value);
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function json(array $payload): string
    {
        return json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    }
}
