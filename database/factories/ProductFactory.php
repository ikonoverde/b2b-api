<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'sku' => fake()->unique()->regexify('[A-Z]{3}-[0-9]{3}'),
            'category_id' => Category::factory(),
            'formula_id' => null,
            'description' => fake()->optional()->paragraph(),
            'price' => fake()->randomFloat(2, 5, 500),
            'cost' => fake()->optional()->randomFloat(2, 1, 250),
            'stock' => fake()->numberBetween(0, 1000),
            'min_stock' => fake()->optional()->numberBetween(5, 50),
            'is_active' => true,
            'is_featured' => false,
            'weight_kg' => fake()->optional(0.7)->randomFloat(2, 0.1, 50),
            'width_cm' => fake()->optional(0.7)->randomFloat(2, 1, 100),
            'height_cm' => fake()->optional(0.7)->randomFloat(2, 1, 100),
            'depth_cm' => fake()->optional(0.7)->randomFloat(2, 1, 100),
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    public function lowStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock' => 5,
            'min_stock' => 10,
        ]);
    }

    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
            'featured_order' => fake()->numberBetween(1, 20),
        ]);
    }

    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock' => 0,
            'min_stock' => 10,
        ]);
    }

    public function withDimensions(): static
    {
        return $this->state(fn (array $attributes) => [
            'weight_kg' => fake()->randomFloat(2, 0.1, 50),
            'width_cm' => fake()->randomFloat(2, 1, 100),
            'height_cm' => fake()->randomFloat(2, 1, 100),
            'depth_cm' => fake()->randomFloat(2, 1, 100),
        ]);
    }

    public function withFormula(int $formulaId = 1): static
    {
        return $this->state(fn (array $attributes) => [
            'formula_id' => $formulaId,
        ]);
    }
}
