<?php

namespace App\Services;

use GeoIp2\Database\Reader;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Throwable;

class VisitorLocationService
{
    /**
     * @return array{country: string|null, region: string|null, city: string|null}|null
     */
    public function locate(string $ip): ?array
    {
        if (! $this->isPublicIp($ip)) {
            return null;
        }

        $databasePath = $this->databasePath();

        if ($databasePath === null || ! is_file($databasePath)) {
            return null;
        }

        return Cache::remember(
            $this->cacheKey($ip),
            $this->cacheTtl(),
            fn () => $this->lookup($databasePath, $ip),
        );
    }

    public function shouldShowMeridaPromotion(string $ip): bool
    {
        if (! $this->configBoolean('shop.visitor_location.merida_promotion.enabled')) {
            return false;
        }

        if ($this->configBoolean('shop.visitor_location.merida_promotion.local_override')) {
            return true;
        }

        $location = $this->locate($ip);

        return $location !== null && $this->isPromotionLocation($location);
    }

    /**
     * @param  array{country?: string|null, region?: string|null, city?: string|null}  $location
     */
    public function isPromotionLocation(array $location): bool
    {
        return $this->normalize($location['country'] ?? null) === $this->normalize(config('shop.visitor_location.merida_promotion.country'))
            && $this->normalize($location['region'] ?? null) === $this->normalize(config('shop.visitor_location.merida_promotion.region'));
    }

    /**
     * @return array{country: string|null, region: string|null, city: string|null}|null
     */
    private function lookup(string $databasePath, string $ip): ?array
    {
        $reader = null;

        try {
            $reader = new Reader($databasePath);
            $record = $reader->city($ip);

            return [
                'country' => $record->country->isoCode ?: null,
                'region' => $this->localizedName($record->mostSpecificSubdivision->names ?? [])
                    ?? $record->mostSpecificSubdivision->name,
                'city' => $this->localizedName($record->city->names ?? []) ?? $record->city->name,
            ];
        } catch (Throwable) {
            return null;
        } finally {
            $reader?->close();
        }
    }

    private function databasePath(): ?string
    {
        $databasePath = config('shop.visitor_location.database_path');

        return is_string($databasePath) && $databasePath !== '' ? $databasePath : null;
    }

    private function cacheTtl(): int
    {
        return max(60, (int) config('shop.visitor_location.cache_ttl', 86400));
    }

    private function cacheKey(string $ip): string
    {
        return 'visitor-location:'.hash('sha256', $ip);
    }

    private function isPublicIp(string $ip): bool
    {
        return filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false;
    }

    private function normalize(mixed $value): string
    {
        return Str::of((string) $value)
            ->ascii()
            ->lower()
            ->trim()
            ->value();
    }

    /**
     * @param  array<string, string>  $names
     */
    private function localizedName(array $names): ?string
    {
        $name = $names['es'] ?? $names['en'] ?? ($names === [] ? null : reset($names));

        return is_string($name) && $name !== '' ? $name : null;
    }

    private function configBoolean(string $key): bool
    {
        return filter_var(config($key), FILTER_VALIDATE_BOOLEAN);
    }
}
