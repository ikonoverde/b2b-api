<?php

namespace App\Jobs;

use App\Models\ProductImage;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class ProcessProductImage implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    /** @var array<int, int> */
    public array $backoff = [10, 30, 60];

    public function __construct(public ProductImage $productImage)
    {
        $this->afterCommit();
    }

    public function handle(): void
    {
        $disk = Storage::disk('public');
        $originalPath = $this->productImage->image_path;

        if (! $disk->exists($originalPath)) {
            return;
        }

        $manager = new ImageManager(new Driver);
        $originalContents = $disk->get($originalPath);

        $hash = md5($originalContents);
        $webpPath = 'products/'.$hash.'.webp';

        $image = $manager->read($originalContents);

        $thumbImage = clone $image;
        $thumbImage->cover(400, 400);
        $disk->put('products/thumb/'.$hash.'.webp', $thumbImage->toWebp(quality: 80)->toString());

        $image->scaleDown(width: 1200, height: 1200);
        $disk->put($webpPath, $image->toWebp(quality: 85)->toString());

        $disk->delete($originalPath);

        $this->productImage->update(['image_path' => $webpPath]);
    }
}
