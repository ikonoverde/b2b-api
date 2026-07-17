<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * A free-text report an agent files: keyword research today, other kinds later. It is an artifact, so it
 * carries the growth task that produced it and shows up on that task's details page. `type` names the
 * kind for its badge; `body` is the report itself, in markdown.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('growth_task_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();
            $table->string('type')->index();
            $table->string('agent')->nullable();
            $table->string('title');
            $table->text('summary')->nullable();
            $table->longText('body');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
