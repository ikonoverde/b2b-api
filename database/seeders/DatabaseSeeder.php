<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $this->call(ShippingMethodSeeder::class);

        $categories = Category::factory(4)->create();

        Product::factory(10)->recycle($categories)->create();
        Product::factory(2)->recycle($categories)->inactive()->create();
        Product::factory(2)->recycle($categories)->lowStock()->create();
        Product::factory(1)->recycle($categories)->featured()->create();
        Product::factory(1)->recycle($categories)->outOfStock()->create();
    }
}
