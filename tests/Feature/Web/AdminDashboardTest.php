<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;

it('requires authentication', function () {
    $response = $this->get(route('admin.dashboard'));

    $response->assertRedirect('/login');
});

it('shows admin dashboard with all metrics', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get(route('admin.dashboard'));

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Dashboard')
            ->has('salesMetrics')
            ->has('ordersByStatus')
            ->has('topProducts')
            ->has('newUsersCount')
            ->has('lowStockAlerts')
            ->has('recentActivity')
        );
});

it('calculates daily sales metrics correctly', function () {
    $admin = User::factory()->admin()->create();

    // Create orders for today with completed payment
    Order::factory(3)->create([
        'payment_status' => 'completed',
        'total_amount' => 100,
        'created_at' => Carbon::now(),
    ]);

    // Create orders for yesterday
    Order::factory(2)->create([
        'payment_status' => 'completed',
        'total_amount' => 50,
        'created_at' => Carbon::now()->subDay(),
    ]);

    $response = $this->actingAs($admin)->get(route('admin.dashboard'));

    $response->assertInertia(fn ($page) => $page
        ->where('salesMetrics.daily.total', 300)
        ->where('salesMetrics.daily.previous', 100)
        ->where('salesMetrics.daily.change', 200)
    );
});

it('calculates weekly sales metrics correctly', function () {
    $admin = User::factory()->admin()->create();

    $thisWeekStart = Carbon::now()->startOfWeek();
    $lastWeekStart = Carbon::now()->subWeek()->startOfWeek();

    // Create orders for this week
    Order::factory(2)->create([
        'payment_status' => 'completed',
        'total_amount' => 200,
        'created_at' => $thisWeekStart->copy()->addDay(),
    ]);

    // Create orders for last week
    Order::factory(1)->create([
        'payment_status' => 'completed',
        'total_amount' => 150,
        'created_at' => $lastWeekStart->copy()->addDay(),
    ]);

    $response = $this->actingAs($admin)->get(route('admin.dashboard'));

    $response->assertInertia(fn ($page) => $page
        ->where('salesMetrics.weekly.total', 400)
        ->where('salesMetrics.weekly.previous', 150)
    );
});

it('calculates monthly sales metrics correctly', function () {
    $admin = User::factory()->admin()->create();

    $thisMonthStart = Carbon::now()->startOfMonth();
    $lastMonthStart = Carbon::now()->subMonth()->startOfMonth();

    // Create orders for this month
    Order::factory(2)->create([
        'payment_status' => 'completed',
        'total_amount' => 300,
        'created_at' => $thisMonthStart->copy()->addDay(),
    ]);

    // Create orders for last month
    Order::factory(1)->create([
        'payment_status' => 'completed',
        'total_amount' => 200,
        'created_at' => $lastMonthStart->copy()->addDay(),
    ]);

    $response = $this->actingAs($admin)->get(route('admin.dashboard'));

    $response->assertInertia(fn ($page) => $page
        ->where('salesMetrics.monthly.total', 600)
        ->where('salesMetrics.monthly.previous', 200)
    );
});

it('does not include pending payment orders in sales calculations', function () {
    $admin = User::factory()->admin()->create();

    // Create completed payment orders
    Order::factory(2)->create([
        'payment_status' => 'completed',
        'total_amount' => 100,
        'created_at' => Carbon::now(),
    ]);

    // Create pending payment orders (should not be counted)
    Order::factory(3)->create([
        'payment_status' => 'pending',
        'total_amount' => 100,
        'created_at' => Carbon::now(),
    ]);

    $response = $this->actingAs($admin)->get(route('admin.dashboard'));

    $response->assertInertia(fn ($page) => $page
        ->where('salesMetrics.daily.total', 200)
    );
});

it('shows order counts grouped by status', function () {
    $admin = User::factory()->admin()->create();

    // Create orders with different statuses
    Order::factory(5)->create();
    Order::factory(3)->processing()->create();
    Order::factory(2)->shipped()->create();
    Order::factory(4)->delivered()->create();
    Order::factory(1)->cancelled()->create();

    $response = $this->actingAs($admin)->get(route('admin.dashboard'));

    $response->assertInertia(fn ($page) => $page
        ->has('ordersByStatus', 6)
        ->where('ordersByStatus.0.status', 'payment_pending')
        ->where('ordersByStatus.1.status', 'pending')
        ->where('ordersByStatus.1.count', 5)
        ->where('ordersByStatus.2.status', 'processing')
        ->where('ordersByStatus.2.count', 3)
        ->where('ordersByStatus.3.status', 'shipped')
        ->where('ordersByStatus.3.count', 2)
        ->where('ordersByStatus.4.status', 'delivered')
        ->where('ordersByStatus.4.count', 4)
        ->where('ordersByStatus.5.status', 'cancelled')
        ->where('ordersByStatus.5.count', 1)
    );
});

