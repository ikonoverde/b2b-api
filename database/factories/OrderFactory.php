<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'status' => 'pending',
            'payment_status' => 'pending',
            'payment_intent_id' => null,
            'checkout_session_id' => null,
            'total_amount' => fake()->randomFloat(2, 10, 500),
            'shipping_cost' => 10.00,
            'shipping_method_id' => null,
            'shipping_address' => [
                'street' => fake()->streetAddress(),
                'city' => fake()->city(),
                'state' => fake()->stateAbbr(),
                'zip' => fake()->postcode(),
                'country' => 'USA',
            ],
            'tracking_number' => null,
            'shipping_carrier' => null,
            'refunded_amount' => 0,
        ];
    }

    public function processing(): static
    {
        return $this->state(fn () => [
            'status' => 'processing',
            'payment_status' => 'completed',
            'payment_intent_id' => 'pi_'.fake()->uuid(),
        ]);
    }

    public function shipped(): static
    {
        return $this->state(fn () => [
            'status' => 'shipped',
            'payment_status' => 'completed',
            'payment_intent_id' => 'pi_'.fake()->uuid(),
            'tracking_number' => fake()->numerify('##########'),
            'shipping_carrier' => fake()->randomElement(['DHL', 'FedEx', 'Estafeta']),
        ]);
    }

    public function delivered(): static
    {
        return $this->state(fn () => [
            'status' => 'delivered',
            'payment_status' => 'completed',
            'payment_intent_id' => 'pi_'.fake()->uuid(),
            'tracking_number' => fake()->numerify('##########'),
            'shipping_carrier' => fake()->randomElement(['DHL', 'FedEx', 'Estafeta']),
        ]);
    }

    public function cancelled(): static
    {
        return $this->state(fn () => [
            'status' => 'cancelled',
            'payment_status' => 'failed',
        ]);
    }

    public function withPaymentIntent(): static
    {
        return $this->state(fn () => [
            'payment_status' => 'completed',
            'payment_intent_id' => 'pi_'.fake()->uuid(),
        ]);
    }
}
