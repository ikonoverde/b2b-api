<?php

namespace App\Models;

use Database\Factories\AdProposalFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AdProposal extends Artifact
{
    /** @use HasFactory<AdProposalFactory> */
    use HasFactory;

    protected $fillable = [
        'growth_task_id',
        'platform',
        'name',
        'objective',
        'status',
        'budget_amount',
        'budget_period',
        'currency',
        'start_date',
        'end_date',
        'audience',
        'geography',
        'landing_page_url',
        'offer',
        'campaign_structure',
        'ad_groups',
        'creatives',
        'keywords',
        'negative_keywords',
        'tracking_plan',
        'success_metrics',
        'assumptions',
        'notes',
        'created_by_agent',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'budget_amount' => 'decimal:2',
            'start_date' => 'date',
            'end_date' => 'date',
            'campaign_structure' => 'array',
            'ad_groups' => 'array',
            'creatives' => 'array',
            'keywords' => 'array',
            'negative_keywords' => 'array',
            'tracking_plan' => 'array',
            'success_metrics' => 'array',
            'assumptions' => 'array',
            'created_by_agent' => 'boolean',
        ];
    }

    public function artifactLabel(): string
    {
        return 'Propuesta de anuncio';
    }

    public function artifactTitle(): string
    {
        return $this->name;
    }

    public function adminUrl(): ?string
    {
        return "/admin/ad-proposals/{$this->id}";
    }
}
