<?php

namespace App\Mcp\Tools\Keywords;

use App\Services\Ads\GoogleAdsKeywordPlannerService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Attributes\Title;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[Name('google-ads-keyword-planner-ideas')]
#[Title('Google Ads Keyword Planner Ideas')]
#[Description('Fetch Google Ads Keyword Planner keyword ideas, average monthly searches, CPC bid ranges, and competition.')]
#[IsReadOnly]
class GoogleAdsKeywordPlannerIdeas extends KeywordResearchTool
{
    public function __construct(private GoogleAdsKeywordPlannerService $keywordPlanner) {}

    /**
     * @param  array<string, mixed>  $arguments
     * @return array<string, mixed>
     */
    protected function fetch(array $arguments): array
    {
        return $this->keywordPlanner->keywordIdeas($arguments);
    }

    protected function providerName(): string
    {
        return 'Google Ads Keyword Planner';
    }

    /**
     * @return list<string>
     */
    protected function missingConfig(): array
    {
        return $this->keywordPlanner->missingConfig();
    }

    /**
     * @return array<string, array<int, string>>
     */
    protected function rules(): array
    {
        return [
            ...$this->commonRules(),
            'limit' => ['nullable', 'integer', 'min:1', 'max:1000'],
            'customer_id' => ['nullable', 'string'],
            'geo_target_constant' => ['nullable', 'string'],
            'language_constant' => ['nullable', 'string'],
        ];
    }

    /**
     * @return array<string, Type>
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

    /**
     * @return array<string, Type>
     */
    public function outputSchema(JsonSchema $schema): array
    {
        return [
            'provider' => $schema->string()->description('Always google_ads_keyword_planner.')->required(),
            'customer_id' => $schema->string()->description('Google Ads customer ID the ideas were generated for.')->required(),
            'geo_target_constant' => $schema->string()->description('Geo target resource name applied to the request.')->required(),
            'language_constant' => $schema->string()->description('Language resource name applied to the request.')->required(),
            'keyword_plan_network' => $schema->string()->description('Keyword plan network the volumes are based on.')->required(),
            'seed_keywords' => $schema->array()->items($schema->string())->description('Seed keywords sent to Google Ads.')->required(),
            'rows' => $schema->array()->items($schema->object([
                'keyword' => $schema->string()->nullable()->description('Suggested keyword.'),
                'avg_monthly_searches' => $schema->integer()->nullable()->description('Average monthly search volume.'),
                'competition' => $schema->string()->nullable()->description('Competition band, such as LOW, MEDIUM, or HIGH.'),
                'competition_index' => $schema->integer()->nullable()->description('Competition index from 0 to 100.'),
                'low_top_of_page_bid_micros' => $schema->integer()->nullable()->description('Low top-of-page bid in micros, so 1000000 micros is one currency unit.'),
                'high_top_of_page_bid_micros' => $schema->integer()->nullable()->description('High top-of-page bid in micros, so 1000000 micros is one currency unit.'),
                'monthly_search_volumes' => $schema->array()->description('Per-month search volume breakdown as returned by Google Ads.'),
            ]))->description('Keyword ideas ordered as returned by Google Ads.')->required(),
        ];
    }
}
