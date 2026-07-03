<?php

use App\Ai\Agents\AdsAgent;
use Laravel\Ai\Contracts\Tool;

it('exposes only read and reporting ads tools', function () {
    $toolNames = collect((new AdsAgent)->tools())
        ->map(fn (Tool $tool): string => $tool->name())
        ->all();

    expect($toolNames)->toContain(
        'analytics_get_account_summaries',
        'analytics_get_property_details',
        'analytics_list_google_ads_links',
        'analytics_get_custom_dimensions_and_metrics',
        'analytics_run_report',
        'analytics_run_conversions_report',
        'analytics_run_funnel_report',
        'analytics_run_realtime_report',
        'analytics_list_property_annotations',
        'meta_get_page_info',
        'meta_get_page_posts',
        'meta_get_post_insights',
        'meta_get_post_comments',
        'meta_get_instagram_account_info',
        'meta_get_instagram_posts',
        'meta_get_instagram_post_insights',
        'meta_get_instagram_post_comments',
    );

    expect($toolNames)->not->toContain(
        'meta_delete_post',
        'meta_hide_comment',
        'meta_reply_to_comment',
        'meta_send_dm_to_user',
        'meta_post_to_facebook',
        'meta_post_image_to_instagram',
    );
});

it('carries the paid ads and Ikonoverde operating rules', function () {
    $instructions = (string) (new AdsAgent)->instructions();

    expect($instructions)
        ->toContain('Do not create, edit, pause, publish, delete, hide, unhide, reply to, DM, moderate')
        ->toContain('public prices, no minimum order')
        ->toContain('Use precise Mexican Spanish');
});

it('maps conversation history into Laravel AI messages', function () {
    $messages = iterator_to_array(new AdsAgent([
        ['role' => 'user', 'content' => 'Analiza Meta Ads'],
        ['role' => 'assistant', 'content' => 'Necesito el periodo.'],
    ])->messages());

    expect($messages)->toHaveCount(2)
        ->and($messages[0]->content)->toBe('Analiza Meta Ads')
        ->and($messages[1]->content)->toBe('Necesito el periodo.');
});
