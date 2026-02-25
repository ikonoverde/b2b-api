<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Address>
 */
class AddressFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'label' => fake()->randomElement(['Oficina', 'Bodega', 'Casa']),
            'name' => fake()->name(),
            'address_line_1' => fake()->streetAddress(),
            'address_line_2' => null,
            'city' => fake()->city(),
            'state' => fake()->stateAbbr(),
            'postal_code' => fake()->postcode(),
            'phone' => fake()->phoneNumber(),
            'is_default' => false,
            'country' => 'MX',
        ];
    }

    public function asDefault(): static
    {
        return $this->state(['is_default' => true]);
    }
}
