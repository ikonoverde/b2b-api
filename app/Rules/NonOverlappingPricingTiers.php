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

        $tiers = collect($value)->sortBy('min_qty')->values()->all();

        for ($i = 0; $i < count($tiers) - 1; $i++) {
            $overlap = $this->findOverlap($tiers[$i], $tiers[$i + 1], $i);
            if ($overlap) {
                $fail($overlap);

                return;
            }
        }
    }

    private function findOverlap(array $currentTier, array $nextTier, int $index): ?string
    {
        if ($this->hasUnlimitedMax($currentTier)) {
            return $this->overlapMessage(
                $currentTier,
                $index + 1,
                'no tiene cantidad máxima pero hay niveles posteriores',
            );
        }

        if ($this->rangesOverlap($currentTier, $nextTier)) {
            return $this->overlapMessage($nextTier, $index + 2, 'se superpone con el nivel anterior');
        }

        return null;
    }

    private function hasUnlimitedMax(array $tier): bool
    {
        $max = $tier['max_qty'] ?? null;

        return $max === null || $max === '';
    }

    private function rangesOverlap(array $currentTier, array $nextTier): bool
    {
        $nextMin = $nextTier['min_qty'] ?? null;
        $currentMax = $currentTier['max_qty'] ?? null;

        return $nextMin !== null && (int) $nextMin <= (int) $currentMax;
    }

    private function overlapMessage(array $tier, int $fallbackLabel, string $reason): string
    {
        $label = $tier['label'] ?? $fallbackLabel;

        return "Los niveles de precios no pueden superponerse. El nivel \"{$label}\" {$reason}.";
    }
}
