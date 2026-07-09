<?php

use App\Mcp\Servers\MarketingServer;
use App\Mcp\Tools\MarketingProductCatalog;
use App\Mcp\Tools\MarketingSalesSummary;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;

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
        'total_amount' => 800.00,
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
