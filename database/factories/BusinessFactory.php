<?php

namespace Database\Factories;

use App\Models\BusinessScrapeRun;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Business>
 */
class BusinessFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = ['Spa', 'Massage therapist', 'Masajes', 'Spa and health club', 'Day spa'];

        return [
            'place_id' => 'ChIJ'.fake()->regexify('[A-Za-z0-9]{20}'),
            'name' => fake()->company().' Spa',
            'category_name' => fake()->randomElement($categories),
            'address' => fake()->address(),
            'neighborhood' => fake()->citySuffix(),
            'street' => fake()->streetAddress(),
            'city' => 'Mérida',
            'state' => 'Yucatán',
            'postal_code' => fake()->numerify('#####'),
            'country_code' => 'MX',
            'phone' => fake()->phoneNumber(),
            'website' => fake()->optional(0.7)->url(),
            'google_maps_url' => 'https://www.google.com/maps/place/?q=place_id:'.fake()->uuid(),
            'rating' => fake()->optional(0.9)->randomFloat(2, 2.0, 5.0),
            'reviews_count' => fake()->numberBetween(0, 500),
            'latitude' => fake()->latitude(20.9, 21.1),
            'longitude' => fake()->longitude(-89.7, -89.5),
            'image_url' => fake()->optional(0.8)->imageUrl(),
            'opening_hours' => null,
            'additional_info' => null,
            'is_claimed' => fake()->boolean(70),
            'is_advertisement' => false,
            'business_scrape_run_id' => BusinessScrapeRun::factory(),
        ];
    }
}
