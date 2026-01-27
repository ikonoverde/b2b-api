<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    private array $categories = [
        'Fertilizantes',
        'Semillas',
        'Control plagas',
        'Bioestimulantes',
        'Contenedores',
        'Riego',
        'Herramientas',
        'Sustratos',
    ];

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
            'category' => fake()->randomElement($this->categories),
            'description' => fake()->optional()->paragraph(),
            'price' => fake()->randomFloat(2, 5, 500),
            'cost' => fake()->optional()->randomFloat(2, 1, 250),
            'stock' => fake()->numberBetween(0, 1000),
            'min_stock' => fake()->optional()->numberBetween(5, 50),
            'is_active' => true,
            'is_featured' => false,
            'image' => null,
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
        ]);
    }

    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock' => 0,
            'min_stock' => 10,
        ]);
    }
}
