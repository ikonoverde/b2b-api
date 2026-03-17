<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Dashboard', [
            'salesMetrics' => $this->getSalesMetrics(),
            'ordersByStatus' => $this->getOrdersByStatus(),
            'topProducts' => $this->getTopProducts(),
            'newUsersCount' => $this->getNewUsersCount(),
            'lowStockAlerts' => $this->getLowStockAlerts(),
            'recentActivity' => $this->getRecentActivity(),
        ]);
    }

    /**
     * Get sales metrics for daily, weekly, and monthly periods with trend comparisons
     *
     * @return array<string, array<string, mixed>>
     */
    private function getSalesMetrics(): array
    {
        return [
            'daily' => $this->getPeriodSales('day'),
            'weekly' => $this->getPeriodSales('week'),
            'monthly' => $this->getPeriodSales('month'),
        ];
    }

    /**
     * @return array{total: float, change: float, previous: float}
     */
    private function getPeriodSales(string $period): array
    {
        $now = Carbon::now();

        $currentStart = $now->copy()->{'startOf'.ucfirst($period)}();
        $currentEnd = $now->copy()->{'endOf'.ucfirst($period)}();
        $previousStart = $now->copy()->{'sub'.ucfirst($period)}()->{'startOf'.ucfirst($period)}();
        $previousEnd = $now->copy()->{'sub'.ucfirst($period)}()->{'endOf'.ucfirst($period)}();

        $currentSales = $this->completedOrdersSumBetween($currentStart, $currentEnd);
        $previousSales = $this->completedOrdersSumBetween($previousStart, $previousEnd);

        return [
            'total' => round($currentSales, 2),
            'change' => round($this->percentageChange($currentSales, $previousSales), 1),
            'previous' => round($previousSales, 2),
        ];
    }

    private function completedOrdersSumBetween(Carbon $start, Carbon $end): float
    {
        return (float) Order::query()
            ->whereBetween('created_at', [$start, $end])
            ->where('payment_status', 'completed')
            ->sum('total_amount');
    }

    private function percentageChange(float $current, float $previous): float
    {
        if ($previous > 0) {
            return (($current - $previous) / $previous) * 100;
        }

        return $current > 0 ? 100 : 0;
    }

    /**
     * Get order counts grouped by status
     *
     * @return array<int, array<string, mixed>>
     */
    private function getOrdersByStatus(): array
    {
        $statuses = ['payment_pending', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        $orderCounts = [];

        foreach ($statuses as $status) {
            $count = Order::query()->where('status', $status)->count();
            $orderCounts[] = [
                'status' => $status,
                'label' => $this->getStatusLabel($status),
                'count' => $count,
            ];
        }

        return $orderCounts;
    }

    private function getStatusLabel(string $status): string
    {
        return match ($status) {
            'payment_pending' => 'Pago Pendiente',
            'pending' => 'Pendiente',
            'processing' => 'En Proceso',
            'shipped' => 'Enviado',
            'delivered' => 'Entregado',
            'cancelled' => 'Cancelado',
            default => $status,
        };
    }

    /**
     * Get top 10 best-selling products
     *
     * @return array<int, array<string, mixed>>
     */
    private function getTopProducts(): array
    {
        $topProducts = OrderItem::query()
            ->select('product_id', 'product_name')
            ->selectRaw('SUM(quantity) as total_sold')
            ->selectRaw('SUM(subtotal) as total_revenue')
            ->whereHas('order', function ($query) {
                $query->where('payment_status', 'completed');
            })
            ->groupBy('product_id', 'product_name')
            ->orderByDesc('total_sold')
            ->limit(10)
            ->get();

        return $topProducts->map(function ($item) {
            return [
                'id' => $item->product_id,
                'name' => $item->product_name,
                'units_sold' => (int) $item->total_sold,
                'revenue' => round($item->total_revenue, 2),
            ];
        })->toArray();
    }

    /**
     * Get count of new users registered this month
     */
    private function getNewUsersCount(): array
    {
        $now = Carbon::now();

        $thisMonthCount = User::query()
            ->whereMonth('created_at', $now->month)
            ->whereYear('created_at', $now->year)
            ->count();

        $lastMonthCount = User::query()
            ->whereMonth('created_at', $now->copy()->subMonth()->month)
            ->whereYear('created_at', $now->copy()->subMonth()->year)
            ->count();

        $change = $this->percentageChange($thisMonthCount, $lastMonthCount);

        return [
            'this_month' => $thisMonthCount,
            'last_month' => $lastMonthCount,
            'change' => round($change, 1),
        ];
    }

    /**
     * Get low-stock product alerts (stock <= min_stock)
     *
     * @return array<int, array<string, mixed>>
     */
    private function getLowStockAlerts(): array
    {
        $lowStockProducts = Product::query()
            ->whereNotNull('min_stock')
            ->whereColumn('stock', '<=', 'min_stock')
            ->where('is_active', true)
            ->orderBy('stock')
            ->limit(10)
            ->get();

        return $lowStockProducts->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'sku' => $product->sku,
                'stock' => $product->stock,
                'min_stock' => $product->min_stock,
            ];
        })->toArray();
    }

    /**
     * Get recent order activity feed
     *
     * @return array<int, array<string, mixed>>
     */
    private function getRecentActivity(): array
    {
        /** @var Collection<int, Order> $recentOrders */
        $recentOrders = Order::query()
            ->with('user')
            ->orderByDesc('created_at')
            ->limit(10)
            ->get();

        return $recentOrders->map(function ($order) {
            $statusConfig = $this->getActivityStatusConfig($order->status);

            return [
                'id' => $order->id,
                'title' => $statusConfig['title']($order),
                'time' => $order->created_at->diffForHumans(),
                'type' => $statusConfig['type'],
                'order_id' => $order->id,
                'customer' => $order->user?->name ?? 'Cliente',
            ];
        })->toArray();
    }

    /**
     * @return array<string, mixed>
     */
    private function getActivityStatusConfig(string $status): array
    {
        return match ($status) {
            'delivered' => [
                'type' => 'success',
                'title' => fn ($order) => "Pedido #{$order->id} completado",
            ],
            'payment_pending' => [
                'type' => 'warning',
                'title' => fn ($order) => "Pago pendiente: Pedido #{$order->id}",
            ],
            'pending' => [
                'type' => 'info',
                'title' => fn ($order) => "Nuevo pedido #{$order->id}",
            ],
            'processing' => [
                'type' => 'info',
                'title' => fn ($order) => "Pedido #{$order->id} en proceso",
            ],
            'shipped' => [
                'type' => 'info',
                'title' => fn ($order) => "Pedido #{$order->id} enviado",
            ],
            'cancelled' => [
                'type' => 'error',
                'title' => fn ($order) => "Pedido #{$order->id} cancelado",
            ],
            default => [
                'type' => 'info',
                'title' => fn ($order) => "Pedido #{$order->id} actualizado",
            ],
        };
    }
}
