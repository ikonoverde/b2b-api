<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class NonOverlappingPricingTiers implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_array($value) || count($value) < 2) {
            return;
        }

        // Sort tiers by min_qty
        $tiers = collect($value)->sortBy('min_qty')->values()->all();

        for ($i = 0; $i < count($tiers) - 1; $i++) {
            $currentTier = $tiers[$i];
            $nextTier = $tiers[$i + 1];

            $currentMax = $currentTier['max_qty'] ?? null;
            $nextMin = $nextTier['min_qty'] ?? null;

            // If current tier has no max (unlimited), it overlaps with everything after
            if ($currentMax === null || $currentMax === '') {
                $fail('Los niveles de precios no pueden superponerse. El nivel "'.($currentTier['label'] ?? ($i + 1)).'" no tiene cantidad máxima pero hay niveles posteriores.');

                return;
            }

            // Check if ranges overlap: next min should be greater than current max
            if ($nextMin !== null && (int) $nextMin <= (int) $currentMax) {
                $fail('Los niveles de precios no pueden superponerse. El nivel "'.($nextTier['label'] ?? ($i + 2)).'" se superpone con el nivel anterior.');

                return;
            }
        }
    }
}
