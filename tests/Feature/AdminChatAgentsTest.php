<?php

use App\Ai\AdminChatAgents;
use App\Ai\Agents\BrandAgent;
use App\Ai\Agents\ContentAgent;
use App\Ai\Agents\SocialMediaAgent;

it('registers the brand, content, and social media agents for the admin chat', function () {
    $agents = AdminChatAgents::all();

    expect(AdminChatAgents::classFor('brand'))->toBe(BrandAgent::class)
        ->and(AdminChatAgents::classFor('content'))->toBe(ContentAgent::class)
        ->and(AdminChatAgents::classFor('social_media'))->toBe(SocialMediaAgent::class)
        ->and($agents['content']['name'])->toBe('ContentAgent')
        ->and($agents['social_media']['name'])->toBe('SocialMediaAgent')
        ->and($agents['brand']['name'])->toBe('BrandAgent');
});

it('validates the new agent keys', function (string $key) {
    $validator = validator(['agent' => $key], ['agent' => AdminChatAgents::validationRule()]);

    expect($validator->passes())->toBeTrue();
})->with(['brand', 'content', 'social_media']);

/**
 * The chat is where an admin meets these agents, and the welcome line is the only place they learn
 * what the agent can do to the outside world before they ask it to. It must not promise publishing.
 */
it('tells the admin up front that the social agent does not publish', function () {
    expect(AdminChatAgents::public('social_media')['welcome'])->toContain('No publico nada');
});

it('exposes every registered agent to the frontend without leaking its class', function () {
    $list = AdminChatAgents::publicList();

    expect($list)->toHaveKeys(['brand', 'content', 'social_media'])
        ->and($list['brand'])->not->toHaveKey('class');
});
