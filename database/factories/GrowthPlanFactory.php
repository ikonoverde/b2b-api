<?php

namespace Database\Factories;

use App\Models\GrowthPlan;
use App\Models\MarketingReport;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<GrowthPlan>
 */
class GrowthPlanFactory extends Factory
{
    protected $model = GrowthPlan::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'planned_on' => now()->toDateString(),
            'marketing_report_id' => MarketingReport::factory(),
            'body' => "# Plan\n\nESTIMATED  Write the catalog pages before spending anything.\n",
            'paid_gate' => GrowthPlan::PAID_GATE_CLOSED,
            'paid_gate_reason' => 'The store has not launched. There is nothing for a click to buy.',
            'paid_gate_preconditions' => ['Checkout completes an order end to end.'],
        ];
    }

    public function paidGateOpen(): static
    {
        return $this->state(fn (): array => [
            'paid_gate' => GrowthPlan::PAID_GATE_OPEN,
            'paid_gate_reason' => 'Checkout works and the catalog is populated.',
            'paid_gate_preconditions' => ['Cap the first test at a budget the team can lose.'],
        ]);
    }
}
