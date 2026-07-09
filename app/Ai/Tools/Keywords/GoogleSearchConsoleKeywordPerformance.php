<?php

namespace App\Ai\Tools\Keywords;

use App\Services\Seo\GoogleSearchConsoleService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;
use Stringable;

class GoogleSearchConsoleKeywordPerformance extends KeywordResearchTool
{
    public function __construct(protected GoogleSearchConsoleService $searchConsole) {}

    public function name(): string
    {
        return 'keywords_google_search_console_performance';
    }

    public function description(): Stringable|string
    {
        return 'Fetch Google Search Console query, page, impressions, clicks, CTR, and average position performance.';
    }

    public function handle(Request $request): Stringable|string
    {
        $missingConfig = $this->missingConfig();

        if ($missingConfig !== []) {
            return $this->json($this->configErrorPayload($missingConfig, $request->all()));
        }

        return $this->json($this->searchConsole->queryPerformance($request->all()));
    }

    /**
     * @return array<string, mixed>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            ...parent::schema($schema),
            'site_url' => $schema->string()
                ->nullable()
                ->description('Optional Search Console property URL, such as sc-domain:example.com or https://www.example.com/. Defaults to services.google_search_console.site_url.'),
            'dimensions' => $schema->array()
                ->nullable()
                ->description('Search Console dimensions. Allowed values: query, page, country, device, searchAppearance, date. Defaults to ["query", "page"].'),
            'page' => $schema->string()
                ->nullable()
                ->description('Optional page URL substring filter.'),
            'search_type' => $schema->string()
                ->nullable()
                ->description('Search type: web, image, video, news, discover, or google_news. Defaults to web.'),
            'offset' => $schema->integer()
                ->nullable()
                ->description('Zero-based row offset for pagination.'),
        ];
    }

    protected function providerKey(): string
    {
        return 'google_search_console';
    }

    protected function providerName(): string
    {
        return 'Google Search Console';
    }

    protected function requiredConfig(): array
    {
        return $this->searchConsole->requiredConfig();
    }

    /**
     * @return list<string>
     */
    protected function missingConfig(): array
    {
        return $this->searchConsole->missingConfig();
    }
}
