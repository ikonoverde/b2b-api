<?php

namespace Database\Factories;

use App\Models\GrowthAction;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<GrowthAction>
 */
class GrowthActionFactory extends Factory
{
    protected $model = GrowthAction::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = 'Build the pre-launch catalog content';

        return [
            'slug' => Str::slug($name).'-'.fake()->unique()->numberBetween(1, 100000),
            'name' => $name,
            'summary' => 'There is a catalog and no audience. Write the pages that will be there when one arrives.',
            'status' => GrowthAction::STATUS_OPEN,
        ];
    }

    public function done(): static
    {
        return $this->state(fn (): array => [
            'status' => GrowthAction::STATUS_DONE,
            'closed_at' => now(),
        ]);
    }

    public function dropped(): static
    {
        return $this->state(fn (): array => [
            'status' => GrowthAction::STATUS_DROPPED,
            'closed_at' => now(),
        ]);
    }
}
