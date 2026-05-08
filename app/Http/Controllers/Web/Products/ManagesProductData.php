<?php

namespace App\Http\Controllers\Web\Products;

use App\Jobs\ProcessProductImage;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Support\Facades\Storage;

trait ManagesProductData
{
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
            Storage::disk('public')->delete($img->getThumbnailPath());
            $img->delete();
        }
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
            $productImage = $product->images()->create([
                'image_path' => $path,
                'position' => $currentCount + $index,
            ]);
            ProcessProductImage::dispatch($productImage);
        }
    }
}