it('shows top 10 best-selling products', function () {
    $admin = User::factory()->admin()->create();

    // Create products
    $product1 = Product::factory()->create(['name' => 'Product A']);
    $product2 = Product::factory()->create(['name' => 'Product B']);
    $product3 = Product::factory()->create(['name' => 'Product C']);

    // Create completed orders with items
    $order1 = Order::factory()->delivered()->create();
    OrderItem::factory()->create([
        'order_id' => $order1->id,
        'product_id' => $product1->id,
        'product_name' => $product1->name,
        'quantity' => 10,
        'unit_price' => 50,
        'subtotal' => 500,
    ]);

    $order2 = Order::factory()->delivered()->create();
    OrderItem::factory()->create([
        'order_id' => $order2->id,
        'product_id' => $product2->id,
        'product_name' => $product2->name,
        'quantity' => 5,
        'unit_price' => 100,
        'subtotal' => 500,
    ]);

    OrderItem::factory()->create([
        'order_id' => $order2->id,
        'product_id' => $product1->id,
        'product_name' => $product1->name,
        'quantity' => 3,
        'unit_price' => 50,
        'subtotal' => 150,
    ]);

    $order3 = Order::factory()->delivered()->create();
    OrderItem::factory()->create([
        'order_id' => $order3->id,
        'product_id' => $product3->id,
        'product_name' => $product3->name,
        'quantity' => 2,
        'unit_price' => 75.00,
        'subtotal' => 150,
    ]);

    $response = $this->actingAs($admin)->get(route('admin.dashboard'));

    $response->assertInertia(fn ($page) => $page
        ->has('topProducts', 3)
        ->where('topProducts.0.name', 'Product A')
        ->where('topProducts.0.units_sold', 13)
        ->where('topProducts.0.revenue', 650)
        ->where('topProducts.1.name', 'Product B')
        ->where('topProducts.1.units_sold', 5)
        ->where('topProducts.1.revenue', 500)
    );
});

it('only includes completed payment orders in top products', function () {
    $admin = User::factory()->admin()->create();

    $product = Product::factory()->create(['name' => 'Test Product']);

    // Create completed order
    $completedOrder = Order::factory()->delivered()->create();
    OrderItem::factory()->create([
        'order_id' => $completedOrder->id,
        'product_id' => $product->id,
        'product_name' => $product->name,
        'quantity' => 5,
        'subtotal' => 250,
    ]);

    // Create pending payment order (should not be counted)
    $pendingOrder = Order::factory()->create(['payment_status' => 'pending']);
    OrderItem::factory()->create([
        'order_id' => $pendingOrder->id,
        'product_id' => $product->id,
        'product_name' => $product->name,
        'quantity' => 10,
        'subtotal' => 500,
    ]);

    $response = $this->actingAs($admin)->get(route('admin.dashboard'));

    $response->assertInertia(fn ($page) => $page
        ->where('topProducts.0.units_sold', 5)
        ->where('topProducts.0.revenue', 250)
    );
});

it('shows new user registration count', function () {
    $admin = User::factory()->admin()->create();

    // Create users this month
    User::factory(3)->create([
        'created_at' => Carbon::now(),
    ]);

    // Create users last month
    User::factory(2)->create([
        'created_at' => Carbon::now()->subMonth(),
    ]);

    $response = $this->actingAs($admin)->get(route('admin.dashboard'));

    $response->assertInertia(fn ($page) => $page
        ->where('newUsersCount.this_month', 4) // 3 new + 1 admin
        ->where('newUsersCount.last_month', 2)
        ->where('newUsersCount.change', 100)
    );
});

it('shows low stock product alerts', function () {
    $admin = User::factory()->admin()->create();

    // Create products with low stock
    Product::factory()->create([
        'name' => 'Low Stock Product',
        'sku' => 'LOW-001',
        'stock' => 3,
        'min_stock' => 10,
        'is_active' => true,
    ]);

    // Create product with stock at exact min_stock
    Product::factory()->create([
        'name' => 'At Min Stock',
        'sku' => 'MIN-001',
        'stock' => 5,
        'min_stock' => 5,
        'is_active' => true,
    ]);

    // Create product with sufficient stock (should not appear)
    Product::factory()->create([
        'name' => 'Sufficient Stock',
        'sku' => 'OK-001',
        'stock' => 20,
        'min_stock' => 10,
        'is_active' => true,
    ]);

    // Create inactive product with low stock (should not appear)
    Product::factory()->inactive()->create([
        'name' => 'Inactive Low Stock',
        'sku' => 'INACTIVE-001',
        'stock' => 2,
        'min_stock' => 10,
    ]);

    $response = $this->actingAs($admin)->get(route('admin.dashboard'));

    $response->assertInertia(fn ($page) => $page
        ->has('lowStockAlerts', 2)
        ->where('lowStockAlerts.0.name', 'Low Stock Product')
        ->where('lowStockAlerts.0.stock', 3)
        ->where('lowStockAlerts.0.min_stock', 10)
        ->where('lowStockAlerts.1.name', 'At Min Stock')
        ->where('lowStockAlerts.1.stock', 5)
    );
});

