<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\Products\StoreProductRequest;
use App\Http\Requests\Web\Products\UpdateProductRequest;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductsController extends Controller
{
    private array $categories = [
        'Aceites para masaje',
        'Aromaterapia',
        'Cremas y lociones',
    ];

    public function index(): Response
    {
        $products = Product::query()
            ->with(['images' => fn ($query) => $query->orderBy('position')->limit(1)])
            ->get()
            ->map(fn (Product $product) => [
                'id' => $product->id,
                'name' => $product->name,
                'sku' => $product->sku,
                'category' => $product->category,
                'price' => (float) $product->price,
                'stock' => $product->stock,
                'status' => $product->status,
                'image' => $product->images->first()?->image_url,
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
        DB::transaction(function () use ($request) {
            $validated = $request->validated();
            $pricingTiers = $validated['pricing_tiers'] ?? [];
            $images = $validated['images'] ?? [];
            unset($validated['pricing_tiers'], $validated['images']);

            $product = Product::create($validated);

            $this->syncPricingTiers($product, $pricingTiers);
            $this->storeNewImages($product, $images);
        });

        return redirect()->route('admin.products')->with('success', 'Producto creado exitosamente');
    }

    public function edit(Product $product): Response
    {
        $product->load(['pricingTiers', 'images']);

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
                'images' => $product->images->map(fn ($img) => [
                    'id' => $img->id,
                    'image_url' => $img->image_url,
                    'position' => $img->position,
                ])->values()->all(),
                'pricing_tiers' => $product->pricingTiers->map(fn ($tier) => [
                    'min_qty' => (string) $tier->min_qty,
                    'max_qty' => $tier->max_qty ? (string) $tier->max_qty : '',
                    'price' => (string) $tier->price,
                    'discount' => (string) $tier->discount,
                    'label' => $tier->label,
                ])->values()->all(),
            ],
            'categories' => $this->categories,
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        DB::transaction(function () use ($request, $product) {
            $validated = $request->validated();
            $pricingTiers = $validated['pricing_tiers'] ?? [];
            $images = $validated['images'] ?? [];
            $deleteImages = $validated['delete_images'] ?? [];
            unset($validated['pricing_tiers'], $validated['images'], $validated['delete_images']);

            $product->update($validated);

            $this->deleteProductImages($product, $deleteImages);
            $this->storeNewImages($product, $images);
            $this->syncPricingTiers($product, $pricingTiers);
        });

        return redirect()->route('admin.products')->with('success', 'Producto actualizado exitosamente');
    }

    private function deleteProductImages(Product $product, array $imageIds): void
    {
        if (empty($imageIds)) {
            return;
        }

        $imagesToDelete = ProductImage::whereIn('id', $imageIds)
            ->where('product_id', $product->id)
            ->get();

        foreach ($imagesToDelete as $img) {
            Storage::disk('public')->delete($img->image_path);
        }

        ProductImage::whereIn('id', $imageIds)
            ->where('product_id', $product->id)
            ->delete();
    }

    private function storeNewImages(Product $product, array $images): void
    {
        if (empty($images)) {
            return;
        }

        $currentCount = $product->images()->count();

        foreach ($images as $index => $image) {
            if ($currentCount + $index >= 4) {
                break;
            }

            $path = $image->store('products', 'public');
            $product->images()->create([
                'image_path' => $path,
                'position' => $currentCount + $index,
            ]);
        }
    }

    private function syncPricingTiers(Product $product, array $pricingTiers): void
    {
        $product->pricingTiers()->delete();

        if (! empty($pricingTiers)) {
            $product->pricingTiers()->createMany($pricingTiers);
        }
    }
}
