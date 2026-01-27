<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ProductsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Products', [
            'products' => [
                [
                    'id' => 1,
                    'name' => 'Fertilizante Orgánico Premium',
                    'sku' => 'FER-001',
                    'category' => 'Fertilizantes',
                    'price' => 45.00,
                    'stock' => 256,
                    'status' => 'active',
                    'image' => null,
                ],
                [
                    'id' => 2,
                    'name' => 'Semillas de Tomate Híbrido',
                    'sku' => 'SEM-042',
                    'category' => 'VGO',
                    'price' => 12.50,
                    'stock' => 1420,
                    'status' => 'active',
                    'image' => null,
                ],
                [
                    'id' => 3,
                    'name' => 'Kit de Riego por Goteo',
                    'sku' => 'RIE-015',
                    'category' => 'Macrofertilizers',
                    'price' => 89.99,
                    'stock' => 89,
                    'status' => 'inactive',
                    'image' => null,
                ],
                [
                    'id' => 4,
                    'name' => 'Insecticida Natural Neem',
                    'sku' => 'INS-003',
                    'category' => 'Control plagas',
                    'price' => 24.00,
                    'stock' => 567,
                    'status' => 'active',
                    'image' => null,
                ],
                [
                    'id' => 5,
                    'name' => 'Sustrato Universal 50L',
                    'sku' => 'SUS-008',
                    'category' => 'Bioestimulz',
                    'price' => 19.75,
                    'stock' => 23,
                    'status' => 'low_stock',
                    'image' => null,
                ],
                [
                    'id' => 6,
                    'name' => 'Maceta Biodegradable 30cm',
                    'sku' => 'MAC-021',
                    'category' => 'Contenedores',
                    'price' => 9.90,
                    'stock' => 0,
                    'status' => 'low_stock',
                    'image' => null,
                ],
            ],
        ]);
    }
}
