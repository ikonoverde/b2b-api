<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Links every artifact an agent can generate back to the growth task that produced it. Nullable because
 * most artifacts are still created by hand, outside any task run.
 */
return new class extends Migration
{
    /**
     * @var list<string>
     */
    private array $tables = [
        'ad_proposals',
        'blog_posts',
        'social_post_drafts',
        'banners',
        'static_pages',
    ];

    public function up(): void
    {
        foreach ($this->tables as $table) {
            Schema::table($table, function (Blueprint $table): void {
                $table->foreignId('growth_task_id')
                    ->nullable()
                    ->after('id')
                    ->constrained()
                    ->nullOnDelete();
            });
        }
    }

    public function down(): void
    {
        foreach ($this->tables as $table) {
            Schema::table($table, function (Blueprint $table): void {
                $table->dropConstrainedForeignId('growth_task_id');
            });
        }
    }
};
