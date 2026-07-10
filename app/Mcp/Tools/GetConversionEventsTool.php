<?php

namespace App\Mcp\Tools;

use App\Models\MetaConversionEvent;
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

#[Name('get-conversion-events')]
#[Title('Get Meta Conversion Events')]
#[Description('Read server-side Meta Conversions API purchase dispatches. One row exists per attempt, including attempts skipped because Meta credentials are unset. The browser cannot observe these events; this tool is the only way to verify the server-side half of purchase tracking.')]
#[IsReadOnly]
class GetConversionEventsTool extends Tool
{
    private const DEFAULT_LIMIT = 25;

    private const MAX_LIMIT = 100;

    /**
     * Handle the tool request.
     */
    public function handle(Request $request): Response|ResponseFactory
    {
        $user = $request->user();

        if ($user === null || ! in_array($user->role, ['admin', 'super_admin'], true)) {
            return Response::error('Permission denied.');
        }

        $validated = $request->validate([
            'order_id' => ['nullable', 'integer'],
            'status' => ['nullable', 'string', 'in:'.implode(',', MetaConversionEvent::STATUSES)],
            'since' => ['nullable', 'date'],
            'until' => ['nullable', 'date'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:'.self::MAX_LIMIT],
        ], [
            'status.in' => 'The status must be one of: '.implode(', ', MetaConversionEvent::STATUSES).'.',
        ]);

        $events = MetaConversionEvent::query()
            ->when($validated['order_id'] ?? null, fn ($query, $orderId) => $query->where('order_id', $orderId))
            ->when($validated['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->when($validated['since'] ?? null, fn ($query, $since) => $query->where('sent_at', '>=', $since))
            ->when($validated['until'] ?? null, fn ($query, $until) => $query->where('sent_at', '<=', $until))
            ->latest('sent_at')
            ->limit($validated['limit'] ?? self::DEFAULT_LIMIT)
            ->get();

        return Response::structured([
            'count' => $events->count(),
            'events' => $events->map(fn (MetaConversionEvent $event): array => [
                'id' => $event->id,
                'order_id' => $event->order_id,
                'event_name' => $event->event_name,
                'event_id' => $event->event_id,
                'status' => $event->status,
                'http_status' => $event->http_status,
                'error_message' => $event->error_message,
                'value' => (float) $event->value,
                'currency' => $event->currency,
                'num_items' => $event->num_items,
                'test_event_code' => $event->test_event_code,
                'is_test_event' => $event->isTestEvent(),
                'sent_at' => $event->sent_at->toISOString(),
            ])->values()->all(),
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
            'order_id' => $schema->integer()
                ->nullable()
                ->description('Only return dispatches for this order.'),
            'status' => $schema->string()
                ->nullable()
                ->description('Filter by outcome. sent means Meta accepted the event. rejected means Meta refused the payload. failed means the request never completed. skipped_missing_credentials means no request was attempted because the pixel ID or access token is unset, which is invisible everywhere else.'),
            'since' => $schema->string()
                ->nullable()
                ->description('Only return dispatches at or after this timestamp. ISO 8601 or any Laravel-parseable date.'),
            'until' => $schema->string()
                ->nullable()
                ->description('Only return dispatches at or before this timestamp. ISO 8601 or any Laravel-parseable date.'),
            'limit' => $schema->integer()
                ->nullable()
                ->description('Maximum number of dispatches to return, newest first. Defaults to 25, maximum 100.'),
        ];
    }

    /**
     * @return array<string, Type>
     */
    public function outputSchema(JsonSchema $schema): array
    {
        return [
            'count' => $schema->integer()->description('Number of dispatches returned.')->required(),
            'events' => $schema->array()
                ->description('Matching dispatches, newest first. An empty array means no dispatch was ever attempted, which is different from a dispatch that failed.')
                ->required(),
        ];
    }
}
