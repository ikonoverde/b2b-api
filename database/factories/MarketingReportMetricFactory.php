<?php

namespace Database\Factories;

use App\Models\MarketingReport;
use App\Models\MarketingReportMetric;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MarketingReportMetric>
 */
class MarketingReportMetricFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'marketing_report_id' => MarketingReport::factory(),
            'key' => 'ga4.sessions',
            'provenance' => MarketingReportMetric::PROVENANCE_OBSERVED,
            'numeric_value' => fake()->numberBetween(0, 100),
            'text_value' => null,
            'note' => null,
        ];
    }

    public function estimated(): static
    {
        return $this->state(fn (array $attributes): array => [
            'provenance' => MarketingReportMetric::PROVENANCE_ESTIMATED,
        ]);
    }

    public function unknown(): static
    {
        return $this->state(fn (array $attributes): array => [
            'provenance' => MarketingReportMetric::PROVENANCE_UNKNOWN,
            'numeric_value' => null,
            'text_value' => 'unreachable',
        ]);
    }
}
