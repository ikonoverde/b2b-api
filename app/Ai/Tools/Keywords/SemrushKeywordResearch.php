<?php

namespace App\Ai\Tools\Keywords;

use App\Services\Seo\SemrushKeywordResearchService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;
use Stringable;

class SemrushKeywordResearch extends KeywordResearchTool
{
    public function __construct(protected SemrushKeywordResearchService $semrush) {}

    public function name(): string
    {
        return 'keywords_semrush_keyword_research';
    }

    public function description(): Stringable|string
    {
        return 'Fetch Semrush keyword metrics (search volume, CPC, difficulty, intents, SERP features, trends) and organic domain keyword rankings for keyword gap, competitor, and content opportunity analysis.';
    }

    public function handle(Request $request): Stringable|string
    {
        $missingConfig = $this->missingConfig();

        if ($missingConfig !== []) {
            return $this->json([
                'error' => true,
                'provider' => $this->providerKey(),
                'message' => $this->providerName().' API is not configured.',
                'required_config' => $missingConfig,
                'received_arguments' => $request->all(),
            ]);
        }

        return $this->json($this->semrush->research($request->all()));
    }

    /**
     * @return array<string, mixed>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            ...parent::schema($schema),
            'database' => $schema->string()
                ->nullable()
                ->description('Optional Semrush regional database code such as mx, us, or es. Defaults to the MX database for Ikonoverde.'),
            'month' => $schema->string()
                ->nullable()
                ->description('Optional YYYY-MM month snapshot for keyword metrics. Defaults to the current month.'),
            'offset' => $schema->integer()
                ->nullable()
                ->description('Optional row offset for paginating the domain organic keyword report.'),
            'display_sort' => $schema->string()
                ->nullable()
                ->description('Optional Semrush display_sort code such as tr_desc, po_asc, nq_desc, or kd_desc.'),
        ];
    }

    protected function providerKey(): string
    {
        return 'semrush';
    }

    protected function providerName(): string
    {
        return 'Semrush';
    }

    protected function requiredConfig(): array
    {
        return ['services.semrush.api_key'];
    }

    /**
     * @return list<string>
     */
    private function missingConfig(): array
    {
        return collect($this->requiredConfig())
            ->filter(fn (string $key): bool => blank(config($key)))
            ->values()
            ->all();
    }
}
