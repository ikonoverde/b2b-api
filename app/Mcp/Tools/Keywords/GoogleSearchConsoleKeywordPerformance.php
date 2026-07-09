<?php

namespace App\Mcp\Tools\Keywords;

use App\Services\Seo\GoogleSearchConsoleService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Attributes\Title;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[Name('google-search-console-performance')]
#[Title('Google Search Console Keyword Performance')]
#[Description('Fetch Google Search Console query, page, impressions, clicks, CTR, and average position performance.')]
#[IsReadOnly]
class GoogleSearchConsoleKeywordPerformance extends KeywordResearchTool
{
    public function __construct(private GoogleSearchConsoleService $searchConsole) {}

    /**
     * @param  array<string, mixed>  $arguments
     * @return array<string, mixed>
     */
    protected function fetch(array $arguments): array
    {
        return $this->searchConsole->queryPerformance($arguments);
    }

    protected function providerName(): string
    {
        return 'Google Search Console';
    }

    /**
     * @return list<string>
     */
    protected function missingConfig(): array
    {
        return $this->searchConsole->missingConfig();
    }

    /**
     * @return array<string, array<int, string>>
     */
    protected function rules(): array
    {
        return [
            ...$this->commonRules(),
            'limit' => ['nullable', 'integer', 'min:1', 'max:25000'],
            'site_url' => ['nullable', 'string'],
            'dimensions' => ['nullable', 'array'],
            'dimensions.*' => ['string', 'in:query,page,country,device,searchAppearance,date'],
            'page' => ['nullable', 'string'],
            'search_type' => ['nullable', 'string', 'in:web,image,video,news,discover,google_news'],
            'offset' => ['nullable', 'integer', 'min:0'],
        ];
    }

    /**
     * @return array<string, Type>
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

    /**
     * @return array<string, Type>
     */
    public function outputSchema(JsonSchema $schema): array
    {
        return [
            'provider' => $schema->string()->description('Always google_search_console.')->required(),
            'site_url' => $schema->string()->description('Search Console property the rows came from.')->required(),
            'date_range' => $schema->object([
                'start_date' => $schema->string()->description('Inclusive start date.')->required(),
                'end_date' => $schema->string()->description('Inclusive end date.')->required(),
            ])->description('The date range the rows cover.')->required(),
            'dimensions' => $schema->array()->items($schema->string())->description('Dimensions the rows are grouped by. Each one appears as a key on every row.')->required(),
            'rows' => $schema->array()->items($schema->object([
                'query' => $schema->string()->nullable()->description('Search query, present when query is a requested dimension.'),
                'page' => $schema->string()->nullable()->description('Landing page URL, present when page is a requested dimension.'),
                'country' => $schema->string()->nullable()->description('Country code, present when country is a requested dimension.'),
                'device' => $schema->string()->nullable()->description('Device type, present when device is a requested dimension.'),
                'searchAppearance' => $schema->string()->nullable()->description('Search appearance type, present when searchAppearance is a requested dimension.'),
                'date' => $schema->string()->nullable()->description('Date, present when date is a requested dimension.'),
                'clicks' => $schema->number()->description('Clicks in the date range.')->required(),
                'impressions' => $schema->number()->description('Impressions in the date range.')->required(),
                'ctr' => $schema->number()->description('Click-through rate as a fraction, so 0.12 is 12 percent.')->required(),
                'position' => $schema->number()->description('Average position, where lower is better.')->required(),
            ]))->description('Performance rows ordered by clicks, descending.')->required(),
        ];
    }
}
