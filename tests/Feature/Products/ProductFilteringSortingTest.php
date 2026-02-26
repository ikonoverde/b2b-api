<?php

use App\Models\Category;
use App\Models\Product;

test('products can be filtered by a single category_id', function () {
    $category = Category::factory()->create();
    $other = Category::factory()->create();

    Product::factory(3)->create(['category_id' => $category->id]);
    Product::factory(2)->create(['category_id' => $other->id]);

    $response = $this->getJson('/api/products?category_id[]='.$category->id);

    $response->assertSuccessful();
    $response->assertJsonCount(3, 'data');
});

test('products can be filtered by multiple category_ids', function () {
    $catA = Category::factory()->create();
    $catB = Category::factory()->create();
    $catC = Category::factory()->create();

    Product::factory(2)->create(['category_id' => $catA->id]);
    Product::factory(3)->create(['category_id' => $catB->id]);
    Product::factory(1)->create(['category_id' => $catC->id]);

    $response = $this->getJson('/api/products?category_id[]='.$catA->id.'&category_id[]='.$catB->id);

    $response->assertSuccessful();
    $response->assertJsonCount(5, 'data');
});

test('products can be filtered by price_min', function () {
    Product::factory()->create(['price' => 10.00]);
    Product::factory()->create(['price' => 50.00]);
    Product::factory()->create(['price' => 100.00]);

    $response = $this->getJson('/api/products?price_min=50');

    $response->assertSuccessful();
    $response->assertJsonCount(2, 'data');
});

test('products can be filtered by price_max', function () {
    Product::factory()->create(['price' => 10.00]);
    Product::factory()->create(['price' => 50.00]);
    Product::factory()->create(['price' => 100.00]);

    $response = $this->getJson('/api/products?price_max=50');

    $response->assertSuccessful();
    $response->assertJsonCount(2, 'data');
});

test('products can be filtered by price range', function () {
    Product::factory()->create(['price' => 10.00]);
    Product::factory()->create(['price' => 50.00]);
    Product::factory()->create(['price' => 100.00]);
    Product::factory()->create(['price' => 200.00]);

    $response = $this->getJson('/api/products?price_min=30&price_max=150');

    $response->assertSuccessful();
    $response->assertJsonCount(2, 'data');
});

test('products can be searched by name', function () {
    Product::factory()->create(['name' => 'Fertilizante Premium']);
    Product::factory()->create(['name' => 'Semilla de Maíz']);
    Product::factory()->create(['name' => 'Fertilizante Orgánico']);

    $response = $this->getJson('/api/products?search=Fertilizante');

    $response->assertSuccessful();
    $response->assertJsonCount(2, 'data');
});

test('products can be searched by description', function () {
    Product::factory()->create(['description' => 'Great organic fertilizer for crops']);
    Product::factory()->create(['description' => 'Premium corn seeds']);
    Product::factory()->create(['description' => 'Another fertilizer product']);

    $response = $this->getJson('/api/products?search=fertilizer');

    $response->assertSuccessful();
    $response->assertJsonCount(2, 'data');
});

test('products can be searched by SKU', function () {
    Product::factory()->create(['sku' => 'XYQ-001', 'name' => 'Product A', 'description' => null]);
    Product::factory()->create(['sku' => 'ZZZ-001', 'name' => 'Product B', 'description' => null]);
    Product::factory()->create(['sku' => 'XYQ-002', 'name' => 'Product C', 'description' => null]);

    $response = $this->getJson('/api/products?search=XYQ');

    $response->assertSuccessful();
    $response->assertJsonCount(2, 'data');
});

test('products can be sorted by price ascending', function () {
    Product::factory()->create(['price' => 100.00]);
    Product::factory()->create(['price' => 10.00]);
    Product::factory()->create(['price' => 50.00]);

    $response = $this->getJson('/api/products?sort=price_asc');

    $response->assertSuccessful();
    $data = $response->json('data');
    expect((float) $data[0]['price'])->toBe(10.00);
    expect((float) $data[1]['price'])->toBe(50.00);
    expect((float) $data[2]['price'])->toBe(100.00);
});

test('products can be sorted by price descending', function () {
    Product::factory()->create(['price' => 100.00]);
    Product::factory()->create(['price' => 10.00]);
    Product::factory()->create(['price' => 50.00]);

    $response = $this->getJson('/api/products?sort=price_desc');

    $response->assertSuccessful();
    $data = $response->json('data');
    expect((float) $data[0]['price'])->toBe(100.00);
    expect((float) $data[1]['price'])->toBe(50.00);
    expect((float) $data[2]['price'])->toBe(10.00);
});

