<?php

use App\Mcp\Servers\MarketingServer;
use App\Mcp\Tools\MarketingProductCatalog;
use App\Mcp\Tools\MarketingSalesSummary;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Carbon\CarbonImmutable;
use Illuminate\Testing\Fluent\AssertableJson;

it('returns active products with marketing catalog fields', function () {
    $admin = User::factory()->admin()->create();
    $category = Category::factory()->create(['name' => 'Aceites profesionales', 'slug' => 'aceites-profesionales']);

    Product::factory()->featured()->create([
        'category_id' => $category->id,
        'name' => 'Aceite de masaje lavanda 5 L',
        'sku' => 'OIL-5L-LAV',
        'slug' => 'aceite-masaje-lavanda-5l',
    ]);

    Product::factory()->inactive()->create(['category_id' => $category->id]);

    MarketingServer::actingAs($admin)->tool(MarketingProductCatalog::class, [
        'category' => 'aceites',
        'search' => 'lavanda',
        'featured_only' => true,
        'limit' => 5,
    ])
        ->assertOk()
        ->assertName('marketing-product-catalog')
        ->assertSee([
            'Aceite de masaje lavanda 5 L',
            'OIL-5L-LAV',
            'Aceites profesionales',
        ]);
});

it('does not return products from inactive categories', function () {
    $admin = User::factory()->admin()->create();
    $inactiveCategory = Category::factory()->inactive()->create();

    $product = Product::factory()->create(['category_id' => $inactiveCategory->id]);

    MarketingServer::actingAs($admin)->tool(MarketingProductCatalog::class, [])
        ->assertOk()
        ->assertDontSee($product->name);
});

it('rejects limits above the supported maximum', function () {
    $admin = User::factory()->admin()->create();

    MarketingServer::actingAs($admin)->tool(MarketingProductCatalog::class, [
        'limit' => 500,
    ])->assertHasErrors();
});

it('accepts a limit at the supported maximum', function () {
    $admin = User::factory()->admin()->create();

    MarketingServer::actingAs($admin)->tool(MarketingProductCatalog::class, [
        'limit' => 100,
    ])->assertOk();
});

it('rejects sales summary limits above the supported maximum', function () {
    $admin = User::factory()->admin()->create();

    MarketingServer::actingAs($admin)->tool(MarketingSalesSummary::class, [
        'limit' => 51,
    ])->assertHasErrors();
});

it('accepts a sales summary limit at the supported maximum', function () {
    $admin = User::factory()->admin()->create();

    MarketingServer::actingAs($admin)->tool(MarketingSalesSummary::class, [
        'limit' => 50,
    ])->assertOk();
});

it('denies access to non admin users', function () {
    $customer = User::factory()->create();

    MarketingServer::actingAs($customer)->tool(MarketingProductCatalog::class, [])->assertHasErrors([
        'Permission denied.',
    ]);
});

it('returns sales performance for completed non cancelled orders', function () {
    $admin = User::factory()->admin()->create();
    $category = Category::factory()->create(['name' => 'Aceites profesionales']);
    $lavanda = Product::factory()->create([
        'category_id' => $category->id,
        'name' => 'Aceite lavanda 5 L',
        'sku' => 'LAV-5L',
    ]);

    $order = Order::factory()->delivered()->create([
        'total_amount' => 810.00,
        'shipping_cost' => 10.00,
        'created_at' => '2026-07-01 10:00:00',
    ]);
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $lavanda->id,
        'product_name' => $lavanda->name,
        'quantity' => 2,
        'unit_price' => 400.00,
        'subtotal' => 800.00,
    ]);

    $cancelledOrder = Order::factory()->create([
        'status' => 'cancelled',
        'payment_status' => 'completed',
        'total_amount' => 999.00,
        'created_at' => '2026-07-02 12:00:00',
    ]);
    OrderItem::factory()->create([
        'order_id' => $cancelledOrder->id,
        'product_id' => $lavanda->id,
        'quantity' => 9,
        'subtotal' => 999.00,
    ]);

    MarketingServer::actingAs($admin)->tool(MarketingSalesSummary::class, [
        'start_date' => '2026-07-01',
        'end_date' => '2026-07-03',
        'limit' => 10,
    ])
        ->assertOk()
        ->assertName('marketing-sales-summary')
        ->assertSee([
            'Aceite lavanda 5 L',
            'LAV-5L',
            'Aceites profesionales',
        ])
        ->assertDontSee('999');
});

