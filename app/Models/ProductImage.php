<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class ProductImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'image_path',
        'position',
    ];

    protected function casts(): array
    {
        return [
            'position' => 'integer',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function getImageUrlAttribute(): string
    {
        return Storage::disk('public')->url($this->image_path);
    }

    public function getThumbnailPath(): string
    {
        return 'products/thumb/'.basename($this->image_path);
    }

    public function getThumbnailUrlAttribute(): string
    {
        if ($this->is_optimized) {
            return Storage::disk('public')->url($this->getThumbnailPath());
        }

        return $this->image_url;
    }

    public function getIsOptimizedAttribute(): bool
    {
        return str_ends_with($this->image_path, '.webp');
    }
}
