<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PricingTier>
 */
class PricingTierFactory extends Factory
{
    private array $labels = [
        'Mayorista',
        'Distribuidor',
        'Premium',
        'Especial',
        'Volumen',
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $minQty = fake()->numberBetween(1, 10);

        return [
            'product_id' => Product::factory(),
            'min_qty' => $minQty,
            'max_qty' => $minQty + fake()->numberBetween(5, 20),
            'price' => fake()->randomFloat(2, 10, 100),
            'discount' => fake()->randomFloat(2, 5, 30),
            'label' => fake()->randomElement($this->labels),
        ];
    }

    public function unlimited(): static
    {
        return $this->state(fn (array $attributes) => [
            'max_qty' => null,
        ]);
    }
}
