<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Address extends Model
{
    /** @use HasFactory<\Database\Factories\AddressFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'label',
        'name',
        'address_line_1',
        'address_line_2',
        'city',
        'state',
        'postal_code',
        'phone',
        'is_default',
        'country',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'user_id' => 'integer',
            'is_default' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Mark this address as default, unsetting all others for this user.
     */
    public function setAsDefault(): void
    {
        self::where('user_id', $this->user_id)
            ->where('id', '!=', $this->id)
            ->update(['is_default' => false]);

        $this->update(['is_default' => true]);
    }

    /**
     * After deleting a default address, promote the most recent remaining address.
     */
    public function promoteNextDefault(): void
    {
        $next = self::where('user_id', $this->user_id)
            ->latest()
            ->first();

        $next?->update(['is_default' => true]);
    }
}
