<?php

namespace App\Services\Keywords;

class ProviderConfig
{
    /**
     * Config keys that are required but blank.
     *
     * @param  list<string>  $keys
     * @return list<string>
     */
    public static function missing(array $keys): array
    {
        return collect($keys)
            ->filter(fn (string $key): bool => blank(config($key)))
            ->values()
            ->all();
    }

    /**
     * The whole group when none of the interchangeable keys are set, otherwise nothing.
     *
     * @param  list<string>  $keys
     * @return list<string>
     */
    public static function missingUnlessAnyPresent(array $keys): array
    {
        foreach ($keys as $key) {
            if (filled(config($key))) {
                return [];
            }
        }

        return array_values($keys);
    }
}
