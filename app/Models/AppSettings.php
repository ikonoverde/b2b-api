<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class AppSettings extends Model
{
    /**
     * The single settings row is read on every public page render to build the footer's contact
     * block, so it is cached until something writes to it.
     */
    private const CACHE_KEY = 'app_settings.current';

    protected $table = 'app_settings';

    protected $fillable = [
        'id',
        'contact_email',
        'contact_phone',
        'contact_address',
    ];

    /**
     * Drop the cached row whenever it changes, so an admin saving Ajustes sees the new
     * details on the storefront immediately rather than after an arbitrary delay.
     */
    protected static function booted(): void
    {
        static::saved(static fn () => static::forgetCached());
        static::deleted(static fn () => static::forgetCached());
    }

    /**
     * Only the raw attributes go through the cache, never the model itself. `serializable_classes`
     * is false in config/cache.php, so a serializing store unserializes with `allowed_classes: false`
     * and hands back a __PHP_Incomplete_Class for any cached object — a fatal error on every page
     * once the entry is warm. The array store used in tests does not serialize at all, so this only
     * ever surfaces against Redis in production.
     */
    public static function current(): self
    {
        $attributes = Cache::rememberForever(
            self::CACHE_KEY,
            static fn (): array => static::firstOrCreate(['id' => 1])->getAttributes(),
        );

        return (new static)->newFromBuilder($attributes);
    }

    public static function forgetCached(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    /**
     * A wa.me link for the contact phone, or null when the number cannot be dialled
     * internationally — a half-formed link is worse than no link at all.
     *
     * Admins type the number however they like ("984 156 9014", "+52 984 156 9014"), so the
     * digits are normalised here: ten digits are assumed to be Mexican and take a 52 prefix,
     * while a number that already carries a country code is left alone.
     */
    public function whatsappUrl(): ?string
    {
        $digits = preg_replace('/\D/', '', (string) $this->contact_phone);

        $normalised = match (true) {
            strlen($digits) === 10 => '52'.$digits,
            strlen($digits) >= 11 && strlen($digits) <= 15 => $digits,
            default => null,
        };

        return $normalised === null ? null : 'https://wa.me/'.$normalised;
    }

    /**
     * Contact details for the storefront's written documents (/terms, /privacy, /about, /faq).
     *
     * Nulls are passed through rather than defaulted so a document can omit the line entirely
     * instead of printing an empty label.
     *
     * @return array{contactEmail: ?string, contactPhone: ?string, contactAddress: ?string}
     */
    public function documentContact(): array
    {
        return [
            'contactEmail' => $this->contact_email,
            'contactPhone' => $this->contact_phone,
            'contactAddress' => $this->contact_address,
        ];
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
