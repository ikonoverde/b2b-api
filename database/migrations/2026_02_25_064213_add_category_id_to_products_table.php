<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Create categories from existing product category strings
        $existingCategories = DB::table('products')
            ->select('category')
            ->distinct()
            ->whereNotNull('category')
            ->where('category', '!=', '')
            ->pluck('category');

        $now = now();
        foreach ($existingCategories as $categoryName) {
            DB::table('categories')->insert([
                'name' => $categoryName,
                'slug' => Str::slug($categoryName),
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        // Add category_id FK to products
        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable()->after('sku')->constrained();
        });

        // Populate category_id from existing category strings
        $categories = DB::table('categories')->pluck('id', 'name');
        foreach ($categories as $name => $id) {
            DB::table('products')
                ->where('category', $name)
                ->update(['category_id' => $id]);
        }

        // Drop old category string column and its index
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['category']);
            $table->dropColumn('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('category')->after('sku')->default('');
        });

        // Restore category strings from category_id
        $categories = DB::table('categories')->pluck('name', 'id');
        foreach ($categories as $id => $name) {
            DB::table('products')
                ->where('category_id', $id)
                ->update(['category' => $name]);
        }

        Schema::table('products', function (Blueprint $table) {
            $table->dropConstrainedForeignId('category_id');
            $table->index('category');
        });
    }
};
