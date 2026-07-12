<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * A social post an agent proposed, and the record of what a human did about it.
     *
     * Meta has no draft state, no unpublish, and no undo, so the draft state lives here instead. The
     * only row that may claim a post is live is one holding an ID Meta itself returned: published_at
     * and remote_post_id are written together from a confirmed response, never from an intention. A
     * publish that failed leaves publish_error and no published_at; a draft nobody sent has neither.
     * "Never sent", "tried and failed", and "live" have to stay three distinguishable rows, because
     * the one thing you cannot do about a post that is already public is decide not to make it.
     */
    public function up(): void
    {
        Schema::create('social_post_drafts', function (Blueprint $table) {
            $table->id();
            $table->string('platform', 20)->index();
            $table->string('status', 20)->default('pending')->index();
            $table->text('caption');
            $table->string('image_path')->nullable();
            $table->string('link', 1000)->nullable();
            $table->text('rationale')->nullable();
            $table->text('brand_review')->nullable();
            $table->timestamp('proposed_for')->nullable();
            $table->boolean('created_by_agent')->default(true);

            $table->foreignId('reviewed_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->text('rejection_reason')->nullable();

            $table->timestamp('published_at')->nullable();
            $table->string('remote_post_id')->nullable();
            $table->string('remote_permalink', 1000)->nullable();
            $table->text('publish_error')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('social_post_drafts');
    }
};
