<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Migrate legacy images to product_images table
        $products = DB::table('products')
            ->whereNotNull('image')
            ->whereNotExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('product_images')
                    ->whereColumn('product_images.product_id', 'products.id');
            })
            ->get(['id', 'image']);

        foreach ($products as $product) {
            DB::table('product_images')->insert([
                'product_id' => $product->id,
                'image_path' => $product->image,
                'position' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('image');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('image')->nullable()->after('is_featured');
        });
    }
};
