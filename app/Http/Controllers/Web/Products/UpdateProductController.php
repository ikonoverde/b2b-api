<?php

namespace App\Http\Controllers\Web\Products;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\Products\UpdateProductRequest;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class UpdateProductController extends Controller
{
    use ManagesProductData;

    public function __invoke(UpdateProductRequest $request, Product $product): RedirectResponse
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
}
