<?php

namespace App\Console\Commands;

use App\Services\ImageService;
use Illuminate\Console\Command;
use InvalidArgumentException;
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
    public function handle(ImageService $images): int
    {
        $this->info('Generating image...');

        try {
            $result = $images->generate(
                prompt: $this->argument('prompt'),
                size: $this->option('size'),
                quality: $this->option('quality'),
                provider: $this->option('provider') ?: null,
                model: $this->option('model') ?: null,
                references: $this->option('reference'),
                disk: $this->option('disk'),
                path: $this->option('path'),
                name: $this->option('name') ?: null,
            );
        } catch (InvalidArgumentException $e) {
            $this->error($e->getMessage());

            return self::INVALID;
        } catch (Throwable $e) {
            $this->error('Image generation failed: '.$e->getMessage());
            $this->line('Ensure the provider API key (e.g. GEMINI_API_KEY) is set in your .env file.');

            return self::FAILURE;
        }

        $this->info("Image stored: [{$result['disk']}] {$result['path']}");

        if ($result['url'] !== null) {
            $this->line('URL: '.$result['url']);
        }

        return self::SUCCESS;
    }
}