it('separates product revenue from shipping so the totals reconcile', function () {
    $admin = User::factory()->admin()->create();
    $product = Product::factory()->create(['name' => 'Aceite romero 1 L']);

    $order = Order::factory()->delivered()->create([
        'total_amount' => 565.50,
        'shipping_cost' => 65.50,
        'created_at' => '2026-07-01 10:00:00',
    ]);
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'quantity' => 2,
        'unit_price' => 250.00,
        'subtotal' => 500.00,
    ]);

    MarketingServer::actingAs($admin)->tool(MarketingSalesSummary::class, [
        'start_date' => '2026-07-01',
        'end_date' => '2026-07-02',
    ])
        ->assertOk()
        ->assertStructuredContent(fn (AssertableJson $json) => $json
            ->where('summary.total_revenue', 565.5)
            ->where('summary.product_revenue', 500.0)
            ->where('summary.total_shipping', 65.5)
            ->etc()
        );
});

it('builds orders whose total matches their items plus shipping', function () {
    $order = Order::factory()->withItems(3)->create(['shipping_cost' => 25.00]);

    $expected = round((float) $order->items()->sum('subtotal') + 25.00, 2);

    expect((float) $order->fresh()->total_amount)->toBe($expected)
        ->and($order->items)->toHaveCount(3);
});

it('buckets orders into shop-timezone days rather than utc days', function () {
    config(['shop.timezone' => 'America/Merida']);

    $admin = User::factory()->admin()->create();

    Order::factory()->delivered()->create([
        'total_amount' => 500.00,
        'shipping_cost' => 0.00,
        'created_at' => '2026-07-09 02:00:00',
    ]);

    Order::factory()->delivered()->create([
        'total_amount' => 700.00,
        'shipping_cost' => 0.00,
        'created_at' => '2026-07-08 05:00:00',
    ]);

    MarketingServer::actingAs($admin)->tool(MarketingSalesSummary::class, [
        'start_date' => '2026-07-08',
        'end_date' => '2026-07-08',
    ])
        ->assertOk()
        ->assertStructuredContent(fn (AssertableJson $json) => $json
            ->where('summary.order_count', 1)
            ->where('summary.total_revenue', 500.0)
            ->etc()
        );
});

it('excludes an order that falls on the previous shop-timezone day', function () {
    config(['shop.timezone' => 'America/Merida']);

    $admin = User::factory()->admin()->create();

    Order::factory()->delivered()->create([
        'total_amount' => 700.00,
        'shipping_cost' => 0.00,
        'created_at' => '2026-07-08 05:00:00',
    ]);

    MarketingServer::actingAs($admin)->tool(MarketingSalesSummary::class, [
        'start_date' => '2026-07-08',
        'end_date' => '2026-07-08',
    ])
        ->assertOk()
        ->assertStructuredContent(fn (AssertableJson $json) => $json
            ->where('summary.order_count', 0)
            ->where('summary.total_revenue', 0.0)
            ->etc()
        );
});

it('defaults the sales summary end date to today in the shop timezone', function () {
    config(['shop.timezone' => 'America/Merida']);

    Carbon::setTestNow(CarbonImmutable::parse('2026-07-09 04:00:00', 'UTC'));

    $admin = User::factory()->admin()->create();

    MarketingServer::actingAs($admin)->tool(MarketingSalesSummary::class, [])
        ->assertOk()
        ->assertStructuredContent(fn (AssertableJson $json) => $json
            ->where('date_range.end_date', '2026-07-08')
            ->where('date_range.start_date', '2026-06-08')
            ->etc()
        );
});

it('rejects sales summary dates that are not in Y-m-d format', function () {
    $admin = User::factory()->admin()->create();

    MarketingServer::actingAs($admin)->tool(MarketingSalesSummary::class, [
        'start_date' => 'last tuesday',
    ])->assertHasErrors();
});

it('rejects a sales summary end date before the start date', function () {
    $admin = User::factory()->admin()->create();

    MarketingServer::actingAs($admin)->tool(MarketingSalesSummary::class, [
        'start_date' => '2026-07-03',
        'end_date' => '2026-07-01',
    ])->assertHasErrors([
        'The end_date must be on or after start_date.',
    ]);
});

it('denies sales summary access to non admin users', function () {
    $customer = User::factory()->create();

    MarketingServer::actingAs($customer)->tool(MarketingSalesSummary::class, [])->assertHasErrors([
        'Permission denied.',
    ]);
});

it('requires authentication for the marketing mcp http server', function () {
    $this->postJson('/mcp/marketing', [
        'jsonrpc' => '2.0',
        'id' => 1,
        'method' => 'initialize',
        'params' => [
            'protocolVersion' => '2025-06-18',
            'capabilities' => [],
            'clientInfo' => [
                'name' => 'test-client',
                'version' => '1.0.0',
            ],
        ],
    ])->assertUnauthorized();
});
