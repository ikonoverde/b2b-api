<?php

namespace App\Ai\Tools\Images;

use App\Ai\Tools\Ads\Concerns\FormatsToolResponses;
use App\Services\ImageService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Support\Facades\Validator;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;
use Throwable;

class GenerateImage implements Tool
{
    use FormatsToolResponses;

    public function __construct(private ImageService $images) {}

    public function name(): string
    {
        return 'generate_image';
    }

    public function description(): Stringable|string
    {
        return 'Generate an image with the configured AI image provider, optionally optimize it for web or placement dimensions, and return the stored image paths and URLs.';
    }

    public function handle(Request $request): Stringable|string
    {
        $arguments = $this->normalizeArguments($request->all());
        $validator = Validator::make($arguments, [
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

        if ($validator->fails()) {
            return $this->json([
                'error' => $validator->errors()->first(),
            ]);
        }

        /** @var array{prompt: string, size?: string|null, generation_quality?: string|null, provider?: string|null, model?: string|null, references?: list<string>|null, disk?: string|null, path?: string|null, name?: string|null, format?: string|null, optimize_quality?: int|null, max_width?: int|null, cover?: string|null, position?: string|null, output?: string|null} $validated */
        $validated = $validator->validated();

        if (($validated['cover'] ?? null) !== null && ($validated['max_width'] ?? null) !== null) {
            return $this->json([
                'error' => 'Use either max_width or cover, not both.',
            ]);
        }

        try {
            $generated = $this->images->generate(
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

            $optimized = $this->images->optimize(
                path: $generated['path'],
                format: $validated['format'] ?? null,
                quality: $validated['optimize_quality'] ?? 80,
                maxWidth: $validated['max_width'] ?? null,
                cover: $validated['cover'] ?? null,
                position: $validated['position'] ?? 'center',
                disk: $generated['disk'],
                output: $validated['output'] ?? null,
            );
        } catch (Throwable $e) {
            return $this->json([
                'error' => 'Image generation or optimization failed: '.$e->getMessage(),
            ]);
        }

        $result = $optimized['results'][0];

        return $this->json([
            'disk' => $generated['disk'],
            'generated_path' => $generated['path'],
            'generated_url' => $generated['url'],
            'optimized_path' => $result['destination'],
            'optimized_url' => $this->images->storageUrl($generated['disk'], $result['destination']),
            'mime' => $generated['mime'],
            'bytes_before' => $result['before'],
            'bytes_after' => $result['after'],
            'savings' => $this->images->savings($result['before'], $result['after']),
        ]);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'prompt' => $schema->string()
                ->description('Text prompt describing the image to generate. Include subject, audience, intended use, composition, style, dimensions, and any text constraints.')
                ->required(),
            'size' => $schema->string()
                ->nullable()
                ->enum(['1:1', '3:2', '2:3'])
                ->description('Generation aspect ratio. Use 1:1 for square images, 3:2 for landscape images, or 2:3 for vertical images.')
                ->default('1:1'),
            'generation_quality' => $schema->string()
                ->nullable()
                ->enum(['low', 'medium', 'high'])
                ->description('AI image generation quality.')
                ->default('high'),
            'provider' => $schema->string()
                ->nullable()
                ->description('AI image provider to use. Defaults to the app image provider configuration.'),
            'model' => $schema->string()
                ->nullable()
                ->description('Provider model to use. Defaults to the provider default.'),
            'references' => $schema->array()
                ->nullable()
                ->items($schema->string()->description('Server-local reference image path.'))
                ->description('Optional server-local reference image paths to guide or edit the image.'),
            'disk' => $schema->string()
                ->nullable()
                ->description('Filesystem disk where the generated and optimized image should be stored.')
                ->default('public'),
            'path' => $schema->string()
                ->nullable()
                ->description('Directory on the disk where the generated image should be stored.')
                ->default('ai-images'),
            'name' => $schema->string()
                ->nullable()
                ->description('Filename without extension. Defaults to a random name.'),
            'format' => $schema->string()
                ->nullable()
                ->enum(['webp', 'jpeg', 'jpg', 'png'])
                ->description('Optional output format for optimization. Defaults to the generated format.'),
            'optimize_quality' => $schema->integer()
                ->nullable()
                ->min(1)
                ->max(100)
                ->description('Encoding quality for lossy optimization formats.')
                ->default(80),
            'max_width' => $schema->integer()
                ->nullable()
                ->min(1)
                ->description('Downscale images wider than this many pixels, preserving aspect ratio. Do not use with cover.'),
            'cover' => $schema->string()
                ->nullable()
                ->pattern('^\d+x\d+$')
                ->description('Resize and crop to exact dimensions, such as 1200x630. Do not use with max_width.'),
            'position' => $schema->string()
                ->nullable()
                ->enum(['top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right'])
                ->description('Crop anchor for cover resizing.')
                ->default('center'),
            'output' => $schema->string()
                ->nullable()
                ->description('Optional destination path on the same disk for the optimized file.'),
        ];
    }

    /**
     * @param  array<string, mixed>  $arguments
     * @return array<string, mixed>
     */
    private function normalizeArguments(array $arguments): array
    {
        foreach (['size', 'generation_quality', 'provider', 'model', 'disk', 'path', 'name', 'format', 'cover', 'position', 'output'] as $key) {
            if (array_key_exists($key, $arguments) && is_string($arguments[$key])) {
                $arguments[$key] = trim($arguments[$key]) === '' ? null : trim($arguments[$key]);
            }
        }

        if (($arguments['max_width'] ?? null) === '' || ($arguments['max_width'] ?? null) === 0 || ($arguments['max_width'] ?? null) === '0') {
            $arguments['max_width'] = null;
        }

        return $arguments;
    }
}
