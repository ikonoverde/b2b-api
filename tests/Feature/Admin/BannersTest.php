<?php

use App\Models\Banner;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
});

test('admin can view banners page', function () {
    $admin = User::factory()->admin()->create();
    Banner::factory(3)->create();

    $response = $this->actingAs($admin)->get('/admin/banners');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Content/Banners')
        ->has('banners', 3)
    );
});

test('admin can create a banner with product link', function () {
    $admin = User::factory()->admin()->create();
    $product = Product::factory()->create();

    $response = $this->actingAs($admin)->post('/admin/banners', [
        'title' => 'Test Banner',
        'subtitle' => 'A subtitle',
        'image' => UploadedFile::fake()->create('banner.jpg', 100, 'image/jpeg'),
        'link_type' => 'product',
        'link_value' => (string) $product->id,
        'link_text' => 'Ver más',
        'is_active' => true,
    ]);

    $response->assertRedirect('/admin/banners');

    $banner = Banner::first();
    expect($banner->title)->toBe('Test Banner');
    expect($banner->subtitle)->toBe('A subtitle');
    expect($banner->link_type)->toBe('product');
    expect($banner->link_value)->toBe((string) $product->id);
    Storage::disk('public')->assertExists($banner->image_path);
});

test('admin can create a banner with category link', function () {
    $admin = User::factory()->admin()->create();
    $category = Category::factory()->create();

    $response = $this->actingAs($admin)->post('/admin/banners', [
        'title' => 'Category Banner',
        'image' => UploadedFile::fake()->create('banner.jpg', 100, 'image/jpeg'),
        'link_type' => 'category',
        'link_value' => (string) $category->id,
        'is_active' => true,
    ]);

    $response->assertRedirect('/admin/banners');
    $this->assertDatabaseHas('banners', ['link_type' => 'category', 'link_value' => (string) $category->id]);
});

test('admin can create a banner with url link', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post('/admin/banners', [
        'title' => 'URL Banner',
        'image' => UploadedFile::fake()->create('banner.jpg', 100, 'image/jpeg'),
        'link_type' => 'url',
        'link_value' => 'https://example.com/promo',
        'link_text' => 'Ver promo',
        'is_active' => true,
    ]);

    $response->assertRedirect('/admin/banners');
    $this->assertDatabaseHas('banners', ['link_type' => 'url', 'link_value' => 'https://example.com/promo']);
});

test('admin can create a banner without link', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post('/admin/banners', [
        'title' => 'No Link Banner',
        'image' => UploadedFile::fake()->create('banner.jpg', 100, 'image/jpeg'),
        'is_active' => true,
    ]);

    $response->assertRedirect('/admin/banners');
    $banner = Banner::first();
    expect($banner->link_type)->toBeNull();
    expect($banner->link_value)->toBeNull();
});

test('admin can update a banner', function () {
    $admin = User::factory()->admin()->create();
    $banner = Banner::factory()->create(['title' => 'Old Title']);

    $response = $this->actingAs($admin)->put("/admin/banners/{$banner->id}", [
        'title' => 'New Title',
        'is_active' => true,
    ]);

    $response->assertRedirect('/admin/banners');
    expect($banner->fresh()->title)->toBe('New Title');
});

test('admin can update banner with new image', function () {
    $admin = User::factory()->admin()->create();

    $oldImage = UploadedFile::fake()->create('old.jpg', 100, 'image/jpeg');
    $oldPath = $oldImage->store('banners', 'public');
    $banner = Banner::factory()->create(['image_path' => $oldPath]);

    $this->actingAs($admin)->put("/admin/banners/{$banner->id}", [
        'title' => $banner->title,
        'image' => UploadedFile::fake()->create('new.jpg', 100, 'image/jpeg'),
        'is_active' => true,
    ]);

    Storage::disk('public')->assertMissing($oldPath);
    Storage::disk('public')->assertExists($banner->fresh()->image_path);
});

test('admin can delete a banner', function () {
    $admin = User::factory()->admin()->create();
    $banner = Banner::factory()->create();
    $imagePath = $banner->image_path;

    $response = $this->actingAs($admin)->delete("/admin/banners/{$banner->id}");

    $response->assertRedirect('/admin/banners');
    expect(Banner::find($banner->id))->toBeNull();
    Storage::disk('public')->assertMissing($imagePath);
});

test('admin can reorder banners', function () {
    $admin = User::factory()->admin()->create();
    $banners = Banner::factory(3)->create();

    $response = $this->actingAs($admin)->post('/admin/banners/reorder', [
        'items' => [
            ['id' => $banners[2]->id, 'display_order' => 0],
            ['id' => $banners[0]->id, 'display_order' => 1],
            ['id' => $banners[1]->id, 'display_order' => 2],
        ],
    ]);

    $response->assertRedirect();
    expect($banners[2]->fresh()->display_order)->toBe(0);
    expect($banners[0]->fresh()->display_order)->toBe(1);
    expect($banners[1]->fresh()->display_order)->toBe(2);
});

test('admin can toggle banner visibility', function () {
    $admin = User::factory()->admin()->create();
    $banner = Banner::factory()->create(['is_active' => true]);

    $response = $this->actingAs($admin)->patch("/admin/banners/{$banner->id}/visibility");

    $response->assertRedirect();
    expect($banner->fresh()->is_active)->toBeFalse();
});

test('banner creation requires title and image', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post('/admin/banners', []);

    $response->assertSessionHasErrors(['title', 'image']);
});

test('banner creation validates image type', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post('/admin/banners', [
        'title' => 'Test',
        'image' => UploadedFile::fake()->create('doc.pdf', 100, 'application/pdf'),
    ]);

    $response->assertSessionHasErrors('image');
});

test('banner creation rejects invalid link_type', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post('/admin/banners', [
        'title' => 'Test',
        'image' => UploadedFile::fake()->create('banner.jpg', 100, 'image/jpeg'),
        'link_type' => 'invalid',
        'link_value' => 'something',
    ]);

    $response->assertSessionHasErrors('link_type');
});

test('banner creation requires link_value when link_type is set', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post('/admin/banners', [
        'title' => 'Test',
        'image' => UploadedFile::fake()->create('banner.jpg', 100, 'image/jpeg'),
        'link_type' => 'product',
    ]);

    $response->assertSessionHasErrors('link_value');
});

test('banner creation validates product id exists', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post('/admin/banners', [
        'title' => 'Test',
        'image' => UploadedFile::fake()->create('banner.jpg', 100, 'image/jpeg'),
        'link_type' => 'product',
        'link_value' => '99999',
    ]);

    $response->assertSessionHasErrors('link_value');
});

test('banner creation validates category id exists', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post('/admin/banners', [
        'title' => 'Test',
        'image' => UploadedFile::fake()->create('banner.jpg', 100, 'image/jpeg'),
        'link_type' => 'category',
        'link_value' => '99999',
    ]);

    $response->assertSessionHasErrors('link_value');
});

test('banner creation validates url format', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post('/admin/banners', [
        'title' => 'Test',
        'image' => UploadedFile::fake()->create('banner.jpg', 100, 'image/jpeg'),
        'link_type' => 'url',
        'link_value' => 'not-a-url',
    ]);

    $response->assertSessionHasErrors('link_value');
});

test('unauthenticated user cannot access banners page', function () {
    $response = $this->get('/admin/banners');

    $response->assertRedirect('/admin/login');
});
