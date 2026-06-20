<?php

namespace App\Models;

use Database\Factories\MeridaSampleRequestFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MeridaSampleRequest extends Model
{
    /** @use HasFactory<MeridaSampleRequestFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'business_name',
        'contact_name',
        'email',
        'phone',
        'business_type',
        'client_volume',
        'social_url',
        'products_interested',
        'improvement_goals',
        'status',
        'ip_address',
        'user_agent',
    ];

    protected function casts(): array
    {
        return [
            'user_id' => 'integer',
            'products_interested' => 'array',
            'improvement_goals' => 'array',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
