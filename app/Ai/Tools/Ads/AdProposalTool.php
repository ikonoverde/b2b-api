<?php

namespace App\Ai\Tools\Ads;

use App\Ai\Tools\Ads\Concerns\FormatsToolResponses;
use App\Models\AdProposal;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Support\Facades\Validator;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

abstract class AdProposalTool implements Tool
{
    use FormatsToolResponses;

    abstract protected function platform(): string;

    abstract protected function platformLabel(): string;

    public function description(): Stringable|string
    {
        return 'Create an internal draft '.$this->platformLabel().' ads proposal in the database. This does not publish, create, or modify campaigns in any ad platform.';
    }

    public function handle(Request $request): Stringable|string
    {
        $validator = Validator::make($this->normalizeArguments($request->all()), [
            'name' => ['required', 'string', 'max:255'],
            'objective' => ['required', 'string', 'max:255'],
            'budget_amount' => ['nullable', 'numeric', 'min:0'],
            'budget_period' => ['nullable', 'string', 'in:daily,weekly,monthly,campaign'],
            'currency' => ['nullable', 'string', 'size:3'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'audience' => ['nullable', 'string'],
            'geography' => ['nullable', 'string'],
            'landing_page_url' => ['nullable', 'url', 'max:1000'],
            'offer' => ['nullable', 'string'],
            'campaign_structure' => ['nullable', 'array'],
            'ad_groups' => ['nullable', 'array'],
            'creatives' => ['nullable', 'array'],
            'keywords' => ['nullable', 'array'],
            'negative_keywords' => ['nullable', 'array'],
            'tracking_plan' => ['nullable', 'array'],
            'success_metrics' => ['nullable', 'array'],
            'assumptions' => ['nullable', 'array'],
            'notes' => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return $this->json([
                'error' => $validator->errors()->first(),
            ]);
        }

        /** @var array<string, mixed> $validated */
        $validated = $validator->validated();

        $proposal = AdProposal::create([
            ...$validated,
            'platform' => $this->platform(),
            'status' => 'draft',
            'currency' => strtoupper((string) ($validated['currency'] ?? 'MXN')),
            'created_by_agent' => true,
        ]);

        return $this->json([
            'proposal_id' => $proposal->id,
            'platform' => $proposal->platform,
            'status' => $proposal->status,
            'name' => $proposal->name,
            'objective' => $proposal->objective,
            'summary' => 'Draft '.$this->platformLabel().' ads proposal saved for later management. No external ad platform changes were made.',
        ]);
    }

    public function schema(JsonSchema $schema): array
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

    /**
     * @param  array<string, mixed>  $arguments
     * @return array<string, mixed>
     */
    private function normalizeArguments(array $arguments): array
    {
        foreach (['name', 'objective', 'budget_period', 'currency', 'start_date', 'end_date', 'audience', 'geography', 'landing_page_url', 'offer', 'notes'] as $key) {
            if (array_key_exists($key, $arguments) && is_string($arguments[$key])) {
                $arguments[$key] = trim($arguments[$key]) === '' ? null : trim($arguments[$key]);
            }
        }

        return $arguments;
    }
}
