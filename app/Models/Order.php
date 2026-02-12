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

    protected $fillable = [
        'user_id',
        'status',
        'payment_status',
        'payment_intent_id',
        'total_amount',
        'shipping_cost',
        'shipping_address',
    ];

    protected function casts(): array
    {
        return [
            'user_id' => 'integer',
            'total_amount' => 'decimal:2',
            'shipping_cost' => 'decimal:2',
            'shipping_address' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
