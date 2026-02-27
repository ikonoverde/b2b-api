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
        $now = Carbon::now();

        // Daily metrics
        $todaySales = Order::query()
            ->whereDate('created_at', $now->toDateString())
            ->where('payment_status', 'completed')
            ->sum('total_amount') ?? 0;

        $yesterdaySales = Order::query()
            ->whereDate('created_at', $now->copy()->subDay()->toDateString())
            ->where('payment_status', 'completed')
            ->sum('total_amount') ?? 0;

        $dailyChange = $yesterdaySales > 0
            ? (($todaySales - $yesterdaySales) / $yesterdaySales) * 100
            : ($todaySales > 0 ? 100 : 0);

        // Weekly metrics
        $weekStart = $now->copy()->startOfWeek();
        $weekEnd = $now->copy()->endOfWeek();
        $thisWeekSales = Order::query()
            ->whereBetween('created_at', [$weekStart, $weekEnd])
            ->where('payment_status', 'completed')
            ->sum('total_amount') ?? 0;

        $lastWeekStart = $now->copy()->subWeek()->startOfWeek();
        $lastWeekEnd = $now->copy()->subWeek()->endOfWeek();
        $lastWeekSales = Order::query()
            ->whereBetween('created_at', [$lastWeekStart, $lastWeekEnd])
            ->where('payment_status', 'completed')
            ->sum('total_amount') ?? 0;

        $weeklyChange = $lastWeekSales > 0
            ? (($thisWeekSales - $lastWeekSales) / $lastWeekSales) * 100
            : ($thisWeekSales > 0 ? 100 : 0);

        // Monthly metrics
        $monthStart = $now->copy()->startOfMonth();
        $monthEnd = $now->copy()->endOfMonth();
        $thisMonthSales = Order::query()
            ->whereBetween('created_at', [$monthStart, $monthEnd])
            ->where('payment_status', 'completed')
            ->sum('total_amount') ?? 0;

        $lastMonthStart = $now->copy()->subMonth()->startOfMonth();
        $lastMonthEnd = $now->copy()->subMonth()->endOfMonth();
        $lastMonthSales = Order::query()
            ->whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])
            ->where('payment_status', 'completed')
            ->sum('total_amount') ?? 0;

        $monthlyChange = $lastMonthSales > 0
            ? (($thisMonthSales - $lastMonthSales) / $lastMonthSales) * 100
            : ($thisMonthSales > 0 ? 100 : 0);

        return [
            'daily' => [
                'total' => round($todaySales, 2),
                'change' => round($dailyChange, 1),
                'previous' => round($yesterdaySales, 2),
            ],
            'weekly' => [
                'total' => round($thisWeekSales, 2),
                'change' => round($weeklyChange, 1),
                'previous' => round($lastWeekSales, 2),
            ],
            'monthly' => [
                'total' => round($thisMonthSales, 2),
                'change' => round($monthlyChange, 1),
                'previous' => round($lastMonthSales, 2),
            ],
        ];
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

        $change = $lastMonthCount > 0
            ? (($thisMonthCount - $lastMonthCount) / $lastMonthCount) * 100
            : ($thisMonthCount > 0 ? 100 : 0);

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
