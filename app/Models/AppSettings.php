<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AppSettings extends Model
{
    protected $table = 'app_settings';

    protected $fillable = [
        'id',
        'contact_email',
        'contact_phone',
        'contact_address',
    ];

    public static function current(): self
    {
        return static::firstOrCreate(['id' => 1]);
    }

    /**
     * Company details for rendering the order invoice.
     *
     * @return array{name: string, address: string, phone: string, email: string}
     */
    public function invoiceCompany(): array
    {
        return [
            'name' => config('app.name'),
            'address' => $this->contact_address ?? '',
            'phone' => $this->contact_phone ?? '',
            'email' => $this->contact_email ?? '',
        ];
    }
}
