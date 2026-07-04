<?php

use App\Ai\Tools\MarketingSalesSummary;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Laravel\Ai\Tools\Request;

it('returns product sales performance for completed non-cancelled orders', function () {
    $category = Category::factory()->create(['name' => 'Aceites profesionales']);
    $lavanda = Product::factory()->create([
        'category_id' => $category->id,
        'name' => 'Aceite lavanda 5 L',
        'sku' => 'LAV-5L',
        'slug' => 'aceite-lavanda-5l',
    ]);
    $neutro = Product::factory()->create([
        'category_id' => $category->id,
        'name' => 'Aceite neutro 1 L',
        'sku' => 'NEU-1L',
        'slug' => 'aceite-neutro-1l',
    ]);

    $firstOrder = Order::factory()->delivered()->create([
        'total_amount' => 1000.00,
        'created_at' => '2026-07-01 10:00:00',
    ]);
    OrderItem::factory()->create([
        'order_id' => $firstOrder->id,
        'product_id' => $lavanda->id,
        'product_name' => $lavanda->name,
        'quantity' => 2,
        'unit_price' => 400.00,
        'subtotal' => 800.00,
    ]);

    $secondOrder = Order::factory()->processing()->create([
        'total_amount' => 500.00,
        'created_at' => '2026-07-02 10:00:00',
    ]);
    OrderItem::factory()->create([
        'order_id' => $secondOrder->id,
        'product_id' => $neutro->id,
        'product_name' => $neutro->name,
        'quantity' => 5,
        'unit_price' => 100.00,
        'subtotal' => 500.00,
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

    $pendingOrder = Order::factory()->create([
        'payment_status' => 'pending',
        'total_amount' => 777.00,
        'created_at' => '2026-07-02 13:00:00',
    ]);
    OrderItem::factory()->create([
        'order_id' => $pendingOrder->id,
        'product_id' => $lavanda->id,
        'quantity' => 7,
        'subtotal' => 777.00,
    ]);

    $payload = json_decode((string) app(MarketingSalesSummary::class)->handle(new Request([
        'start_date' => '2026-07-01',
        'end_date' => '2026-07-03',
        'limit' => 10,
    ])), true, 512, JSON_THROW_ON_ERROR);

    expect($payload['summary']['order_count'])->toBe(2)
        ->and($payload['summary']['total_revenue'])->toBe(1500)
        ->and($payload['summary']['average_order_value'])->toBe(750)
        ->and($payload['top_products'])->toHaveCount(2)
        ->and($payload['top_products'][0]['product_id'])->toBe($lavanda->id)
        ->and($payload['top_products'][0]['product_name'])->toBe('Aceite lavanda 5 L')
        ->and($payload['top_products'][0]['sku'])->toBe('LAV-5L')
        ->and($payload['top_products'][0]['slug'])->toBe('aceite-lavanda-5l')
        ->and($payload['top_products'][0]['category'])->toBe('Aceites profesionales')
        ->and($payload['top_products'][0]['quantity_sold'])->toBe(2)
        ->and($payload['top_products'][0]['revenue'])->toBe(800)
        ->and($payload['top_products'][0]['order_count'])->toBe(1)
        ->and($payload['top_products'][1]['product_id'])->toBe($neutro->id)
        ->and($payload['top_products'][1]['quantity_sold'])->toBe(5)
        ->and($payload['top_products'][1]['revenue'])->toBe(500);
});
