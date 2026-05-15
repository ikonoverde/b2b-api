<?php

use Illuminate\Support\Facades\Storage;
use Laravel\Ai\Image;
use Laravel\Ai\Prompts\ImagePrompt;
use Symfony\Component\Console\Command\Command;

it('generates an image and stores it on the given disk', function () {
    Storage::fake('public');
    Image::fake([base64_encode('generated-bytes')]);

    $this->artisan('image:generate', [
        'prompt' => 'A minimal product mockup on a white desk',
        '--size' => '3:2',
        '--quality' => 'high',
        '--path' => 'ai-images',
        '--name' => 'hero',
    ])->assertSuccessful();

    Storage::disk('public')->assertExists('ai-images/hero.png');
    expect(Storage::disk('public')->get('ai-images/hero.png'))->toBe('generated-bytes');

    Image::assertGenerated(fn (ImagePrompt $prompt): bool => $prompt->prompt === 'A minimal product mockup on a white desk'
        && $prompt->isLandscape()
        && $prompt->quality === 'high'
    );
});

it('rejects an invalid size', function () {
    Image::fake();

    $this->artisan('image:generate', [
        'prompt' => 'anything',
        '--size' => '16:9',
    ])->assertExitCode(Command::INVALID);

    Image::assertNothingGenerated();
});

it('rejects an invalid quality', function () {
    Image::fake();

    $this->artisan('image:generate', [
        'prompt' => 'anything',
        '--quality' => 'ultra',
    ])->assertExitCode(Command::INVALID);

    Image::assertNothingGenerated();
});

it('fails gracefully when the provider throws', function () {
    Storage::fake('public');
    Image::fake(fn () => throw new RuntimeException('Missing GEMINI_API_KEY'));

    $this->artisan('image:generate', ['prompt' => 'anything'])
        ->expectsOutputToContain('Image generation failed: Missing GEMINI_API_KEY')
        ->assertFailed();
});
