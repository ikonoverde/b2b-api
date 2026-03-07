<?php

use App\Jobs\ProcessProductImage;
use App\Models\ProductImage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
});

it('converts an uploaded image to webp and creates a thumbnail', function () {
    $fakeImage = UploadedFile::fake()->image('product.jpg', 2000, 2000);
    $originalPath = $fakeImage->store('products', 'public');

    $productImage = ProductImage::factory()->create([
        'image_path' => $originalPath,
    ]);

    (new ProcessProductImage($productImage))->handle();

    $productImage->refresh();

    expect($productImage->image_path)->toEndWith('.webp');
    expect($productImage->image_path)->toStartWith('products/');

    Storage::disk('public')->assertExists($productImage->image_path);

    $thumbPath = 'products/thumb/'.basename($productImage->image_path);
    Storage::disk('public')->assertExists($thumbPath);
});

it('updates image_path on the model to the webp path', function () {
    $fakeImage = UploadedFile::fake()->image('photo.png', 800, 600);
    $originalPath = $fakeImage->store('products', 'public');

    $productImage = ProductImage::factory()->create([
        'image_path' => $originalPath,
    ]);

    (new ProcessProductImage($productImage))->handle();

    $productImage->refresh();

    expect($productImage->image_path)->toEndWith('.webp');
    expect($productImage->is_optimized)->toBeTrue();
});

it('deletes the original file after conversion', function () {
    $fakeImage = UploadedFile::fake()->image('original.jpg', 1000, 1000);
    $originalPath = $fakeImage->store('products', 'public');

    $productImage = ProductImage::factory()->create([
        'image_path' => $originalPath,
    ]);

    (new ProcessProductImage($productImage))->handle();

    Storage::disk('public')->assertMissing($originalPath);
});

it('thumbnail accessor falls back to full image when thumb does not exist', function () {
    $fakeImage = UploadedFile::fake()->image('no-thumb.jpg', 500, 500);
    $originalPath = $fakeImage->store('products', 'public');

    $productImage = ProductImage::factory()->create([
        'image_path' => $originalPath,
    ]);

    expect($productImage->thumbnail_url)->toBe($productImage->image_url);
});

it('thumbnail accessor returns thumb url when thumb exists', function () {
    $fakeImage = UploadedFile::fake()->image('with-thumb.jpg', 2000, 2000);
    $originalPath = $fakeImage->store('products', 'public');

    $productImage = ProductImage::factory()->create([
        'image_path' => $originalPath,
    ]);

    (new ProcessProductImage($productImage))->handle();

    $productImage->refresh();

    $thumbPath = 'products/thumb/'.basename($productImage->image_path);
    Storage::disk('public')->assertExists($thumbPath);

    expect($productImage->thumbnail_url)->toContain('products/thumb/');
    expect($productImage->thumbnail_url)->not->toBe($productImage->image_url);
});

it('skips processing when the original file does not exist', function () {
    $productImage = ProductImage::factory()->create([
        'image_path' => 'products/nonexistent.jpg',
    ]);

    (new ProcessProductImage($productImage))->handle();

    $productImage->refresh();

    expect($productImage->image_path)->toBe('products/nonexistent.jpg');
});
