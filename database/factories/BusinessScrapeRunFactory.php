<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BusinessScrapeRun>
 */
class BusinessScrapeRunFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'status' => 'pending',
            'search_terms' => 'spa, massage, masajes',
            'location' => 'Merida, Yucatan, Mexico',
            'started_at' => now(),
        ];
    }

    public function running(): static
    {
        return $this->state(fn () => [
            'outscraper_request_id' => fake()->uuid(),
            'status' => 'running',
            'started_at' => now(),
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn () => [
            'outscraper_request_id' => fake()->uuid(),
            'status' => 'completed',
            'total_found' => fake()->numberBetween(10, 50),
            'total_imported' => fake()->numberBetween(5, 30),
            'total_updated' => fake()->numberBetween(0, 10),
            'started_at' => now()->subMinutes(10),
            'completed_at' => now(),
        ]);
    }

    public function failed(): static
    {
        return $this->state(fn () => [
            'outscraper_request_id' => fake()->uuid(),
            'status' => 'failed',
            'error_message' => 'Outscraper request failed',
            'started_at' => now()->subMinutes(5),
            'completed_at' => now(),
        ]);
    }
}
