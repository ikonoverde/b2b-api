<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
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
        $name = fake()->words(2, true);
        $slug = Str::slug($name).'-'.fake()->unique()->randomNumber(5);

        return [
            'name' => $name,
            'slug' => $slug,
            'description' => fake()->optional()->sentence(),
            'is_active' => true,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
