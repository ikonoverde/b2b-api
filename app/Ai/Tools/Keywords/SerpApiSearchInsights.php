<?php

namespace App\Ai\Tools\Keywords;

use App\Services\Seo\SerpApiSearchInsightsService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;
use Stringable;

class SerpApiSearchInsights extends KeywordResearchTool
{
    public function __construct(protected SerpApiSearchInsightsService $serpApi) {}

    public function name(): string
    {
        return 'keywords_serpapi_search_insights';
    }

    public function description(): Stringable|string
    {
        return 'Inspect live Google SERPs with SerpApi, including organic competitors, People Also Ask questions, related searches, SERP features, and search intent signals.';
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

        return $this->json($this->serpApi->searchInsights($request->all()));
    }

    /**
     * @return array<string, mixed>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            ...parent::schema($schema),
            'location' => $schema->string()
                ->nullable()
                ->description('Optional SerpApi location such as Mexico, Mexico City, Mexico, or Guadalajara, Jalisco, Mexico.'),
            'google_domain' => $schema->string()
                ->nullable()
                ->description('Optional Google domain such as google.com.mx. Defaults to google.com.mx for Mexico.'),
            'device' => $schema->string()
                ->nullable()
                ->description('Optional SerpApi device value: desktop, mobile, or tablet.'),
            'safe' => $schema->string()
                ->nullable()
                ->description('Optional safe search setting, such as active or off.'),
            'start' => $schema->integer()
                ->nullable()
                ->description('Optional zero-based organic result offset for pagination.'),
        ];
    }

    protected function providerKey(): string
    {
        return 'serpapi';
    }

    protected function providerName(): string
    {
        return 'SerpApi';
    }

    protected function requiredConfig(): array
    {
        return ['services.serpapi.api_key'];
    }
}
