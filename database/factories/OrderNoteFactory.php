<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\OrderNote;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OrderNote>
 */
class OrderNoteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'admin_id' => User::factory()->admin(),
            'content' => fake()->paragraph(),
        ];
    }
}
