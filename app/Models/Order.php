<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    /** @use HasFactory<\Database\Factories\OrderFactory> */
    use HasFactory;

    /** @var string[] */
    public const PENDING_STATUSES = ['payment_pending', 'pending', 'processing', 'shipped'];

    /** @var array<string, string[]> */
    public const ALLOWED_TRANSITIONS = [
        'payment_pending' => ['pending', 'processing', 'cancelled'],
        'pending' => ['processing', 'cancelled'],
        'processing' => ['shipped', 'cancelled'],
        'shipped' => ['delivered'],
        'delivered' => [],
        'cancelled' => [],
    ];

    protected $fillable = [
        'user_id',
        'status',
        'payment_status',
        'payment_intent_id',
        'checkout_session_id',
        'total_amount',
        'shipping_cost',
        'shipping_method_id',
        'shipping_address',
        'tracking_number',
        'shipping_carrier',
        'tracking_url',
        'refunded_amount',
    ];

    protected function casts(): array
    {
        return [
            'user_id' => 'integer',
            'shipping_method_id' => 'integer',
            'total_amount' => 'decimal:2',
            'shipping_cost' => 'decimal:2',
            'refunded_amount' => 'decimal:2',
            'shipping_address' => 'array',
        ];
    }

    public function canTransitionTo(string $newStatus): bool
    {
        $allowedStatuses = self::ALLOWED_TRANSITIONS[$this->status] ?? [];

        return in_array($newStatus, $allowedStatuses);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<ShippingMethod, $this>
     */
    public function shippingMethod(): BelongsTo
    {
        return $this->belongsTo(ShippingMethod::class);
    }

    /**
     * @return HasMany<OrderItem, $this>
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * @return HasMany<OrderStatusHistory, $this>
     */
    public function statusHistories(): HasMany
    {
        return $this->hasMany(OrderStatusHistory::class);
    }

    /**
     * @return HasMany<OrderNote, $this>
     */
    public function notes(): HasMany
    {
        return $this->hasMany(OrderNote::class);
    }
}
