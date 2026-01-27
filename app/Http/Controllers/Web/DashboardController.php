<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Dashboard', [
            'stats' => [
                [
                    'label' => 'Ingresos Totales',
                    'value' => '$284,750',
                    'change' => '+12.5%',
                    'positive' => true,
                    'footer' => 'vs. mes anterior',
                    'icon' => '$',
                    'iconBg' => '#FFFFFF',
                    'iconColor' => '#4A5D4A',
                    'featured' => true,
                ],
                [
                    'label' => 'Pedidos Mes',
                    'value' => '1,847',
                    'change' => '+8.2%',
                    'positive' => true,
                    'footer' => '342 pendientes',
                    'icon' => 'cart',
                    'iconBg' => '#FEF3E2',
                    'iconColor' => '#D4A853',
                    'featured' => false,
                ],
                [
                    'label' => 'Clientes B2B',
                    'value' => '856',
                    'change' => '+15.3%',
                    'positive' => true,
                    'footer' => '23 nuevos este mes',
                    'icon' => 'users',
                    'iconBg' => '#E8F5E9',
                    'iconColor' => '#4CAF50',
                    'featured' => false,
                ],
                [
                    'label' => 'Satisfaccion',
                    'value' => '4.9/5',
                    'change' => '+0.2',
                    'positive' => true,
                    'footer' => 'De 1,234 resenas',
                    'icon' => 'star',
                    'iconBg' => '#F3E5F5',
                    'iconColor' => '#9B8BB8',
                    'featured' => false,
                ],
            ],
            'recentActivity' => [
                [
                    'id' => 1,
                    'title' => 'Pedido #1847 completado',
                    'time' => 'Hace 5 minutos',
                    'type' => 'success',
                ],
                [
                    'id' => 2,
                    'title' => 'Nuevo cliente: Empresa ABC',
                    'time' => 'Hace 23 minutos',
                    'type' => 'info',
                ],
                [
                    'id' => 3,
                    'title' => 'Stock bajo: Producto #234',
                    'time' => 'Hace 1 hora',
                    'type' => 'warning',
                ],
                [
                    'id' => 4,
                    'title' => 'Nueva resena 5 estrellas',
                    'time' => 'Hace 2 horas',
                    'type' => 'review',
                ],
                [
                    'id' => 5,
                    'title' => 'Pago rechazado: Pedido #1832',
                    'time' => 'Hace 3 horas',
                    'type' => 'error',
                ],
            ],
        ]);
    }
}
