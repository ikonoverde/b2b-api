<?php

use App\Ai\Tools\Images\GenerateImage;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Laravel\Ai\Image;
use Laravel\Ai\Prompts\ImagePrompt;
use Laravel\Ai\Tools\Request;

function makeImageToolTestImage(int $width, int $height): string
{
    return (string) ImageManager::gd()->create($width, $height)->fill('22c55e')->toPng();
}

it('generates and optimizes an image', function () {
    Storage::fake('public');
    Image::fake([base64_encode(makeImageToolTestImage(1600, 900))]);

    $payload = json_decode((string) app(GenerateImage::class)->handle(new Request([
        'prompt' => 'A polished B2B ecommerce hero image for Ikonoverde crop nutrition products',
        'size' => '3:2',
        'generation_quality' => 'high',
        'path' => 'ai-images',
        'name' => 'hero',
        'format' => 'webp',
        'max_width' => 800,
    ])), true);

    expect($payload)
        ->not->toHaveKey('error')
        ->and($payload['generated_path'])->toBe('ai-images/hero.png')
        ->and($payload['optimized_path'])->toBe('ai-images/hero.webp')
        ->and($payload['optimized_url'])->toBe(rtrim(config('app.url'), '/').'/storage/ai-images/hero.webp');

    Storage::disk('public')->assertExists('ai-images/hero.png');
    Storage::disk('public')->assertExists('ai-images/hero.webp');

    $optimized = ImageManager::gd()->read(Storage::disk('public')->get('ai-images/hero.webp'));

    expect($optimized->width())->toBe(800)
        ->and($optimized->height())->toBe(450);

    Image::assertGenerated(fn (ImagePrompt $prompt): bool => $prompt->prompt === 'A polished B2B ecommerce hero image for Ikonoverde crop nutrition products'
        && $prompt->isLandscape()
        && $prompt->quality === 'high'
    );
});

it('rejects conflicting optimization options before generating', function () {
    Storage::fake('public');
    Image::fake();

    $payload = json_decode((string) app(GenerateImage::class)->handle(new Request([
        'prompt' => 'A product image',
        'cover' => '1200x630',
        'max_width' => 800,
    ])), true);

    expect($payload['error'])->toBe('Use either max_width or cover, not both.');

    Image::assertNothingGenerated();
});

it('treats blank optional arguments as omitted', function () {
    Storage::fake('public');
    Image::fake([base64_encode(makeImageToolTestImage(1024, 1024))]);

    $payload = json_decode((string) app(GenerateImage::class)->handle(new Request([
        'prompt' => 'A square product image',
        'provider' => '',
        'model' => '',
        'path' => 'ai-images',
        'name' => 'blank-args',
        'format' => 'webp',
        'max_width' => 0,
        'cover' => '512x512',
        'output' => '',
    ])), true);

    expect($payload)
        ->not->toHaveKey('error')
        ->and($payload['optimized_path'])->toBe('ai-images/blank-args.webp');

    $optimized = ImageManager::gd()->read(Storage::disk('public')->get('ai-images/blank-args.webp'));

    expect($optimized->width())->toBe(512)
        ->and($optimized->height())->toBe(512);
});
