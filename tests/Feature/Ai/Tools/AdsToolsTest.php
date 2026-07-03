<?php

use App\Ai\Tools\GetMetaPostInsights;
use App\Ai\Tools\RunAnalyticsReport;
use App\Services\Ads\GoogleAnalyticsService;
use App\Services\Ads\MetaGraphService;
use Laravel\Ai\Tools\Request;

it('runs analytics reports through the analytics service', function () {
    $service = new class extends GoogleAnalyticsService
    {
        public array $arguments = [];

        public function runReport(array $arguments): array
        {
            $this->arguments = $arguments;

            return ['report' => ['rowCount' => 1]];
        }
    };

    $tool = new RunAnalyticsReport($service);
    $result = json_decode((string) $tool->handle(new Request([
        'property_id' => '123',
        'date_ranges' => [['start_date' => '30daysAgo', 'end_date' => 'yesterday']],
        'dimensions' => ['campaignName'],
        'metrics' => ['sessions'],
    ])), true);

    expect($service->arguments['property_id'])->toBe('123')
        ->and($result['report']['rowCount'])->toBe(1);
});

it('gets meta post insights through the meta service', function () {
    $service = new class extends MetaGraphService
    {
        public function postInsights(string $postId, array $metrics, ?string $period = null): array
        {
            return [
                'post_id' => $postId,
                'metrics' => $metrics,
                'period' => $period,
            ];
        }
    };

    $tool = new GetMetaPostInsights($service);
    $result = json_decode((string) $tool->handle(new Request([
        'post_id' => 'post-123',
        'metrics' => ['post_impressions', 'post_clicks'],
        'period' => 'lifetime',
    ])), true);

    expect($result['post_id'])->toBe('post-123')
        ->and($result['metrics'])->toBe(['post_impressions', 'post_clicks'])
        ->and($result['period'])->toBe('lifetime');
});
