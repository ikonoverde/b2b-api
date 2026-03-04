<?php

use App\Models\Banner;

test('banners endpoint returns active banners', function () {
    Banner::factory()->create(['title' => 'Active Banner', 'is_active' => true]);
    Banner::factory()->inactive()->create(['title' => 'Inactive Banner']);

    $response = $this->getJson('/api/banners');

    $response->assertSuccessful();
    $response->assertJsonCount(1, 'data');
    $response->assertJsonPath('data.0.title', 'Active Banner');
});

test('banners endpoint excludes expired banners', function () {
    Banner::factory()->create(['title' => 'Current', 'is_active' => true]);
    Banner::factory()->expired()->create(['title' => 'Expired']);

    $response = $this->getJson('/api/banners');

    $response->assertSuccessful();
    $response->assertJsonCount(1, 'data');
    $response->assertJsonPath('data.0.title', 'Current');
});

test('banners endpoint excludes scheduled banners not yet started', function () {
    Banner::factory()->create(['title' => 'Current', 'is_active' => true]);
    Banner::factory()->scheduled()->create(['title' => 'Future']);

    $response = $this->getJson('/api/banners');

    $response->assertSuccessful();
    $response->assertJsonCount(1, 'data');
});

test('banners endpoint returns correct ordering', function () {
    Banner::factory()->create(['title' => 'Second', 'display_order' => 2]);
    Banner::factory()->create(['title' => 'First', 'display_order' => 1]);

    $response = $this->getJson('/api/banners');

    $response->assertJsonPath('data.0.title', 'First');
    $response->assertJsonPath('data.1.title', 'Second');
});

test('banners endpoint returns correct structure', function () {
    Banner::factory()->create();

    $response = $this->getJson('/api/banners');

    $response->assertJsonStructure([
        'data' => [
            '*' => ['id', 'title', 'subtitle', 'image_url', 'link_url', 'link_text'],
        ],
    ]);
});

test('banners endpoint is publicly accessible', function () {
    $response = $this->getJson('/api/banners');

    $response->assertSuccessful();
});
