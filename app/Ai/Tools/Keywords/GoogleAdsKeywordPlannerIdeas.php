<?php

namespace App\Ai\Tools\Keywords;

use App\Services\Ads\GoogleAdsKeywordPlannerService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;
use Stringable;

class GoogleAdsKeywordPlannerIdeas extends KeywordResearchTool
{
    public function __construct(protected GoogleAdsKeywordPlannerService $keywordPlanner) {}

    public function name(): string
    {
        return 'keywords_google_ads_keyword_planner_ideas';
    }

    public function description(): Stringable|string
    {
        return 'Fetch Google Ads Keyword Planner keyword ideas, average monthly searches, CPC bid ranges, and competition.';
    }

    public function handle(Request $request): Stringable|string
    {
        $missingConfig = $this->missingConfig();

        if ($missingConfig !== []) {
            return $this->json($this->configErrorPayload($missingConfig, $request->all()));
        }

        return $this->json($this->keywordPlanner->keywordIdeas($request->all()));
    }

    /**
     * @return array<string, mixed>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            ...parent::schema($schema),
            'customer_id' => $schema->string()
                ->nullable()
                ->description('Optional Google Ads customer ID. Defaults to services.google_ads.customer_id.'),
            'geo_target_constant' => $schema->string()
                ->nullable()
                ->description('Optional Google Ads geo target resource name, such as geoTargetConstants/2484 for Mexico. Overrides country.'),
            'language_constant' => $schema->string()
                ->nullable()
                ->description('Optional Google Ads language resource name, such as languageConstants/1003 for Spanish. Overrides language.'),
        ];
    }

    protected function providerKey(): string
    {
        return 'google_ads_keyword_planner';
    }

    protected function providerName(): string
    {
        return 'Google Ads Keyword Planner';
    }

    protected function requiredConfig(): array
    {
        return $this->keywordPlanner->requiredConfig();
    }
}
