<?php

namespace App\Mcp\Tools;

use App\Services\ImageService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use InvalidArgumentException;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\ResponseFactory;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Attributes\Title;
use Laravel\Mcp\Server\Tool;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsOpenWorld;
use Throwable;

#[Name('generate-and-optimize-image')]
#[Title('Generate and Optimize Image')]
#[Description('Generate an image with the configured AI provider, optimize it, and store the final image on a Laravel filesystem disk.')]
#[IsDestructive(false)]
#[IsOpenWorld]
class GenerateAndOptimizeImageTool extends Tool
{
    /**
     * Handle the tool request.
     */
    public function handle(Request $request, ImageService $images): Response|ResponseFactory
    {
        $validated = $request->validate([
            'prompt' => ['required', 'string', 'max:4000'],
            'size' => ['nullable', 'string', 'in:1:1,3:2,2:3'],
            'generation_quality' => ['nullable', 'string', 'in:low,medium,high'],
            'provider' => ['nullable', 'string', 'max:100'],
            'model' => ['nullable', 'string', 'max:100'],
            'references' => ['nullable', 'array'],
            'references.*' => ['string'],
            'disk' => ['nullable', 'string', 'max:100'],
            'path' => ['nullable', 'string', 'max:255'],
            'name' => ['nullable', 'string', 'max:120'],
            'format' => ['nullable', 'string', 'in:webp,jpeg,jpg,png'],
            'optimize_quality' => ['nullable', 'integer', 'min:1', 'max:100'],
            'max_width' => ['nullable', 'integer', 'min:1'],
            'cover' => ['nullable', 'string', 'regex:/^\d+x\d+$/'],
            'position' => ['nullable', 'string', 'in:top-left,top,top-right,left,center,right,bottom-left,bottom,bottom-right'],
            'output' => ['nullable', 'string', 'max:255'],
        ], [
            'prompt.required' => 'Provide a prompt describing the image to generate.',
            'size.in' => 'Use one of these generation sizes: 1:1, 3:2, or 2:3.',
            'generation_quality.in' => 'Use one of these generation quality values: low, medium, or high.',
            'format.in' => 'Use one of these optimization formats: webp, jpeg, jpg, or png.',
            'cover.regex' => 'Use cover dimensions in WIDTHxHEIGHT format, such as 1200x630.',
        ]);

        if (array_key_exists('cover', $validated) && array_key_exists('max_width', $validated)) {
            return Response::error('Use either max_width or cover, not both.');
        }

        try {
            $generated = $images->generate(
                prompt: $validated['prompt'],
                size: $validated['size'] ?? '1:1',
                quality: $validated['generation_quality'] ?? 'high',
                provider: $validated['provider'] ?? null,
                model: $validated['model'] ?? null,
                references: $validated['references'] ?? [],
                disk: $validated['disk'] ?? 'public',
                path: $validated['path'] ?? 'ai-images',
                name: $validated['name'] ?? null,
            );

            $optimized = $images->optimize(
                path: $generated['path'],
                format: $validated['format'] ?? null,
                quality: $validated['optimize_quality'] ?? 80,
                maxWidth: $validated['max_width'] ?? null,
                cover: $validated['cover'] ?? null,
                position: $validated['position'] ?? 'center',
                disk: $generated['disk'],
                output: $validated['output'] ?? null,
            );
        } catch (InvalidArgumentException $e) {
            return Response::error($e->getMessage());
        } catch (Throwable $e) {
            return Response::error('Image generation or optimization failed: '.$e->getMessage());
        }

        $result = $optimized['results'][0];
        $optimizedUrl = $images->storageUrl($generated['disk'], $result['destination']);

        return Response::structured([
            'disk' => $generated['disk'],
            'generated_path' => $generated['path'],
            'generated_url' => $generated['url'],
            'optimized_path' => $result['destination'],
            'optimized_url' => $optimizedUrl,
            'mime' => $generated['mime'],
            'bytes_before' => $result['before'],
            'bytes_after' => $result['after'],
            'savings' => $images->savings($result['before'], $result['after']),
        ]);
    }

    /**
     * Get the tool's input schema.
     *
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'prompt' => $schema->string()
                ->description('Text prompt describing the image to generate.')
                ->required(),
            'size' => $schema->string()
                ->enum(['1:1', '3:2', '2:3'])
                ->description('Generation aspect ratio.')
                ->default('1:1'),
            'generation_quality' => $schema->string()
                ->enum(['low', 'medium', 'high'])
                ->description('AI image generation quality.')
                ->default('high'),
            'provider' => $schema->string()
                ->description('AI provider to use. Defaults to the image provider configured for the app.'),
            'model' => $schema->string()
                ->description('Provider model to use. Defaults to the provider default.'),
            'references' => $schema->array()
                ->items($schema->string()->description('Server-local reference image path.'))
                ->description('Optional server-local reference image paths to guide or edit the image.'),
            'disk' => $schema->string()
                ->description('Filesystem disk where the generated and optimized image should be stored.')
                ->default('public'),
            'path' => $schema->string()
                ->description('Directory on the disk where the generated image should be stored.')
                ->default('ai-images'),
            'name' => $schema->string()
                ->description('Filename without extension. Defaults to a random name.'),
            'format' => $schema->string()
                ->enum(['webp', 'jpeg', 'jpg', 'png'])
                ->description('Optional output format for optimization. Defaults to the generated format.'),
            'optimize_quality' => $schema->integer()
                ->min(1)
                ->max(100)
                ->description('Encoding quality for lossy optimization formats.')
                ->default(80),
            'max_width' => $schema->integer()
                ->min(1)
                ->description('Downscale images wider than this many pixels, preserving aspect ratio. Do not use with cover.'),
            'cover' => $schema->string()
                ->pattern('^\d+x\d+$')
                ->description('Resize and crop to exact dimensions, such as 1200x630. Do not use with max_width.'),
            'position' => $schema->string()
                ->enum(['top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right'])
                ->description('Crop anchor for cover resizing.')
                ->default('center'),
            'output' => $schema->string()
                ->description('Optional destination path on the same disk for the optimized file.'),
        ];
    }

    /**
     * @return array<string, Type>
     */
    public function outputSchema(JsonSchema $schema): array
    {
        return [
            'disk' => $schema->string()->description('Filesystem disk used for the image.')->required(),
            'generated_path' => $schema->string()->description('Path to the generated source image.')->required(),
            'generated_url' => $schema->string()->nullable()->description('Public URL for the generated source image when available.'),
            'optimized_path' => $schema->string()->description('Path to the optimized image.')->required(),
            'optimized_url' => $schema->string()->nullable()->description('Public URL for the optimized image when available.'),
            'mime' => $schema->string()->description('MIME type returned by the generation provider.')->required(),
            'bytes_before' => $schema->integer()->description('Source bytes before optimization.')->required(),
            'bytes_after' => $schema->integer()->description('Optimized bytes after optimization.')->required(),
            'savings' => $schema->string()->description('Human-readable percent change from optimization.')->required(),
        ];
    }
}
