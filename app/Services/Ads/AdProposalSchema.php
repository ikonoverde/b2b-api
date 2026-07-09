<?php

namespace App\Services\Ads;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;

class AdProposalSchema
{
    /**
     * Input fields shared by the AI and MCP ad proposal tools.
     *
     * @return array<string, Type>
     */
    public static function fields(JsonSchema $schema): array
    {
        return [
            'name' => $schema->string()
                ->description('Internal proposal name or campaign concept name.')
                ->required(),
            'objective' => $schema->string()
                ->description('Campaign goal, such as awareness, traffic, leads, sales, retargeting, or retention.')
                ->required(),
            'budget_amount' => $schema->number()
                ->nullable()
                ->description('Proposed budget amount in the given currency.'),
            'budget_period' => $schema->string()
                ->nullable()
                ->enum(['daily', 'weekly', 'monthly', 'campaign'])
                ->description('Budget pacing period.'),
            'currency' => $schema->string()
                ->nullable()
                ->description('ISO 4217 currency code. Defaults to MXN.'),
            'start_date' => $schema->string()
                ->nullable()
                ->description('Optional proposed start date in YYYY-MM-DD format.'),
            'end_date' => $schema->string()
                ->nullable()
                ->description('Optional proposed end date in YYYY-MM-DD format.'),
            'audience' => $schema->string()
                ->nullable()
                ->description('Target audience, exclusions, and key segments.'),
            'geography' => $schema->string()
                ->nullable()
                ->description('Target geography.'),
            'landing_page_url' => $schema->string()
                ->nullable()
                ->description('Landing page URL.'),
            'offer' => $schema->string()
                ->nullable()
                ->description('Product, offer, bundle, discount, or value proposition.'),
            'campaign_structure' => $schema->object()
                ->nullable()
                ->description('Structured campaign plan, including campaigns, ad sets, placements, bidding, or match types.'),
            'ad_groups' => $schema->array()
                ->nullable()
                ->description('Ad sets, ad groups, or themed campaign sections.'),
            'creatives' => $schema->array()
                ->nullable()
                ->description('Ad creative concepts, hooks, headlines, primary text, descriptions, CTAs, and image/video notes.'),
            'keywords' => $schema->array()
                ->nullable()
                ->description('Google Ads keywords or search themes when relevant.'),
            'negative_keywords' => $schema->array()
                ->nullable()
                ->description('Google Ads negative keywords when relevant.'),
            'tracking_plan' => $schema->object()
                ->nullable()
                ->description('Conversion events, UTMs, pixels, CAPI, GA4, and validation plan.'),
            'success_metrics' => $schema->object()
                ->nullable()
                ->description('Target CPA, ROAS, CAC, CTR, CVR, revenue, or other success metrics.'),
            'assumptions' => $schema->array()
                ->nullable()
                ->description('Assumptions, unknowns, and dependencies behind the proposal.'),
            'notes' => $schema->string()
                ->nullable()
                ->description('Additional internal notes.'),
        ];
    }
}
