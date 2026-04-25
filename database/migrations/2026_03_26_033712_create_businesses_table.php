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
        Schema::create('businesses', function (Blueprint $table) {
            $table->id();
            $table->string('place_id')->unique();
            $table->string('name');
            $table->string('category_name')->nullable();
            $table->text('address')->nullable();
            $table->string('neighborhood')->nullable();
            $table->string('street')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('country_code', 2)->nullable();
            $table->string('phone')->nullable();
            $table->string('website')->nullable();
            $table->string('google_maps_url')->nullable();
            $table->decimal('rating', 3, 2)->nullable();
            $table->unsignedInteger('reviews_count')->default(0);
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('image_url')->nullable();
            $table->json('opening_hours')->nullable();
            $table->json('additional_info')->nullable();
            $table->boolean('is_claimed')->default(false);
            $table->boolean('is_advertisement')->default(false);
            $table->foreignId('business_scrape_run_id')
                ->nullable()
                ->constrained()
                ->onDelete('set null');
            $table->timestamps();

            $table->index('category_name');
            $table->index('city');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('businesses');
    }
};
