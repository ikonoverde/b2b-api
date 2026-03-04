<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Banner>
 */
class BannerFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(3),
            'subtitle' => fake()->optional()->sentence(5),
            'image_path' => 'banners/'.fake()->uuid().'.jpg',
            'link_url' => fake()->optional()->url(),
            'link_text' => fake()->optional()->words(2, true),
            'display_order' => fake()->numberBetween(0, 10),
            'is_active' => true,
            'starts_at' => null,
            'ends_at' => null,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    public function scheduled(): static
    {
        return $this->state(fn (array $attributes) => [
            'starts_at' => now()->addDays(7),
            'ends_at' => now()->addDays(14),
        ]);
    }

    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'starts_at' => now()->subDays(14),
            'ends_at' => now()->subDays(1),
        ]);
    }
}
