<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('marketing_reports', function (Blueprint $table) {
            $table->id();

            /**
             * reported_on is when the report was written. window_start/window_end are the period it
             * describes. The two diverge the moment anyone asks for last month's numbers.
             */
            $table->date('reported_on');
            $table->date('window_start')->nullable();
            $table->date('window_end')->nullable();
            $table->string('ga4_property_id')->nullable();

            $table->longText('body');

            $table->json('agents_run');
            $table->json('reachability');
            $table->json('compared_against')->nullable();

            /**
             * Headline values, denormalised so reports can be filtered and sorted without a join.
             *
             * Every one is nullable and none has a default. Null means the value was not observed:
             * an unreachable account, a tool that never loaded, a metric this report did not carry.
             * It does not mean zero. A zero here is a measurement — somebody looked, and there was
             * nothing there. Defaulting these to 0 would record a dead Graph API as an account with
             * no followers, and every delta computed against it afterwards would inherit that.
             *
             * MarketingReportService projects these from OBSERVED metrics only. Nothing else writes
             * them.
             */
            $table->unsignedInteger('ga4_sessions')->nullable();
            $table->unsignedInteger('ga4_total_users')->nullable();
            $table->unsignedInteger('ga4_page_views')->nullable();
            $table->unsignedInteger('ga4_purchase_events')->nullable();
            $table->unsignedInteger('meta_purchase_events')->nullable();
            $table->unsignedInteger('fb_fans')->nullable();
            $table->unsignedInteger('ig_followers')->nullable();

            /**
             * A rerun of the same day does not overwrite the first run: the two may have observed
             * different things, and the difference is the interesting part.
             */
            $table->timestamp('superseded_at')->nullable();
            $table->timestamps();

            $table->index(['reported_on', 'superseded_at']);
        });

        Schema::create('marketing_report_metrics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('marketing_report_id')->constrained()->cascadeOnDelete();

            $table->string('key');

            /**
             * The tag belongs to the value, not to the report. A single report holds an OBSERVED
             * session count and an ESTIMATED "nearly all of those sessions are internal" side by
             * side, and a delta is only OBSERVED when both of its endpoints are.
             */
            $table->string('provenance');

            $table->decimal('numeric_value', 15, 4)->nullable();
            $table->text('text_value')->nullable();
            $table->string('note')->nullable();

            $table->timestamps();

            $table->unique(['marketing_report_id', 'key']);
            $table->index('key');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('marketing_report_metrics');
        Schema::dropIfExists('marketing_reports');
    }
};
