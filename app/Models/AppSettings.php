<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AppSettings extends Model
{
    protected $table = 'app_settings';

    protected $fillable = [
        'contact_email',
        'contact_phone',
        'contact_address',
    ];

    public static function current(): self
    {
        return static::firstOrCreate(['id' => 1]);
    }
}