test('products can be sorted by name ascending', function () {
    Product::factory()->create(['name' => 'Cherry']);
    Product::factory()->create(['name' => 'Apple']);
    Product::factory()->create(['name' => 'Banana']);

    $response = $this->getJson('/api/products?sort=name_asc');

    $response->assertSuccessful();
    $data = $response->json('data');
    expect($data[0]['name'])->toBe('Apple');
    expect($data[1]['name'])->toBe('Banana');
    expect($data[2]['name'])->toBe('Cherry');
});

test('products can be sorted by name descending', function () {
    Product::factory()->create(['name' => 'Cherry']);
    Product::factory()->create(['name' => 'Apple']);
    Product::factory()->create(['name' => 'Banana']);

    $response = $this->getJson('/api/products?sort=name_desc');

    $response->assertSuccessful();
    $data = $response->json('data');
    expect($data[0]['name'])->toBe('Cherry');
    expect($data[1]['name'])->toBe('Banana');
    expect($data[2]['name'])->toBe('Apple');
});

test('products can be sorted by newest first', function () {
    $oldest = Product::factory()->create(['created_at' => now()->subDays(3)]);
    $newest = Product::factory()->create(['created_at' => now()]);
    $middle = Product::factory()->create(['created_at' => now()->subDay()]);

    $response = $this->getJson('/api/products?sort=newest');

    $response->assertSuccessful();
    $data = $response->json('data');
    expect($data[0]['id'])->toBe($newest->id);
    expect($data[1]['id'])->toBe($middle->id);
    expect($data[2]['id'])->toBe($oldest->id);
});

test('products can be sorted by oldest first', function () {
    $oldest = Product::factory()->create(['created_at' => now()->subDays(3)]);
    $newest = Product::factory()->create(['created_at' => now()]);
    $middle = Product::factory()->create(['created_at' => now()->subDay()]);

    $response = $this->getJson('/api/products?sort=oldest');

    $response->assertSuccessful();
    $data = $response->json('data');
    expect($data[0]['id'])->toBe($oldest->id);
    expect($data[1]['id'])->toBe($middle->id);
    expect($data[2]['id'])->toBe($newest->id);
});

test('filters combine with AND logic', function () {
    $category = Category::factory()->create();
    $other = Category::factory()->create();

    Product::factory()->create(['category_id' => $category->id, 'price' => 10.00, 'name' => 'Cheap In Category']);
    Product::factory()->create(['category_id' => $category->id, 'price' => 100.00, 'name' => 'Expensive In Category']);
    Product::factory()->create(['category_id' => $other->id, 'price' => 10.00, 'name' => 'Cheap Other Category']);

    $response = $this->getJson('/api/products?category_id[]='.$category->id.'&price_max=50');

    $response->assertSuccessful();
    $response->assertJsonCount(1, 'data');
    expect($response->json('data.0.name'))->toBe('Cheap In Category');
});

test('filters work with pagination', function () {
    $category = Category::factory()->create();
    Product::factory(10)->create(['category_id' => $category->id]);
    Product::factory(5)->create();

    $response = $this->getJson('/api/products?category_id[]='.$category->id.'&per_page=3&page=1');

    $response->assertSuccessful();
    $response->assertJsonCount(3, 'data');
    $response->assertJsonPath('meta.total', 10);
    $response->assertJsonPath('meta.last_page', 4);
});

test('search with filters and sorting combined', function () {
    $category = Category::factory()->create();

    Product::factory()->create(['category_id' => $category->id, 'name' => 'Fertilizante A', 'price' => 50.00]);
    Product::factory()->create(['category_id' => $category->id, 'name' => 'Fertilizante B', 'price' => 30.00]);
    Product::factory()->create(['category_id' => $category->id, 'name' => 'Semilla C', 'price' => 20.00]);

    $response = $this->getJson('/api/products?category_id[]='.$category->id.'&search=Fertilizante&sort=price_asc');

    $response->assertSuccessful();
    $response->assertJsonCount(2, 'data');
    expect((float) $response->json('data.0.price'))->toBe(30.00);
    expect((float) $response->json('data.1.price'))->toBe(50.00);
});

test('invalid sort value is rejected', function () {
    $response = $this->getJson('/api/products?sort=invalid');

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('sort');
});

test('invalid category_id is rejected', function () {
    $response = $this->getJson('/api/products?category_id[]=999999');

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('category_id.0');
});

test('price_max less than price_min is rejected', function () {
    $response = $this->getJson('/api/products?price_min=100&price_max=50');

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('price_max');
});

test('negative price_min is rejected', function () {
    $response = $this->getJson('/api/products?price_min=-10');

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('price_min');
});

test('search term exceeding max length is rejected', function () {
    $longSearch = str_repeat('a', 256);

    $response = $this->getJson('/api/products?search='.$longSearch);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('search');
});

test('endpoint still works without any filters', function () {
    Product::factory(3)->create();

    $response = $this->getJson('/api/products');

    $response->assertSuccessful();
    $response->assertJsonCount(3, 'data');
});
