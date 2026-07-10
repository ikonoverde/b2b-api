<?php

namespace Database\Factories;

use App\Models\MetaConversionEvent;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MetaConversionEvent>
 */
class MetaConversionEventFactory extends Factory
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
            'event_name' => 'Purchase',
            'event_id' => fake()->uuid(),
            'status' => MetaConversionEvent::STATUS_SENT,
            'http_status' => 200,
            'error_message' => null,
            'value' => fake()->randomFloat(2, 100, 5000),
            'currency' => 'MXN',
            'num_items' => fake()->numberBetween(1, 10),
            'test_event_code' => null,
            'sent_at' => now(),
        ];
    }

    public function rejected(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => MetaConversionEvent::STATUS_REJECTED,
            'http_status' => 400,
            'error_message' => 'Invalid parameter: custom_data[value]',
        ]);
    }

    public function failed(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => MetaConversionEvent::STATUS_FAILED,
            'http_status' => null,
            'error_message' => 'cURL error 28: Operation timed out',
        ]);
    }

    public function skippedMissingCredentials(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => MetaConversionEvent::STATUS_SKIPPED_MISSING_CREDENTIALS,
            'http_status' => null,
            'error_message' => null,
        ]);
    }

    public function testEvent(): static
    {
        return $this->state(fn (array $attributes): array => [
            'test_event_code' => 'TEST'.fake()->numberBetween(10000, 99999),
        ]);
    }
}