it('shows recent order activity feed', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create(['name' => 'Test Customer']);

    // Create recent orders
    $order1 = Order::factory()->delivered()->create([
        'user_id' => $user->id,
        'created_at' => Carbon::now()->subMinutes(5),
    ]);

    $order2 = Order::factory()->create([
        'user_id' => $user->id,
        'created_at' => Carbon::now()->subMinutes(30),
    ]);

    $order3 = Order::factory()->cancelled()->create([
        'user_id' => $user->id,
        'created_at' => Carbon::now()->subHours(2),
    ]);

    $response = $this->actingAs($admin)->get(route('admin.dashboard'));

    $response->assertInertia(fn ($page) => $page
        ->has('recentActivity', 3)
        ->where('recentActivity.0.order_id', $order1->id)
        ->where('recentActivity.0.type', 'success')
        ->where('recentActivity.0.customer', 'Test Customer')
        ->where('recentActivity.1.order_id', $order2->id)
        ->where('recentActivity.1.type', 'info')
        ->where('recentActivity.2.order_id', $order3->id)
        ->where('recentActivity.2.type', 'error')
    );
});

it('limits recent activity to 10 items', function () {
    $admin = User::factory()->admin()->create();

    // Create 15 orders
    Order::factory(15)->delivered()->create();

    $response = $this->actingAs($admin)->get(route('admin.dashboard'));

    $response->assertInertia(fn ($page) => $page
        ->has('recentActivity', 10)
    );
});

it('limits low stock alerts to 10 items', function () {
    $admin = User::factory()->admin()->create();

    // Create 15 low stock products
    Product::factory(15)->create([
        'stock' => 2,
        'min_stock' => 10,
        'is_active' => true,
    ]);

    $response = $this->actingAs($admin)->get(route('admin.dashboard'));

    $response->assertInertia(fn ($page) => $page
        ->has('lowStockAlerts', 10)
    );
});

it('limits top products to 10 items', function () {
    $admin = User::factory()->admin()->create();

    // Create 15 products with order items
    $products = Product::factory(15)->create();
    $order = Order::factory()->delivered()->create();

    foreach ($products as $product) {
        OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'product_name' => $product->name,
            'quantity' => 1,
        ]);
    }

    $response = $this->actingAs($admin)->get(route('admin.dashboard'));

    $response->assertInertia(fn ($page) => $page
        ->has('topProducts', 10)
    );
});

it('calculates negative trend correctly', function () {
    $admin = User::factory()->admin()->create();

    // Today's sales: $100
    Order::factory()->create([
        'payment_status' => 'completed',
        'total_amount' => 100,
        'created_at' => Carbon::now(),
    ]);

    // Yesterday's sales: $200
    Order::factory()->create([
        'payment_status' => 'completed',
        'total_amount' => 200,
        'created_at' => Carbon::now()->subDay(),
    ]);

    $response = $this->actingAs($admin)->get(route('admin.dashboard'));

    $response->assertInertia(fn ($page) => $page
        ->where('salesMetrics.daily.total', 100)
        ->where('salesMetrics.daily.previous', 200)
        ->where('salesMetrics.daily.change', -50)
    );
});

it('shows 100% increase when previous period has no sales', function () {
    $admin = User::factory()->admin()->create();

    // Today's sales: $100
    Order::factory()->create([
        'payment_status' => 'completed',
        'total_amount' => 100,
        'created_at' => Carbon::now(),
    ]);

    // No sales yesterday

    $response = $this->actingAs($admin)->get(route('admin.dashboard'));

    $response->assertInertia(fn ($page) => $page
        ->where('salesMetrics.daily.total', 100)
        ->where('salesMetrics.daily.previous', 0)
        ->where('salesMetrics.daily.change', 100)
    );
});

it('shows 0% change when both periods have no sales', function () {
    $admin = User::factory()->admin()->create();

    // No sales at all

    $response = $this->actingAs($admin)->get(route('admin.dashboard'));

    $response->assertInertia(fn ($page) => $page
        ->where('salesMetrics.daily.total', 0)
        ->where('salesMetrics.daily.previous', 0)
        ->where('salesMetrics.daily.change', 0)
    );
});

it('shows 0% change when both periods have equal sales', function () {
    $admin = User::factory()->admin()->create();

    // Today's sales: $100
    Order::factory()->create([
        'payment_status' => 'completed',
        'total_amount' => 100,
        'created_at' => Carbon::now(),
    ]);

    // Yesterday's sales: $100
    Order::factory()->create([
        'payment_status' => 'completed',
        'total_amount' => 100,
        'created_at' => Carbon::now()->subDay(),
    ]);

    $response = $this->actingAs($admin)->get(route('admin.dashboard'));

    $response->assertInertia(fn ($page) => $page
        ->where('salesMetrics.daily.change', 0)
    );
});
