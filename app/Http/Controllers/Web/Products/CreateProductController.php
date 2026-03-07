<?php

namespace App\Http\Controllers\Web\Products;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Services\ProductionApiService;
use Inertia\Inertia;
use Inertia\Response;

class CreateProductController extends Controller
{
    public function __construct(private ProductionApiService $productionApi) {}

    public function __invoke(): Response
    {
        $categories = Category::query()->active()->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Products/Create', [
            'categories' => $categories,
            'formulas' => Inertia::defer(fn () => $this->productionApi->getFormulas()),
        ]);
    }
}
