<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BusinessScrapeRun extends Model
{
    /** @use HasFactory<\Database\Factories\BusinessScrapeRunFactory> */
    use HasFactory;

    protected $fillable = [
        'outscraper_request_id',
        'status',
        'search_terms',
        'location',
        'total_found',
        'total_imported',
        'total_updated',
        'error_message',
        'started_at',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'total_found' => 'integer',
            'total_imported' => 'integer',
            'total_updated' => 'integer',
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->whereIn('status', ['pending', 'running', 'collecting']);
    }

    /**
     * @return HasMany<Business, $this>
     */
    public function businesses(): HasMany
    {
        return $this->hasMany(Business::class);
    }

    public function markRunning(string $requestId): void
    {
        $this->update([
            'outscraper_request_id' => $requestId,
            'status' => 'running',
            'started_at' => now(),
        ]);
    }

    public function markCollecting(): void
    {
        $this->update(['status' => 'collecting']);
    }

    public function markCompleted(int $totalFound, int $totalImported, int $totalUpdated): void
    {
        $this->update([
            'status' => 'completed',
            'total_found' => $totalFound,
            'total_imported' => $totalImported,
            'total_updated' => $totalUpdated,
            'completed_at' => now(),
        ]);
    }

    public function markFailed(string $message): void
    {
        $this->update([
            'status' => 'failed',
            'error_message' => $message,
            'completed_at' => now(),
        ]);
    }
}
