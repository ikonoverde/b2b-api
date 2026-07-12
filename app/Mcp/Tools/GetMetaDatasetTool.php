<?php

namespace App\Mcp\Tools;

use App\Services\Ads\MetaDatasetService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\ResponseFactory;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Attributes\Title;
use Laravel\Mcp\Server\Tool;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[Name('get-meta-dataset')]
#[Title('Get Meta Dataset (Pixel) State')]
#[Description('Read what Meta actually received: dataset configuration, event counts by name, the browser-versus-server split, and which match keys arrived. This is the counterpart to get-conversion-events, which reports only what this app dispatched. A dispatch this app recorded as sent and an event Meta actually counted are different facts. Counts include test orders and are not sales.')]
#[IsReadOnly]
class GetMetaDatasetTool extends Tool
{
    public function handle(Request $request, MetaDatasetService $datasets): Response|ResponseFactory
    {
        $user = $request->user();

        if ($user === null || ! in_array($user->role, ['admin', 'super_admin'], true)) {
            return Response::error('Permission denied.');
        }

        $validated = $request->validate([
            'section' => ['nullable', 'string', 'in:details,event_counts,event_sources,match_keys,all'],
            'since' => ['nullable', 'date'],
            'until' => ['nullable', 'date'],
        ]);

        $section = $validated['section'] ?? 'all';
        $since = $validated['since'] ?? null;
        $until = $validated['until'] ?? null;

        $result = [];

        if (in_array($section, ['details', 'all'], true)) {
            $result['details'] = $datasets->details();
        }

        if (in_array($section, ['event_counts', 'all'], true)) {
            $result['event_counts'] = $datasets->eventCounts(since: $since, until: $until);
        }

        if (in_array($section, ['event_sources', 'all'], true)) {
            $result['event_sources'] = $datasets->eventSources(since: $since, until: $until);
        }

        if (in_array($section, ['match_keys', 'all'], true)) {
            $result['match_keys'] = $datasets->matchKeys(since: $since, until: $until);
        }

        return Response::structured($result);
    }

    /**
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'section' => $schema->string()
                ->nullable()
                ->description('Which slice to read. details is dataset configuration and last_fired_time. event_counts is the total per event name. event_sources splits BROWSER from SERVER, which is the only way to tell a pixel event from a Conversions API event. match_keys shows which identifiers arrived; absent fbp/fbc means the buyer blocked fbevents.js. Defaults to all.'),
            'since' => $schema->string()
                ->nullable()
                ->description('Start of the window. Meta serves at most '.MetaDatasetService::MAX_LOOKBACK_DAYS.' days; anything earlier is silently clamped, and the response says so in window.truncated_to_max_lookback. Defaults to the full lookback.'),
            'until' => $schema->string()
                ->nullable()
                ->description('End of the window. Defaults to now.'),
        ];
    }

    /**
     * @return array<string, Type>
     */
    public function outputSchema(JsonSchema $schema): array
    {
        return [
            'details' => $schema->object()
                ->description('Dataset configuration. last_fired_time is the most recent event of any kind. There is no is_active or server_last_fired_time field on this node — use event_sources for the browser/server split.'),
            'event_counts' => $schema->object()
                ->description('Total count per event name over the window. Includes test orders and dev-environment dispatches; these are not sales.'),
            'event_sources' => $schema->object()
                ->description('Hourly buckets of BROWSER versus SERVER delivery.'),
            'match_keys' => $schema->object()
                ->description('Which match keys arrived with each event. Missing fbp/fbc caps event match quality and indicates the browser pixel never ran.'),
        ];
    }
}
