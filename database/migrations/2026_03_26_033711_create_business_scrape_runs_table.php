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
        Schema::create('business_scrape_runs', function (Blueprint $table) {
            $table->id();
            $table->string('outscraper_request_id')->nullable()->index();
            $table->string('status')->default('pending');
            $table->string('search_terms');
            $table->string('location');
            $table->unsignedInteger('total_found')->default(0);
            $table->unsignedInteger('total_imported')->default(0);
            $table->unsignedInteger('total_updated')->default(0);
            $table->text('error_message')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_scrape_runs');
    }
};
