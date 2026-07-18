<?php

use App\Ai\Agents\IkonoverdeContext;
use App\Ai\Agents\PaidAcquisitionAgent;
use App\Ai\Tools\Ads\CreateGoogleAdProposal;
use App\Ai\Tools\Ads\CreateMetaAdProposal;
use App\Ai\Tools\Analytics\GetAnalyticsAccountSummaries;
use App\Ai\Tools\Analytics\GetAnalyticsPropertyDetails;
use App\Ai\Tools\Analytics\GetCustomDimensionsAndMetrics;
use App\Ai\Tools\Analytics\ListAnalyticsPropertyAnnotations;
use App\Ai\Tools\Analytics\ListGoogleAdsLinks;
use App\Ai\Tools\Analytics\RunAnalyticsConversionsReport;
use App\Ai\Tools\Analytics\RunAnalyticsFunnelReport;
use App\Ai\Tools\Analytics\RunAnalyticsRealtimeReport;
use App\Ai\Tools\Analytics\RunAnalyticsReport;
use App\Ai\Tools\Images\GenerateImage;
use App\Ai\Tools\Meta\GetInstagramAccountInfo;
use App\Ai\Tools\Meta\GetInstagramPostComments;
use App\Ai\Tools\Meta\GetInstagramPostInsights;
use App\Ai\Tools\Meta\GetInstagramPosts;
use App\Ai\Tools\Meta\GetMetaPageInfo;
use App\Ai\Tools\Meta\GetMetaPagePosts;
use App\Ai\Tools\Meta\GetMetaPostComments;
use App\Ai\Tools\Meta\GetMetaPostInsights;
use Laravel\Ai\Contracts\HasTools;

it('exposes reporting and creative ads tools', function () {
    $toolNames = collect((new PaidAcquisitionAgent)->tools())
        ->flatMap(function (object $tool): array {
            if ($tool instanceof HasTools) {
                return collect($tool->tools())
                    ->map(fn (object $nestedTool): string => $nestedTool::class)
                    ->all();
            }

            return [$tool::class];
        })
        ->all();

    expect($toolNames)->toContain(
        GetAnalyticsAccountSummaries::class,
        GetAnalyticsPropertyDetails::class,
        ListGoogleAdsLinks::class,
        GetCustomDimensionsAndMetrics::class,
        RunAnalyticsReport::class,
        RunAnalyticsConversionsReport::class,
        RunAnalyticsFunnelReport::class,
        RunAnalyticsRealtimeReport::class,
        ListAnalyticsPropertyAnnotations::class,
        GetMetaPageInfo::class,
        GetMetaPagePosts::class,
        GetMetaPostInsights::class,
        GetMetaPostComments::class,
        GetInstagramAccountInfo::class,
        GetInstagramPosts::class,
        GetInstagramPostInsights::class,
        GetInstagramPostComments::class,
        CreateMetaAdProposal::class,
        CreateGoogleAdProposal::class,
        GenerateImage::class,
    );

    expect($toolNames)->not->toContain(
        'App\Ai\Tools\DeleteMetaPost',
        'App\Ai\Tools\HideMetaComment',
        'App\Ai\Tools\ReplyToMetaComment',
        'App\Ai\Tools\SendMetaDirectMessage',
        'App\Ai\Tools\PostToFacebook',
        'App\Ai\Tools\PostImageToInstagram',
    );
});

it('carries the paid ads and Ikonoverde operating rules', function () {
    $instructions = (string) (new PaidAcquisitionAgent)->instructions();

    expect($instructions)
        ->toContain('Do not create, edit, pause, publish, delete, hide, unhide, reply to, DM, moderate')
        ->toContain('paid acquisition specialist')
        ->toContain('recommend GrowthStrategyAgent')
        ->toContain('internal draft ad proposal creation')
        ->toContain('plus image generation')
        ->toContain('Create proposals only as internal drafts')
        ->toContain(IkonoverdeContext::prompt())
        ->toContain('brand-new company/project')
        ->toContain('Core messages: uso profesional')
        ->toContain('Use precise Mexican Spanish');
});

it('maps conversation history into Laravel AI messages', function () {
    $messages = iterator_to_array(new PaidAcquisitionAgent([
        ['role' => 'user', 'content' => 'Analiza Meta Ads'],
        ['role' => 'assistant', 'content' => 'Necesito el periodo.'],
    ])->messages());

    expect($messages)->toHaveCount(2)
        ->and($messages[0]->content)->toBe('Analiza Meta Ads')
        ->and($messages[1]->content)->toBe('Necesito el periodo.');
});
