<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\Products\StoreProductRequest;
use App\Http\Requests\Web\Products\UpdateProductRequest;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProductsController extends Controller
{
    private array $categories = [
        'Fertilizantes',
        'Semillas',
        'Control plagas',
        'Bioestimulantes',
        'Contenedores',
        'Riego',
        'Herramientas',
        'Sustratos',
    ];

    public function index(): Response
    {
        $products = Product::query()
            ->get()
            ->map(fn (Product $product) => [
                'id' => $product->id,
                'name' => $product->name,
                'sku' => $product->sku,
                'category' => $product->category,
                'price' => (float) $product->price,
                'stock' => $product->stock,
                'status' => $product->status,
                'image' => $product->image,
            ]);

        return Inertia::render('Products', [
            'products' => $products,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Products/Create', [
            'categories' => $this->categories,
        ]);
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        Product::create($request->validated());

        return redirect()->route('products')->with('success', 'Producto creado exitosamente');
    }

    public function edit(Product $product): Response
    {
        return Inertia::render('Products/Edit', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'sku' => $product->sku,
                'category' => $product->category,
                'description' => $product->description ?? '',
                'price' => (string) $product->price,
                'cost' => $product->cost ? (string) $product->cost : '',
                'stock' => (string) $product->stock,
                'min_stock' => $product->min_stock ? (string) $product->min_stock : '',
                'is_active' => $product->is_active,
                'is_featured' => $product->is_featured,
            ],
            'categories' => $this->categories,
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $product->update($request->validated());

        return redirect()->route('products')->with('success', 'Producto actualizado exitosamente');
    }
}
