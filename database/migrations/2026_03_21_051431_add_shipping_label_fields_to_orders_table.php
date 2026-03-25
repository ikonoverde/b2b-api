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
        Schema::table('orders', function (Blueprint $table) {
            $table->string('label_url', 500)->nullable()->after('tracking_url');
            $table->string('skydropx_shipment_id')->nullable()->after('label_url');
            $table->string('shipping_quote_source', 20)->nullable()->after('skydropx_shipment_id');
            $table->json('parcel_dimensions')->nullable()->after('shipping_quote_source');
            $table->text('label_error')->nullable()->after('parcel_dimensions');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'label_url',
                'skydropx_shipment_id',
                'shipping_quote_source',
                'parcel_dimensions',
                'label_error',
            ]);
        });
    }
};
