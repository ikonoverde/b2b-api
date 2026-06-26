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
            $table->string('client_ip_address', 45)->nullable()->after('shipping_address');
            $table->text('client_user_agent')->nullable()->after('client_ip_address');
            $table->string('meta_fbp')->nullable()->after('client_user_agent');
            $table->string('meta_fbc')->nullable()->after('meta_fbp');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'client_ip_address',
                'client_user_agent',
                'meta_fbp',
                'meta_fbc',
            ]);
        });
    }
};
