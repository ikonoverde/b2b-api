<?php

use App\Ai\Agents\MetaAgent;
use App\Ai\Tools\GetAnalyticsAccountSummaries;
use App\Ai\Tools\GetInstagramAccountInfo;
use App\Ai\Tools\GetInstagramPostComments;
use App\Ai\Tools\GetInstagramPostInsights;
use App\Ai\Tools\GetInstagramPosts;
use App\Ai\Tools\GetMetaDataset;
use App\Ai\Tools\GetMetaPageInfo;
use App\Ai\Tools\GetMetaPagePosts;
use App\Ai\Tools\GetMetaPostComments;
use App\Ai\Tools\GetMetaPostInsights;

it('carries Meta delegation and interpretation rules', function () {
    $instructions = (string) (new MetaAgent)->instructions();

    expect($instructions)
        ->toContain('safe delegation target for other agents and models')
        ->toContain('Facebook Page profile information, posts, post insights, and post comments')
        ->toContain('Do not create, edit, publish, delete, hide, unhide, reply to, DM, moderate')
        ->toContain('Always state the account, post, date range or retrieved window, metrics, filters, and caveats')
        ->toContain('Treat comments as qualitative evidence')
        ->toContain('Use precise Mexican Spanish');
});

it('exposes only Meta and Instagram read-only tools', function () {
    $tools = collect((new MetaAgent)->tools())->map(fn (object $tool): string => $tool::class);

    expect($tools->all())
        ->toContain(GetMetaPageInfo::class)
        ->toContain(GetMetaPagePosts::class)
        ->toContain(GetMetaPostInsights::class)
        ->toContain(GetMetaPostComments::class)
        ->toContain(GetInstagramAccountInfo::class)
        ->toContain(GetInstagramPosts::class)
        ->toContain(GetInstagramPostInsights::class)
        ->toContain(GetInstagramPostComments::class)
        ->toContain(GetMetaDataset::class)
        ->not->toContain(GetAnalyticsAccountSummaries::class);
});

it('warns that a dataset Purchase count is not a sales count', function () {
    // The dataset is polluted with developer traffic. An agent that reports its Purchase count as
    // revenue would be reporting a developer's checkout walk as a customer.
    expect((string) (new MetaAgent)->instructions())
        ->toContain('A Purchase count is not a sales count')
        ->toContain('test orders have not been ruled out')
        ->toContain('silently clamps an older window');
});

it('maps conversation history into Laravel AI messages', function () {
    $messages = iterator_to_array(new MetaAgent([
        ['role' => 'user', 'content' => 'Analiza Instagram'],
        ['role' => 'assistant', 'content' => 'Necesito cuenta o post.'],
    ])->messages());

    expect($messages)->toHaveCount(2)
        ->and($messages[0]->content)->toBe('Analiza Instagram')
        ->and($messages[1]->content)->toBe('Necesito cuenta o post.');
});
