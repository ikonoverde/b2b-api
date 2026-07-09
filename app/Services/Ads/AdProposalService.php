<?php

namespace App\Services\Ads;

use App\Models\AdProposal;

class AdProposalService
{
    /**
     * Validation rules shared by every ad proposal entry point.
     *
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
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
        ];
    }

    /**
     * Blank strings from an agent mean "not provided", so collapse them to null before validation.
     *
     * @param  array<string, mixed>  $arguments
     * @return array<string, mixed>
     */
    public function normalize(array $arguments): array
    {
        foreach (['name', 'objective', 'budget_period', 'currency', 'start_date', 'end_date', 'audience', 'geography', 'landing_page_url', 'offer', 'notes'] as $key) {
            if (array_key_exists($key, $arguments) && is_string($arguments[$key])) {
                $arguments[$key] = trim($arguments[$key]) === '' ? null : trim($arguments[$key]);
            }
        }

        return $arguments;
    }

    /**
     * @param  array<string, mixed>  $validated
     */
    public function create(string $platform, array $validated): AdProposal
    {
        return AdProposal::create([
            ...$validated,
            'platform' => $platform,
            'status' => 'draft',
            'currency' => strtoupper((string) ($validated['currency'] ?? 'MXN')),
            'created_by_agent' => true,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function payload(AdProposal $proposal, string $platformLabel): array
    {
        return [
            'proposal_id' => $proposal->id,
            'platform' => $proposal->platform,
            'status' => $proposal->status,
            'name' => $proposal->name,
            'objective' => $proposal->objective,
            'summary' => 'Draft '.$platformLabel.' ads proposal saved for later management. No external ad platform changes were made.',
        ];
    }

    public function description(string $platformLabel): string
    {
        return 'Create an internal draft '.$platformLabel.' ads proposal in the database. This does not publish, create, or modify campaigns in any ad platform.';
    }
}
