<?php

namespace App\Http\Controllers\Web\Products;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\Products\StoreProductRequest;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class StoreProductController extends Controller
{
    use ManagesProductData;

    public function __invoke(StoreProductRequest $request): RedirectResponse
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
}
