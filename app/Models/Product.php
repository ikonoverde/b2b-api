<?php

namespace App\Models;

use App\Exceptions\InsufficientStockException;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'sku',
        'category_id',
        'formula_id',
        'description',
        'price',
        'cost',
        'stock',
        'min_stock',
        'is_active',
        'is_featured',
        'featured_order',
        'weight_kg',
        'width_cm',
        'height_cm',
        'depth_cm',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'cost' => 'decimal:2',
            'stock' => 'integer',
            'min_stock' => 'integer',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'weight_kg' => 'decimal:2',
            'width_cm' => 'decimal:2',
            'height_cm' => 'decimal:2',
            'depth_cm' => 'decimal:2',
        ];
    }

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (self $product): void {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
        });

        static::updating(function (self $product): void {
            if ($product->isDirty('name') && empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
        });
    }

    public function getStatusAttribute(): string
    {
        if (! $this->is_active) {
            return 'inactive';
        }

        if ($this->min_stock !== null && $this->stock <= $this->min_stock) {
            return 'low_stock';
        }

        return 'active';
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->images->first()?->image_url;
    }

    /**
     * @param  Builder<self>  $query
     * @param  int|array<int>  $categoryId
     * @return Builder<self>
     */
    public function scopeFilterByCategory(Builder $query, int|array $categoryId): Builder
    {
        return $query->whereIn('category_id', (array) $categoryId);
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeFilterByPriceRange(Builder $query, ?float $min = null, ?float $max = null): Builder
    {
        return $query
            ->when($min !== null, fn (Builder $q) => $q->where('price', '>=', $min))
            ->when($max !== null, fn (Builder $q) => $q->where('price', '<=', $max));
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeSearch(Builder $query, string $term): Builder
    {
        $like = '%'.str_replace(['%', '_'], ['\%', '\_'], $term).'%';

        return $query->where(function (Builder $q) use ($like) {
            $q->where('name', 'LIKE', $like)
                ->orWhere('description', 'LIKE', $like)
                ->orWhere('sku', 'LIKE', $like);
        });
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeSortBy(Builder $query, string $sort): Builder
    {
        return match ($sort) {
            'price_asc' => $query->orderBy('price'),
            'price_desc' => $query->orderBy('price', 'desc'),
            'name_asc' => $query->orderBy('name'),
            'name_desc' => $query->orderBy('name', 'desc'),
            'newest' => $query->orderBy('created_at', 'desc'),
            'oldest' => $query->orderBy('created_at'),
            default => $query,
        };
    }

    /**
     * Atomically decrement stock with pessimistic locking.
     *
     * @throws InsufficientStockException
     */
    public function decrementStock(int $quantity): void
    {
        $affected = self::query()
            ->where('id', $this->id)
            ->lockForUpdate()
            ->where('stock', '>=', $quantity)
            ->update(['stock' => DB::raw("stock - {$quantity}")]);

        if ($affected === 0) {
            throw new InsufficientStockException($this->id);
        }

        $this->refresh();
    }

    public function restoreStock(int $quantity): void
    {
        $this->increment('stock', $quantity);
    }

    /**
     * @return HasMany<OrderItem, $this>
     */
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * @return BelongsTo<Category, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * @return HasMany<PricingTier, $this>
     */
    public function pricingTiers(): HasMany
    {
        return $this->hasMany(PricingTier::class)->orderBy('min_qty');
    }

    /**
     * @return HasMany<ProductImage, $this>
     */
    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('position');
    }
}
