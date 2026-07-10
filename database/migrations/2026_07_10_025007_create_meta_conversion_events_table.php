<?php

use App\Models\Order;
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
        Schema::create('meta_conversion_events', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Order::class)->constrained()->cascadeOnDelete();
            $table->string('event_name');
            $table->string('event_id')->index();
            $table->string('status')->index();
            $table->unsignedSmallInteger('http_status')->nullable();
            $table->text('error_message')->nullable();
            $table->decimal('value', 10, 2)->nullable();
            $table->string('currency', 3)->nullable();
            $table->unsignedInteger('num_items')->nullable();
            $table->string('test_event_code')->nullable();
            $table->timestamp('sent_at');
            $table->timestamps();

            $table->index(['order_id', 'event_name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meta_conversion_events');
    }
};
