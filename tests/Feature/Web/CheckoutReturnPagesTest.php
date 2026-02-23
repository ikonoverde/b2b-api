<?php

describe('Checkout Return Pages', function () {
    it('renders the success page without authentication', function () {
        $response = $this->get('/checkout/success');

        $response->assertOk();
        $response->assertSee('Pago exitoso');
        $response->assertSee('Puedes volver a la app para ver tu pedido.');
    });

    it('renders the success page with a session_id query parameter', function () {
        $response = $this->get('/checkout/success?session_id=cs_test_abc123');

        $response->assertOk();
        $response->assertSee('Pago exitoso');
    });

    it('renders the cancel page without authentication', function () {
        $response = $this->get('/checkout/cancel');

        $response->assertOk();
        $response->assertSee('Pago cancelado');
        $response->assertSee('Vuelve a la app para intentar de nuevo.');
    });
});
