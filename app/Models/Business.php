<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Business extends Model
{
    /** @use HasFactory<\Database\Factories\BusinessFactory> */
    use HasFactory;

    protected $fillable = [
        'place_id',
        'name',
        'category_name',
        'address',
        'neighborhood',
        'street',
        'city',
        'state',
        'postal_code',
        'country_code',
        'phone',
        'website',
        'google_maps_url',
        'rating',
        'reviews_count',
        'latitude',
        'longitude',
        'image_url',
        'opening_hours',
        'additional_info',
        'is_claimed',
        'is_advertisement',
        'business_scrape_run_id',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'decimal:2',
            'reviews_count' => 'integer',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'opening_hours' => 'array',
            'additional_info' => 'array',
            'is_claimed' => 'boolean',
            'is_advertisement' => 'boolean',
            'business_scrape_run_id' => 'integer',
        ];
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeSearch(Builder $query, string $term): Builder
    {
        return $query->where(function (Builder $q) use ($term) {
            $q->where('name', 'like', "%{$term}%")
                ->orWhere('category_name', 'like', "%{$term}%")
                ->orWhere('address', 'like', "%{$term}%");
        });
    }

    /**
     * @return BelongsTo<BusinessScrapeRun, $this>
     */
    public function scrapeRun(): BelongsTo
    {
        return $this->belongsTo(BusinessScrapeRun::class, 'business_scrape_run_id');
    }
}
