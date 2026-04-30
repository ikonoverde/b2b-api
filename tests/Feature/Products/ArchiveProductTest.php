<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;

test('authenticated user can archive a product', function () {
    $user = User::factory()->admin()->create();
    $product = Product::factory()->create([
        'name' => 'Product to Archive',
        'sku' => 'ARCHIVE-001',
    ]);

    $response = $this->actingAs($user)->delete("/admin/products/{$product->id}");

    $response->assertRedirect(route('admin.products'));
    $response->assertSessionHas('success', 'Producto archivado exitosamente');

    $this->assertSoftDeleted('products', [
        'id' => $product->id,
    ]);
});

test('unauthenticated user is redirected to login', function () {
    $product = Product::factory()->create();

    $response = $this->delete("/admin/products/{$product->id}");

    $response->assertRedirect('/admin/login');
});

test('archived product is hidden from product list', function () {
    $user = User::factory()->admin()->create();
    $product = Product::factory()->create(['name' => 'Archived Product']);

    $product->delete();

    $response = $this->actingAs($user)->get('/admin/products');

    $response->assertInertia(fn ($page) => $page
        ->component('Products')
        ->has('products')
        ->where('products', fn ($products) => $products->pluck('name')->doesntContain('Archived Product'))
    );
});

test('archived product is hidden from api product list', function () {
    $product = Product::factory()->create(['name' => 'Archived Product']);

    $product->delete();

    $response = $this->get('/api/products');

    $response->assertJson(fn ($json) => $json
        ->has('data')
        ->where('data', fn ($data) => $data->pluck('name')->doesntContain('Archived Product'))
        ->etc()
    );
});

test('archived product is hidden from featured products api', function () {
    $product = Product::factory()->create([
        'name' => 'Archived Featured',
        'is_featured' => true,
        'is_active' => true,
    ]);

    $product->delete();

    $response = $this->get('/api/products/featured');

    $response->assertJson(fn ($json) => $json
        ->has('data')
        ->where('data', fn ($data) => $data->pluck('name')->doesntContain('Archived Featured'))
        ->etc()
    );
});

test('archived product is not accessible via api detail endpoint', function () {
    $product = Product::factory()->create(['name' => 'Archived Product']);

    $product->delete();

    $response = $this->get("/api/products/{$product->id}");

    $response->assertNotFound();
});

test('archived product remains visible in historical orders', function () {
    $user = User::factory()->admin()->create();
    $product = Product::factory()->create(['name' => 'Historical Product']);

    // Create an order with this product
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'delivered',
    ]);

    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'product_name' => $product->name,
        'quantity' => 5,
        'unit_price' => 29.99,
        'subtotal' => 149.95,
    ]);

    // Now archive the product
    $product->delete();

    // Verify the order still shows the product name
    $orderItem = OrderItem::where('order_id', $order->id)->first();
    expect($orderItem->product_name)->toBe('Historical Product');
});

test('product with pending orders shows has_pending_orders flag', function () {
    $user = User::factory()->admin()->create();
    $product = Product::factory()->create(['name' => 'Product with Pending']);

    // Create an order with pending status
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
    ]);

    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'product_name' => $product->name,
        'quantity' => 2,
        'unit_price' => 19.99,
        'subtotal' => 39.98,
    ]);

    $response = $this->actingAs($user)->get('/admin/products');

    $response->assertInertia(fn ($page) => $page
        ->component('Products')
        ->has('products')
        ->where('products.0.has_pending_orders', true)
    );
});

test('product without pending orders shows has_pending_orders as false', function () {
    $user = User::factory()->admin()->create();
    Product::factory()->create(['name' => 'Product without Pending']);

    $response = $this->actingAs($user)->get('/admin/products');

    $response->assertInertia(fn ($page) => $page
        ->component('Products')
        ->has('products')
        ->where('products.0.has_pending_orders', false)
    );
});

