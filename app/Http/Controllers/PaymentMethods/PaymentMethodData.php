<?php

namespace App\Http\Controllers\PaymentMethods;

class PaymentMethodData
{
    /**
     * Format a Stripe payment method into a consistent array structure.
     *
     * @return array{id: string, type: string, card: array{brand: string, last4: string, exp_month: int, exp_year: int}}
     */
    public static function fromStripe(object $paymentMethod): array
    {
        return [
            'id' => $paymentMethod->id,
            'type' => $paymentMethod->type,
            'card' => [
                'brand' => $paymentMethod->card->brand,
                'last4' => $paymentMethod->card->last4,
                'exp_month' => $paymentMethod->card->exp_month,
                'exp_year' => $paymentMethod->card->exp_year,
            ],
        ];
    }
}
