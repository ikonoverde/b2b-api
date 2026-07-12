<?php

namespace App\Ai\Tools;

use App\Ai\Tools\Ads\Concerns\FormatsToolResponses;
use App\Services\Ads\MetaDatasetService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

/**
 * Does not extend Ads\MetaTool: that base injects MetaGraphService, which reads the Page and
 * Instagram graph and cannot see the pixel at all.
 */
class GetMetaDataset implements Tool
{
    use FormatsToolResponses;

    public function __construct(protected MetaDatasetService $datasets) {}

    public function name(): string
    {
        return 'meta_get_dataset';
    }

    public function description(): Stringable|string
    {
        return 'Read the Meta pixel dataset: configuration, event counts by name, the browser-versus-server delivery split, and which match keys arrived. This is the only tool that can see Meta Pixel and Conversions API events; the Page and Instagram tools read organic data and are blind to them. Counts include test orders and developer traffic and are not sales.';
    }

    public function handle(Request $request): Stringable|string
    {
        $section = $request->string('section')->toString() ?: 'all';
        $since = $request->string('since')->toString() ?: null;
        $until = $request->string('until')->toString() ?: null;

        $sections = [
            'details' => fn (): array => $this->datasets->details(),
            'event_counts' => fn (): array => $this->datasets->eventCounts(since: $since, until: $until),
            'event_sources' => fn (): array => $this->datasets->eventSources(since: $since, until: $until),
            'match_keys' => fn (): array => $this->datasets->matchKeys(since: $since, until: $until),
        ];

        if ($section !== 'all' && ! isset($sections[$section])) {
            return $this->json([
                'error' => true,
                'message' => sprintf('Unknown section [%s]. Available: %s, all.', $section, implode(', ', array_keys($sections))),
            ]);
        }

        $requested = $section === 'all' ? $sections : [$section => $sections[$section]];

        return $this->json(array_map(fn (callable $read): array => $read(), $requested));
    }

    /**
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'section' => $schema->string()
                ->nullable()
                ->description('details (dataset configuration and last_fired_time), event_counts (total per event name), event_sources (BROWSER versus SERVER — the only way to tell a browser pixel event from a Conversions API event), match_keys (which identifiers arrived; absent fbp/fbc means the visitor blocked the pixel script). Defaults to all.'),
            'since' => $schema->string()
                ->nullable()
                ->description('Start of the window. Meta serves at most '.MetaDatasetService::MAX_LOOKBACK_DAYS.' days and silently clamps anything earlier; the response reports whether it did in window.truncated_to_max_lookback.'),
            'until' => $schema->string()
                ->nullable()
                ->description('End of the window. Defaults to now.'),
        ];
    }
}
