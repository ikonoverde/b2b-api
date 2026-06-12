<?php

use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Symfony\Component\Console\Command\Command;

function makeOptimizeTestImage(int $width, int $height): string
{
    return (string) ImageManager::gd()->create($width, $height)->fill('f97316')->toPng();
}

it('converts an image to webp and keeps the source', function () {
    Storage::fake('public');
    Storage::disk('public')->put('ai-images/hero.png', makeOptimizeTestImage(1200, 800));

    $this->artisan('image:optimize', [
        'path' => 'ai-images/hero.png',
        '--format' => 'webp',
        '--disk' => 'public',
    ])->assertSuccessful();

    Storage::disk('public')->assertExists('ai-images/hero.webp');
    Storage::disk('public')->assertExists('ai-images/hero.png');
});

it('resizes and crops to exact cover dimensions', function () {
    Storage::fake('public');
    Storage::disk('public')->put('img/wide.png', makeOptimizeTestImage(2400, 800));

    $this->artisan('image:optimize', [
        'path' => 'img/wide.png',
        '--cover' => '1200x630',
        '--disk' => 'public',
    ])->assertSuccessful();

    $image = ImageManager::gd()->read(Storage::disk('public')->get('img/wide.png'));

    expect($image->width())->toBe(1200)
        ->and($image->height())->toBe(630);
});

it('anchors the cover crop to the requested position', function () {
    Storage::fake('public');

    $image = ImageManager::gd()->create(100, 100)->fill('ff0000');
    $image->drawRectangle(0, 50, function ($rectangle) {
        $rectangle->size(100, 50);
        $rectangle->background('0000ff');
    });
    Storage::disk('public')->put('img/split.png', (string) $image->toPng());

    $this->artisan('image:optimize', [
        'path' => 'img/split.png',
        '--cover' => '100x50',
        '--position' => 'top',
        '--disk' => 'public',
    ])->assertSuccessful();

    $cropped = ImageManager::gd()->read(Storage::disk('public')->get('img/split.png'));

    expect($cropped->height())->toBe(50)
        ->and($cropped->pickColor(50, 25)->toHex())->toBe('ff0000');
});

it('rejects an invalid cover position', function () {
    Storage::fake('public');
    Storage::disk('public')->put('img/x.png', makeOptimizeTestImage(100, 100));

    $this->artisan('image:optimize', [
        'path' => 'img/x.png',
        '--cover' => '100x50',
        '--position' => 'middle',
        '--disk' => 'public',
    ])->assertExitCode(Command::INVALID);
});

it('downscales images wider than the max width, preserving aspect ratio', function () {
    Storage::fake('public');
    Storage::disk('public')->put('img/big.png', makeOptimizeTestImage(2000, 1000));

    $this->artisan('image:optimize', [
        'path' => 'img/big.png',
        '--max-width' => '800',
        '--disk' => 'public',
    ])->assertSuccessful();

    $image = ImageManager::gd()->read(Storage::disk('public')->get('img/big.png'));

    expect($image->width())->toBe(800)
        ->and($image->height())->toBe(400);
});

it('optimizes every image in a directory', function () {
    Storage::fake('public');
    Storage::disk('public')->put('batch/a.png', makeOptimizeTestImage(1000, 1000));
    Storage::disk('public')->put('batch/b.png', makeOptimizeTestImage(1000, 1000));

    $this->artisan('image:optimize', [
        'path' => 'batch',
        '--format' => 'webp',
        '--disk' => 'public',
    ])->assertSuccessful();

    Storage::disk('public')->assertExists('batch/a.webp');
    Storage::disk('public')->assertExists('batch/b.webp');
});

it('writes to an explicit output path', function () {
    Storage::fake('public');
    Storage::disk('public')->put('src/in.png', makeOptimizeTestImage(500, 500));

    $this->artisan('image:optimize', [
        'path' => 'src/in.png',
        '--format' => 'webp',
        '--output' => 'dist/out.webp',
        '--disk' => 'public',
    ])->assertSuccessful();

    Storage::disk('public')->assertExists('dist/out.webp');
});

it('optimizes a local filesystem image in place', function () {
    $directory = sys_get_temp_dir().'/img-opt-'.uniqid();
    mkdir($directory);
    $file = $directory.'/local.png';
    file_put_contents($file, makeOptimizeTestImage(1600, 1200));

    $this->artisan('image:optimize', [
        'path' => $file,
        '--max-width' => '400',
    ])->assertSuccessful();

    expect(ImageManager::gd()->read($file)->width())->toBe(400);

    unlink($file);
    rmdir($directory);
});

it('rejects an invalid format', function () {
    Storage::fake('public');
    Storage::disk('public')->put('img/x.png', makeOptimizeTestImage(100, 100));

    $this->artisan('image:optimize', [
        'path' => 'img/x.png',
        '--format' => 'tiff',
        '--disk' => 'public',
    ])->assertExitCode(Command::INVALID);
});

it('rejects invalid cover dimensions', function () {
    Storage::fake('public');
    Storage::disk('public')->put('img/x.png', makeOptimizeTestImage(100, 100));

    $this->artisan('image:optimize', [
        'path' => 'img/x.png',
        '--cover' => '1200-630',
        '--disk' => 'public',
    ])->assertExitCode(Command::INVALID);
});

it('rejects --cover and --max-width together', function () {
    Storage::fake('public');
    Storage::disk('public')->put('img/x.png', makeOptimizeTestImage(100, 100));

    $this->artisan('image:optimize', [
        'path' => 'img/x.png',
        '--cover' => '100x100',
        '--max-width' => '50',
        '--disk' => 'public',
    ])->assertExitCode(Command::INVALID);
});

it('fails when the path does not exist', function () {
    Storage::fake('public');

    $this->artisan('image:optimize', [
        'path' => 'nope/missing.png',
        '--disk' => 'public',
    ])->assertExitCode(Command::INVALID);
});
