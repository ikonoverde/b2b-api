<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Laravel\Ai\Files\Image as ReferenceImage;
use Laravel\Ai\Image;
use Laravel\Ai\PendingResponses\PendingImageGeneration;
use Throwable;

class GenerateImageCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'image:generate
        {prompt : The text prompt describing the image to generate}
        {--size=1:1 : Aspect ratio of the image (1:1, 3:2, or 2:3)}
        {--quality=high : Image quality (low, medium, or high)}
        {--provider= : AI provider to use (defaults to config ai.default_for_images, e.g. gemini)}
        {--model= : Provider model to use (defaults to the provider default)}
        {--reference=* : Path to a reference/source image to guide or edit (repeatable)}
        {--disk=public : Filesystem disk to store the generated image on}
        {--path=ai-images : Directory on the disk to store the image in}
        {--name= : Filename without extension; defaults to a random name}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate a marketing image with the configured AI provider and store it on a filesystem disk';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $size = $this->option('size');

        if (! in_array($size, ['1:1', '3:2', '2:3'], true)) {
            $this->error('Invalid --size. Use one of: 1:1, 3:2, 2:3.');

            return self::INVALID;
        }

        $quality = $this->option('quality');

        if (! in_array($quality, ['low', 'medium', 'high'], true)) {
            $this->error('Invalid --quality. Use one of: low, medium, high.');

            return self::INVALID;
        }

        $references = [];

        foreach ($this->option('reference') as $referencePath) {
            if (! is_file($referencePath)) {
                $this->error("Reference image not found: {$referencePath}");

                return self::INVALID;
            }

            $references[] = ReferenceImage::fromPath($referencePath);
        }

        $this->info('Generating image...');

        try {
            $response = Image::of($this->argument('prompt'))
                ->size($size)
                ->quality($quality)
                ->when($references !== [], fn (PendingImageGeneration $pending): PendingImageGeneration => $pending->attachments($references))
                ->generate(
                    $this->option('provider') ?: null,
                    $this->option('model') ?: null,
                );
        } catch (Throwable $e) {
            $this->error('Image generation failed: '.$e->getMessage());
            $this->line('Ensure the provider API key (e.g. GEMINI_API_KEY) is set in your .env file.');

            return self::FAILURE;
        }

        $extension = match ($response->firstImage()->mime) {
            'image/jpeg' => 'jpg',
            'image/webp' => 'webp',
            default => 'png',
        };

        $disk = $this->option('disk');

        $storedPath = $response->storePubliclyAs(
            trim((string) $this->option('path'), '/'),
            ($this->option('name') ?: Str::random(40)).'.'.$extension,
            $disk,
        );

        if ($storedPath === false) {
            $this->error("Generated the image but failed to store it on the [{$disk}] disk.");

            return self::FAILURE;
        }

        $this->info("Image stored: [{$disk}] {$storedPath}");

        try {
            $this->line('URL: '.Storage::disk($disk)->url($storedPath));
        } catch (Throwable) {
            // The disk does not support URL generation; nothing to show.
        }

        return self::SUCCESS;
    }
}
