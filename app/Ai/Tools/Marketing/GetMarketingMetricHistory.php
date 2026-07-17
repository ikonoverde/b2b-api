<?php

namespace App\Ai\Tools\Marketing;

use App\Ai\Tools\Ads\Concerns\FormatsToolResponses;
use App\Models\MarketingReport;
use App\Services\MarketingReportService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

class GetMarketingMetricHistory implements Tool
{
    use FormatsToolResponses;

    public function __construct(private MarketingReportService $reports) {}

    public function name(): string
    {
        return 'marketing_metric_history';
    }

    public function description(): Stringable|string
    {
        return 'Track one metric across every report that recorded it, oldest first, with the change between each consecutive pair. A single report is a photograph: it cannot tell you whether followers are climbing from zero or sitting at it. A change is only reported as measured when both of its endpoints were observed; if either was estimated or unreachable, the tool returns a gap instead of a number, and you must not fill it in.';
    }

    public function handle(Request $request): Stringable|string
    {
        $key = $request->string('key')->toString();

        if ($key === '') {
            return $this->json([
                'error' => 'A metric key is required.',
                'headline_keys' => array_keys(MarketingReport::HEADLINE_METRICS),
            ]);
        }

        $history = $this->reports->history($key, $request->integer('limit') ?: 8);

        if ($history['count'] === 0) {
            return $this->json([
                ...$history,
                'message' => 'No report has recorded that key. That is an absence of measurement, not a zero.',
                'headline_keys' => array_keys(MarketingReport::HEADLINE_METRICS),
            ]);
        }

        return $this->json($history);
    }

    /**
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'key' => $schema->string()
                ->required()
                ->description('The metric key, exactly as reports record it, e.g. '.implode(', ', array_slice(array_keys(MarketingReport::HEADLINE_METRICS), 0, 3)).'.'),
            'limit' => $schema->integer()
                ->nullable()
                ->description('How many reports back to read. Defaults to 8.'),
        ];
    }
}
