<?php

use App\Mcp\Servers\TrackingServer;
use App\Mcp\Tools\GetConversionEventsTool;
use App\Mcp\Tools\GetMetaDatasetTool;
use App\Models\MetaConversionEvent;
use App\Models\Order;
use App\Models\User;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\Http;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Passport\Passport;

it('requires authentication for the tracking mcp http server', function () {
    $this->postJson('/mcp/tracking', [
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
    /** @var Authenticatable $admin */
    $admin = User::factory()->admin()->create();

    Passport::actingAs($admin, ['mcp:use']);

    $this->postJson('/mcp/tracking', [
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
    ])
        ->assertOk()
        ->assertHeader('MCP-Session-Id')
        ->assertJsonPath('result.serverInfo.name', 'Tracking Server');
});

it('denies non-admin users', function () {
    $user = User::factory()->create();

    TrackingServer::actingAs($user)
        ->tool(GetConversionEventsTool::class, [])
        ->assertHasErrors();
});

it('returns conversion events newest first', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->create();

    MetaConversionEvent::factory()->for($order)->create([
        'event_id' => 'order_old',
        'sent_at' => now()->subDay(),
    ]);
    MetaConversionEvent::factory()->for($order)->create([
        'event_id' => 'order_new',
        'sent_at' => now(),
    ]);

    TrackingServer::actingAs($admin)->tool(GetConversionEventsTool::class, [])
        ->assertOk()
        ->assertName('get-conversion-events')
        ->assertStructuredContent(fn (AssertableJson $json) => $json
            ->where('count', 2)
            ->where('events.0.event_id', 'order_new')
            ->where('events.1.event_id', 'order_old')
            ->etc()
        );
});

it('reports an empty result rather than erroring when no dispatch was ever attempted', function () {
    $admin = User::factory()->admin()->create();

    TrackingServer::actingAs($admin)->tool(GetConversionEventsTool::class, [])
        ->assertOk()
        ->assertStructuredContent(fn (AssertableJson $json) => $json
            ->where('count', 0)
            ->where('events', [])
            ->etc()
        );
});

it('surfaces the skipped_missing_credentials status so a silent config gap is observable', function () {
    $admin = User::factory()->admin()->create();

    MetaConversionEvent::factory()->skippedMissingCredentials()->create();
    MetaConversionEvent::factory()->create();

    TrackingServer::actingAs($admin)->tool(GetConversionEventsTool::class, [
        'status' => MetaConversionEvent::STATUS_SKIPPED_MISSING_CREDENTIALS,
    ])
        ->assertOk()
        ->assertStructuredContent(fn (AssertableJson $json) => $json
            ->where('count', 1)
            ->where('events.0.status', MetaConversionEvent::STATUS_SKIPPED_MISSING_CREDENTIALS)
            ->etc()
        );
});

it('distinguishes test events from real sales', function () {
    $admin = User::factory()->admin()->create();

    MetaConversionEvent::factory()->testEvent()->create(['test_event_code' => 'TEST12345']);

    TrackingServer::actingAs($admin)->tool(GetConversionEventsTool::class, [])
        ->assertOk()
        ->assertStructuredContent(fn (AssertableJson $json) => $json
            ->where('events.0.is_test_event', true)
            ->where('events.0.test_event_code', 'TEST12345')
            ->etc()
        );
});

it('filters by order and date range', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->create();
    $otherOrder = Order::factory()->create();

    MetaConversionEvent::factory()->for($order)->create(['sent_at' => now()->subDays(5)]);
    MetaConversionEvent::factory()->for($order)->create(['sent_at' => now()]);
    MetaConversionEvent::factory()->for($otherOrder)->create(['sent_at' => now()]);

    TrackingServer::actingAs($admin)->tool(GetConversionEventsTool::class, [
        'order_id' => $order->id,
        'since' => now()->subDay()->toISOString(),
    ])
        ->assertOk()
        ->assertStructuredContent(fn (AssertableJson $json) => $json
            ->where('count', 1)
            ->where('events.0.order_id', $order->id)
            ->etc()
        );
});

it('rejects an unknown status', function () {
    $admin = User::factory()->admin()->create();

    TrackingServer::actingAs($admin)
        ->tool(GetConversionEventsTool::class, ['status' => 'not_a_status'])
        ->assertHasErrors();
});

it('caps the limit', function () {
    $admin = User::factory()->admin()->create();

    TrackingServer::actingAs($admin)
        ->tool(GetConversionEventsTool::class, ['limit' => 500])
        ->assertHasErrors();
});

it('denies non-admin users on the dataset tool', function () {
    $user = User::factory()->create();

    TrackingServer::actingAs($user)
        ->tool(GetMetaDatasetTool::class, [])
        ->assertHasErrors();
});

it('reads the meta dataset, reporting what meta received rather than what we sent', function () {
    $admin = User::factory()->admin()->create();

    config()->set('services.meta_ads.access_token', 'token-123');
    config()->set('services.meta_ads.dataset_id', 'dataset-123');

    Http::fake([
        '*/stats*' => Http::response([
            'data' => [[
                'aggregation' => 'event_total_counts',
                'data' => [['value' => 'Purchase', 'count' => 3]],
            ]],
        ]),
        '*' => Http::response([
            'id' => '2222947471863923',
            'name' => 'IkonoverdePro Web',
            'last_fired_time' => '2026-07-11T17:54:37-0600',
        ]),
    ]);

    TrackingServer::actingAs($admin)->tool(GetMetaDatasetTool::class, [])
        ->assertOk()
        ->assertName('get-meta-dataset')
        ->assertStructuredContent(fn (AssertableJson $json) => $json
            ->where('details.name', 'IkonoverdePro Web')
            ->where('event_counts.data.0.data.0.count', 3)
            ->etc()
        );
});

it('reads a single section when asked', function () {
    $admin = User::factory()->admin()->create();

    config()->set('services.meta_ads.access_token', 'token-123');
    config()->set('services.meta_ads.dataset_id', 'dataset-123');

    Http::fake(['*' => Http::response(['id' => '123', 'name' => 'IkonoverdePro Web'])]);

    TrackingServer::actingAs($admin)->tool(GetMetaDatasetTool::class, ['section' => 'details'])
        ->assertOk()
        ->assertStructuredContent(fn (AssertableJson $json) => $json
            ->where('details.name', 'IkonoverdePro Web')
            ->missing('event_counts')
            ->etc()
        );
});

it('rejects an unknown dataset section', function () {
    $admin = User::factory()->admin()->create();

    TrackingServer::actingAs($admin)
        ->tool(GetMetaDatasetTool::class, ['section' => 'event_match_quality'])
        ->assertHasErrors();
});
