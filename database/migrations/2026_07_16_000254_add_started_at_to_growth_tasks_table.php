<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * When a person picked the task up. Null means nobody has: an open task with no started_at sits in
     * To Do on the board, and one with it sits in In Progress. It says nothing about completion — the
     * closure fields keep owning that claim.
     */
    public function up(): void
    {
        Schema::table('growth_tasks', function (Blueprint $table) {
            $table->timestamp('started_at')->nullable()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('growth_tasks', function (Blueprint $table) {
            $table->dropColumn('started_at');
        });
    }
};
