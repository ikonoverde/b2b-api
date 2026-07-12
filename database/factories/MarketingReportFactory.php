<?php

namespace Database\Factories;

use App\Models\MarketingReport;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MarketingReport>
 */
class MarketingReportFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $reportedOn = fake()->dateTimeBetween('-60 days', 'now');

        return [
            'reported_on' => $reportedOn,
            'window_start' => (clone $reportedOn)->modify('-30 days'),
            'window_end' => $reportedOn,
            'ga4_property_id' => '540477820',
            'body' => "# Ikonoverde marketing baseline\n\nOBSERVED   ga4.sessions = 30\n",
            'agents_run' => ['google-analytics', 'meta'],
            'reachability' => ['ga4' => 'ok', 'meta_graph' => 'ok'],
            'compared_against' => [],
            'ga4_sessions' => fake()->numberBetween(0, 100),
            'ga4_total_users' => fake()->numberBetween(0, 50),
            'ga4_page_views' => fake()->numberBetween(0, 500),
            'ga4_purchase_events' => 0,
            'meta_purchase_events' => 0,
            'fb_fans' => fake()->numberBetween(0, 10),
            'ig_followers' => fake()->numberBetween(0, 10),
            'superseded_at' => null,
        ];
    }

    /**
     * An account nobody could reach. Every headline value it would have carried is null — not zero,
     * which is the whole point of the distinction.
     */
    public function metaUnreachable(): static
    {
        return $this->state(fn (array $attributes): array => [
            'reachability' => ['ga4' => 'ok', 'meta_graph' => 'unreachable'],
            'meta_purchase_events' => null,
            'fb_fans' => null,
            'ig_followers' => null,
        ]);
    }

    public function superseded(): static
    {
        return $this->state(fn (array $attributes): array => [
            'superseded_at' => now(),
        ]);
    }
}
