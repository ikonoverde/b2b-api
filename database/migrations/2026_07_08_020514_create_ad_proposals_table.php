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
        Schema::create('ad_proposals', function (Blueprint $table) {
            $table->id();
            $table->string('platform', 20)->index();
            $table->string('name');
            $table->string('objective');
            $table->string('status', 30)->default('draft')->index();
            $table->decimal('budget_amount', 12, 2)->nullable();
            $table->string('budget_period', 30)->nullable();
            $table->char('currency', 3)->default('MXN');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->text('audience')->nullable();
            $table->text('geography')->nullable();
            $table->string('landing_page_url', 1000)->nullable();
            $table->text('offer')->nullable();
            $table->json('campaign_structure')->nullable();
            $table->json('ad_groups')->nullable();
            $table->json('creatives')->nullable();
            $table->json('keywords')->nullable();
            $table->json('negative_keywords')->nullable();
            $table->json('tracking_plan')->nullable();
            $table->json('success_metrics')->nullable();
            $table->json('assumptions')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('created_by_agent')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ad_proposals');
    }
};
