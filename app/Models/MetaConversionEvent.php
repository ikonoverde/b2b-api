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

    /**
     * No request was attempted because tracking is disabled in this environment.
     * The credentials are present and would work — that is the point. Local .env carries the
     * production pixel, so a dispatch here would land in the production dataset and Meta would
     * count a developer as a customer. Distinct from skipped_missing_credentials: that is a
     * misconfiguration, this is the guard doing its job.
     */
    public const STATUS_SKIPPED_NOT_ENABLED = 'skipped_not_enabled';

    /** @var string[] */
    public const STATUSES = [
        self::STATUS_SENT,
        self::STATUS_REJECTED,
        self::STATUS_FAILED,
        self::STATUS_SKIPPED_MISSING_CREDENTIALS,
        self::STATUS_SKIPPED_NOT_ENABLED,
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
