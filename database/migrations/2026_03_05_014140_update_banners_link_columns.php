<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('banners', function (Blueprint $table) {
            $table->string('link_type')->nullable()->after('image_path');
            $table->string('link_value')->nullable()->after('link_type');
            $table->dropColumn('link_url');
        });
    }

    public function down(): void
    {
        Schema::table('banners', function (Blueprint $table) {
            $table->string('link_url')->nullable()->after('image_path');
            $table->dropColumn(['link_type', 'link_value']);
        });
    }
};
