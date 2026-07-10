<?php

namespace App\Models;

use Database\Factories\MetaConversionEventFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MetaConversionEvent extends Model
{
    /** @use HasFactory<MetaConversionEventFactory> */
    use HasFactory;

    /**
     * The request reached Meta and Meta accepted it.
     */
    public const STATUS_SENT = 'sent';

    /**
     * The request reached Meta and Meta refused the payload.
     */
    public const STATUS_REJECTED = 'rejected';

    /**
     * The request never completed. Network failure, timeout, or thrown exception.
     */
    public const STATUS_FAILED = 'failed';

    /**
     * No request was attempted because the pixel ID or access token is unset.
     * Without this row the state leaves no trace anywhere.
     */
    public const STATUS_SKIPPED_MISSING_CREDENTIALS = 'skipped_missing_credentials';

    /** @var string[] */
    public const STATUSES = [
        self::STATUS_SENT,
        self::STATUS_REJECTED,
        self::STATUS_FAILED,
        self::STATUS_SKIPPED_MISSING_CREDENTIALS,
    ];

    protected $fillable = [
        'order_id',
        'event_name',
        'event_id',
        'status',
        'http_status',
        'error_message',
        'value',
        'currency',
        'num_items',
        'test_event_code',
        'sent_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'order_id' => 'integer',
            'http_status' => 'integer',
            'value' => 'decimal:2',
            'num_items' => 'integer',
            'sent_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Order, $this>
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Whether this row records a dispatch to Meta's Test Events tool rather than a real sale.
     */
    public function isTestEvent(): bool
    {
        return $this->test_event_code !== null;
    }
}
