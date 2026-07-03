<?php

use App\Ai\Agents\MarketingIdeasAgent;

it('carries the marketing ideas strategy rules', function () {
    $instructions = (string) (new MarketingIdeasAgent)->instructions();

    expect($instructions)
        ->toContain('139 proven marketing ideas')
        ->toContain('Suggest the 3-5 most relevant ideas')
        ->toContain('idea name, why it fits, how to start')
        ->toContain('public prices, no minimum order')
        ->toContain('recommend using AdsAgent for reporting and diagnosis');
});

it('maps conversation history into Laravel AI messages', function () {
    $messages = iterator_to_array(new MarketingIdeasAgent([
        ['role' => 'user', 'content' => 'Dame ideas de marketing'],
        ['role' => 'assistant', 'content' => 'Necesito etapa y presupuesto.'],
    ])->messages());

    expect($messages)->toHaveCount(2)
        ->and($messages[0]->content)->toBe('Dame ideas de marketing')
        ->and($messages[1]->content)->toBe('Necesito etapa y presupuesto.');
});
