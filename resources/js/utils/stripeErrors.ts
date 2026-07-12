import type { StripeError } from '@stripe/stripe-js';

const FALLBACK_MESSAGE = 'No pudimos procesar el pago. Intenta con otro método de pago.';

const PAYMENT_ERROR_MESSAGES: Record<string, string> = {
    generic_decline: 'Tu banco rechazó la tarjeta. Intenta con otro método de pago.',
    do_not_honor: 'Tu banco rechazó la tarjeta. Intenta con otro método de pago.',
    transaction_not_allowed: 'Tu banco no permite esta compra con esta tarjeta. Intenta con otro método de pago.',
    lost_card: 'Tu banco rechazó la tarjeta. Intenta con otro método de pago.',
    stolen_card: 'Tu banco rechazó la tarjeta. Intenta con otro método de pago.',
    pickup_card: 'Tu banco rechazó la tarjeta. Intenta con otro método de pago.',
    card_velocity_exceeded: 'La tarjeta superó su límite de operaciones. Intenta con otro método de pago.',
    insufficient_funds: 'La tarjeta no tiene fondos suficientes. Intenta con otro método de pago.',
    expired_card: 'La tarjeta está vencida. Intenta con otro método de pago.',
    incorrect_cvc: 'El código de seguridad de la tarjeta es incorrecto. Verifica los datos o intenta con otro método de pago.',
    invalid_cvc: 'El código de seguridad de la tarjeta es incorrecto. Verifica los datos o intenta con otro método de pago.',
    incorrect_number: 'El número de tarjeta es incorrecto. Verifica los datos o intenta con otro método de pago.',
    invalid_number: 'El número de tarjeta es incorrecto. Verifica los datos o intenta con otro método de pago.',
    invalid_expiry_month: 'La fecha de vencimiento de la tarjeta es incorrecta. Verifica los datos o intenta con otro método de pago.',
    invalid_expiry_year: 'La fecha de vencimiento de la tarjeta es incorrecta. Verifica los datos o intenta con otro método de pago.',
    processing_error: 'No pudimos procesar la tarjeta en este momento. Intenta de nuevo o usa otro método de pago.',
    card_not_supported: 'Esta tarjeta no admite este tipo de compra. Intenta con otro método de pago.',
    currency_not_supported: 'Esta tarjeta no admite pagos en pesos mexicanos. Intenta con otro método de pago.',
    authentication_required: 'Tu banco no autorizó el pago. Intenta de nuevo o usa otro método de pago.',
    payment_intent_authentication_failure: 'Tu banco no autorizó el pago. Intenta de nuevo o usa otro método de pago.',
};

/**
 * Stripe localizes `error.message` with the locale given to `loadStripe`, but declines
 * are worded by the bank, so map the codes we know to our own copy and always point the
 * customer at another payment method.
 */
export function paymentErrorMessage(error: StripeError): string {
    const code = error.decline_code ?? error.code;

    if (code && code in PAYMENT_ERROR_MESSAGES) {
        return PAYMENT_ERROR_MESSAGES[code];
    }

    if (error.type === 'validation_error' && error.message) {
        return error.message;
    }

    return FALLBACK_MESSAGE;
}
