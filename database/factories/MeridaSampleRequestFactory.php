<?php

namespace Database\Factories;

use App\Models\MeridaSampleRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MeridaSampleRequest>
 */
class MeridaSampleRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'business_name' => fake()->company(),
            'contact_name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->optional()->phoneNumber(),
            'business_type' => fake()->randomElement(['Terapeuta independiente', 'SPA (Day Spa)', 'Hotel Boutique']),
            'client_volume' => fake()->randomElement(['1-10 masajes/semana', '11-30 masajes/semana']),
            'social_url' => fake()->optional()->url(),
            'products_interested' => fake()->randomElements(['Aceites', 'Manteca', 'Exfoliante', 'Gel After Sun'], 2),
            'improvement_goals' => fake()->randomElements([
                'Mejor precio/rendimiento',
                'Ingredientes más naturales/veganos',
                'Aromas más duraderos',
                'Proveedor local más rápido',
            ], 2),
            'status' => 'pending',
            'ip_address' => fake()->ipv4(),
            'user_agent' => fake()->userAgent(),
        ];
    }
}
