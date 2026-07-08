<?php

namespace Database\Factories;

use App\Models\AdProposal;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AdProposal>
 */
class AdProposalFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'platform' => $this->faker->randomElement(['meta', 'google']),
            'name' => $this->faker->sentence(3),
            'objective' => $this->faker->randomElement(['traffic', 'leads', 'sales']),
            'status' => 'draft',
            'budget_amount' => $this->faker->randomFloat(2, 1000, 50000),
            'budget_period' => 'monthly',
            'currency' => 'MXN',
            'audience' => $this->faker->sentence(),
            'geography' => 'Mexico',
            'landing_page_url' => $this->faker->url(),
            'offer' => $this->faker->sentence(),
            'campaign_structure' => ['campaigns' => []],
            'ad_groups' => [],
            'creatives' => [],
            'keywords' => [],
            'negative_keywords' => [],
            'tracking_plan' => [],
            'success_metrics' => [],
            'assumptions' => [],
            'notes' => $this->faker->sentence(),
            'created_by_agent' => true,
        ];
    }
}
