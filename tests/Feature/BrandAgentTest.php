<?php

use App\Ai\Agents\BrandAgent;
use App\Ai\Tools\Blog\CreateBlogPost;
use App\Ai\Tools\Blog\EditBlogPost;
use App\Ai\Tools\Blog\GetBlogPost;
use App\Ai\Tools\Blog\ListBlogPosts;
use App\Ai\Tools\Marketing\MarketingProductCatalog;
use App\Ai\Tools\Social\CreateSocialPostDraft;

it('carries the review contract and the claim bans', function () {
    $instructions = (string) (new BrandAgent)->instructions();

    expect($instructions)
        ->toContain('You review copy. You do not write it.')
        ->toContain('SHIP')
        ->toContain('FIX')
        ->toContain('BLOCK')
        ->toContain('Distinguish a defect from a preference')
        ->toContain('Therapeutic or medical claims')
        ->toContain('Prices belong on the product page')
        ->toContain('compra desde una unidad');
});

/**
 * The reviewer's only job is to refuse things. Give it a tool that writes and its refusals become
 * negotiable, because it can always just fix the copy itself and ship.
 */
it('holds no tool that can write anything', function () {
    $tools = collect((new BrandAgent)->tools())->map(fn (object $tool): string => $tool::class);

    expect($tools->all())
        ->toContain(MarketingProductCatalog::class)
        ->toContain(ListBlogPosts::class)
        ->toContain(GetBlogPost::class)
        ->not->toContain(CreateBlogPost::class)
        ->not->toContain(EditBlogPost::class)
        ->not->toContain(CreateSocialPostDraft::class);
});

it('will not approve copy it could not check', function () {
    expect((string) (new BrandAgent)->instructions())
        ->toContain('you must say that rather than approving copy you were unable to check');
});