test('cannot archive product with pending orders', function () {
    $user = User::factory()->admin()->create();
    $product = Product::factory()->create();

    // Create an order with pending status
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
    ]);

    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'product_name' => $product->name,
        'quantity' => 2,
        'unit_price' => 19.99,
        'subtotal' => 39.98,
    ]);

    $response = $this->actingAs($user)->delete("/admin/products/{$product->id}");

    $response->assertRedirect(route('admin.products'));
    $response->assertSessionHas('error', 'No se puede eliminar el producto porque tiene pedidos pendientes');

    $this->assertDatabaseHas('products', [
        'id' => $product->id,
        'deleted_at' => null,
    ]);
});

test('can archive product when all orders are completed or cancelled', function () {
    $user = User::factory()->admin()->create();
    $product = Product::factory()->create();

    // Create a delivered order
    $deliveredOrder = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'delivered',
    ]);

    OrderItem::factory()->create([
        'order_id' => $deliveredOrder->id,
        'product_id' => $product->id,
        'product_name' => $product->name,
        'quantity' => 2,
        'unit_price' => 19.99,
        'subtotal' => 39.98,
    ]);

    // Create a cancelled order
    $cancelledOrder = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'cancelled',
    ]);

    OrderItem::factory()->create([
        'order_id' => $cancelledOrder->id,
        'product_id' => $product->id,
        'product_name' => $product->name,
        'quantity' => 1,
        'unit_price' => 19.99,
        'subtotal' => 19.99,
    ]);

    $response = $this->actingAs($user)->delete("/admin/products/{$product->id}");

    $response->assertRedirect(route('admin.products'));
    $response->assertSessionHas('success', 'Producto archivado exitosamente');

    $this->assertSoftDeleted('products', [
        'id' => $product->id,
    ]);
});

test('cannot archive product with payment_pending orders', function () {
    $user = User::factory()->admin()->create();
    $product = Product::factory()->create();

    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'payment_pending',
    ]);

    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'product_name' => $product->name,
        'quantity' => 2,
        'unit_price' => 19.99,
        'subtotal' => 39.98,
    ]);

    $response = $this->actingAs($user)->delete("/admin/products/{$product->id}");

    $response->assertSessionHas('error', 'No se puede eliminar el producto porque tiene pedidos pendientes');
});

test('cannot archive product with processing orders', function () {
    $user = User::factory()->admin()->create();
    $product = Product::factory()->create();

    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'processing',
    ]);

    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'product_name' => $product->name,
        'quantity' => 2,
        'unit_price' => 19.99,
        'subtotal' => 39.98,
    ]);

    $response = $this->actingAs($user)->delete("/admin/products/{$product->id}");

    $response->assertSessionHas('error', 'No se puede eliminar el producto porque tiene pedidos pendientes');
});

test('cannot archive product with shipped orders', function () {
    $user = User::factory()->admin()->create();
    $product = Product::factory()->create();

    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'shipped',
    ]);

    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'product_name' => $product->name,
        'quantity' => 2,
        'unit_price' => 19.99,
        'subtotal' => 39.98,
    ]);

    $response = $this->actingAs($user)->delete("/admin/products/{$product->id}");

    $response->assertSessionHas('error', 'No se puede eliminar el producto porque tiene pedidos pendientes');
});

test('archived products remain in order items with preserved product name', function () {
    $user = User::factory()->admin()->create();
    $product = Product::factory()->create(['name' => 'Original Product Name']);

    // Create an order
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'delivered',
    ]);

    $orderItem = OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'product_name' => $product->name,
        'quantity' => 2,
        'unit_price' => 19.99,
        'subtotal' => 39.98,
    ]);

    // Archive the product
    $product->delete();

    // Verify the order item still exists and has the product name
    $this->assertDatabaseHas('order_items', [
        'id' => $orderItem->id,
        'product_name' => 'Original Product Name',
        'product_id' => $product->id,
    ]);
});
