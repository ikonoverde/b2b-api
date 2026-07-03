<?php

namespace App\Ai\Tools\Ads;

use App\Ai\Tools\Ads\Concerns\FormatsToolResponses;
use App\Services\Ads\GoogleAnalyticsService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Laravel\Ai\Contracts\Tool;

abstract class AnalyticsTool implements Tool
{
    use FormatsToolResponses;

    public function __construct(protected GoogleAnalyticsService $analytics) {}

    /**
     * @return array<string, Type>
     */
    protected function propertySchema(JsonSchema $schema): array
    {
        return [
            'property_id' => $schema->string()
                ->nullable()
                ->description('GA4 property ID. Accepts 123456789 or properties/123456789. Defaults to services.google_analytics.default_property_id.'),
        ];
    }

    /**
     * @return array<string, Type>
     */
    protected function reportSchema(JsonSchema $schema): array
    {
        return [
            ...$this->propertySchema($schema),
            'date_ranges' => $schema->array()
                ->description('Date ranges, for example [{"start_date":"30daysAgo","end_date":"yesterday"}].')
                ->required(),
            'dimensions' => $schema->array()
                ->description('Dimension API names, for example ["sessionDefaultChannelGroup", "campaignName"].')
                ->required(),
            'metrics' => $schema->array()
                ->description('Metric API names, for example ["sessions", "conversions", "totalRevenue"].')
                ->required(),
            'dimension_filter' => $schema->object()
                ->nullable()
                ->description('Optional GA Data API dimension filter expression. Snake_case and camelCase keys are both accepted.'),
            'metric_filter' => $schema->object()
                ->nullable()
                ->description('Optional GA Data API metric filter expression. Snake_case and camelCase keys are both accepted.'),
            'order_bys' => $schema->array()
                ->nullable()
                ->description('Optional GA Data API order by objects.'),
            'limit' => $schema->integer()
                ->nullable()
                ->description('Maximum rows to return.'),
            'offset' => $schema->integer()
                ->nullable()
                ->description('Pagination offset.'),
            'currency_code' => $schema->string()
                ->nullable()
                ->description('ISO 4217 currency code, such as MXN or USD.'),
            'return_property_quota' => $schema->boolean()
                ->nullable()
                ->description('Whether to include property quota in the response.'),
        ];
    }
}
