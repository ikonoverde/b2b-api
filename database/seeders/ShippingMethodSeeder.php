<?php

namespace Database\Seeders;

use App\Models\ShippingMethod;
use Illuminate\Database\Seeder;

class ShippingMethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ShippingMethod::create([
            'name' => 'Standard',
            'description' => 'Standard shipping, delivered in 5-7 business days',
            'cost' => 10.00,
            'estimated_delivery_days' => 7,
            'is_active' => true,
        ]);

        ShippingMethod::create([
            'name' => 'Express',
            'description' => 'Express shipping, delivered in 2-3 business days',
            'cost' => 25.00,
            'estimated_delivery_days' => 3,
            'is_active' => true,
        ]);

        ShippingMethod::create([
            'name' => 'Next Day',
            'description' => 'Next day delivery, delivered in 1 business day',
            'cost' => 50.00,
            'estimated_delivery_days' => 1,
            'is_active' => true,
        ]);
    }
}
