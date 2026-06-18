<?php

use App\Mcp\Servers\ImageServer;
use App\Mcp\Tools\GenerateAndOptimizeImageTool;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Laravel\Ai\Image;
use Laravel\Ai\Prompts\ImagePrompt;
use Laravel\Passport\Passport;

function makeMcpImageTestImage(int $width, int $height): string
{
    return (string) ImageManager::gd()->create($width, $height)->fill('0ea5e9')->toPng();
}

it('generates and optimizes an image through the mcp tool', function () {
    Storage::fake('public');
    Image::fake([base64_encode(makeMcpImageTestImage(1600, 900))]);

    $response = ImageServer::tool(GenerateAndOptimizeImageTool::class, [
        'prompt' => 'A premium product hero image on a stone counter',
        'size' => '3:2',
        'generation_quality' => 'high',
        'path' => 'ai-images',
        'name' => 'hero',
        'format' => 'webp',
        'max_width' => 800,
    ]);

    $response
        ->assertOk()
        ->assertName('generate-and-optimize-image')
        ->assertSee([
            'generated_path',
            'ai-images/hero.png',
            'optimized_path',
            'ai-images/hero.webp',
            'optimized_url',
            rtrim(config('app.url'), '/').'/storage/ai-images/hero.webp',
        ]);

    Storage::disk('public')->assertExists('ai-images/hero.png');
    Storage::disk('public')->assertExists('ai-images/hero.webp');

    $optimized = ImageManager::gd()->read(Storage::disk('public')->get('ai-images/hero.webp'));

    expect($optimized->width())->toBe(800)
        ->and($optimized->height())->toBe(450);

    Image::assertGenerated(fn (ImagePrompt $prompt): bool => $prompt->prompt === 'A premium product hero image on a stone counter'
        && $prompt->isLandscape()
        && $prompt->quality === 'high'
    );
});

it('rejects conflicting optimization options before generating', function () {
    Storage::fake('public');
    Image::fake();

    ImageServer::tool(GenerateAndOptimizeImageTool::class, [
        'prompt' => 'A product image',
        'cover' => '1200x630',
        'max_width' => 800,
    ])->assertHasErrors([
        'Use either max_width or cover, not both.',
    ]);

    Image::assertNothingGenerated();
});

it('treats blank optional mcp arguments as omitted', function () {
    Storage::fake('public');
    Image::fake([base64_encode(makeMcpImageTestImage(1024, 1024))]);

    ImageServer::tool(GenerateAndOptimizeImageTool::class, [
        'prompt' => 'A simple blue rocket on a white background',
        'size' => '1:1',
        'generation_quality' => 'low',
        'provider' => '',
        'model' => '',
        'references' => [],
        'disk' => 'public',
        'path' => 'mcp-test',
        'name' => 'images-mcp-test',
        'format' => 'webp',
        'optimize_quality' => 80,
        'max_width' => 512,
        'cover' => '',
        'position' => 'center',
        'output' => '',
    ])->assertOk();

    Storage::disk('public')->assertExists('mcp-test/images-mcp-test.webp');

    $optimized = ImageManager::gd()->read(Storage::disk('public')->get('mcp-test/images-mcp-test.webp'));

    expect($optimized->width())->toBe(512)
        ->and($optimized->height())->toBe(512);
});

it('treats zero max width as omitted when cover is provided', function () {
    Storage::fake('public');
    Image::fake([base64_encode(makeMcpImageTestImage(1024, 768))]);

    ImageServer::tool(GenerateAndOptimizeImageTool::class, [
        'prompt' => 'A simple blue rocket on a white background',
        'path' => 'mcp-test',
        'name' => 'images-mcp-cover-test',
        'format' => 'webp',
        'max_width' => 0,
        'cover' => '512x512',
    ])->assertOk();

    $optimized = ImageManager::gd()->read(Storage::disk('public')->get('mcp-test/images-mcp-cover-test.webp'));

    expect($optimized->width())->toBe(512)
        ->and($optimized->height())->toBe(512);
});

it('advertises optional mcp arguments as nullable', function () {
    $tool = app(GenerateAndOptimizeImageTool::class)->toArray();

    expect($tool['inputSchema']['required'])->toBe(['prompt'])
        ->and($tool['inputSchema']['properties']['cover']['type'])->toBe(['string', 'null'])
        ->and($tool['inputSchema']['properties']['max_width']['type'])->toBe(['integer', 'null'])
        ->and($tool['inputSchema']['properties']['provider']['type'])->toBe(['string', 'null'])
        ->and($tool['inputSchema']['properties']['output']['type'])->toBe(['string', 'null']);
});

it('requires authentication for the mcp http server', function () {
    $this->postJson('/mcp/images', [
        'jsonrpc' => '2.0',
        'id' => 1,
        'method' => 'initialize',
        'params' => [
            'protocolVersion' => '2025-06-18',
            'capabilities' => [],
            'clientInfo' => [
                'name' => 'test-client',
                'version' => '1.0.0',
            ],
        ],
    ])->assertUnauthorized();
});

it('allows mcp initialization with oauth authentication', function () {
    Passport::actingAs(User::factory()->create(), ['mcp:use']);

    $response = $this->postJson('/mcp/images', [
        'jsonrpc' => '2.0',
        'id' => 1,
        'method' => 'initialize',
        'params' => [
            'protocolVersion' => '2025-06-18',
            'capabilities' => [],
            'clientInfo' => [
                'name' => 'test-client',
                'version' => '1.0.0',
            ],
        ],
    ]);

    $response
        ->assertOk()
        ->assertHeader('MCP-Session-Id')
        ->assertJsonPath('result.serverInfo.name', 'Image Server');
});
