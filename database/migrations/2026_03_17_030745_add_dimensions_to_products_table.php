<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->decimal('weight_kg', 8, 2)->nullable()->after('min_stock');
            $table->decimal('width_cm', 8, 2)->nullable()->after('weight_kg');
            $table->decimal('height_cm', 8, 2)->nullable()->after('width_cm');
            $table->decimal('depth_cm', 8, 2)->nullable()->after('height_cm');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['weight_kg', 'width_cm', 'height_cm', 'depth_cm']);
        });
    }
};
