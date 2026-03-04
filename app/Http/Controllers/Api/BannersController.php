<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BannerResource;
use App\Models\Banner;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * @group Banners
 *
 * APIs for promotional banners
 */
class BannersController extends Controller
{
    /**
     * Get Active Banners
     *
     * Retrieve all currently active promotional banners.
     *
     * @unauthenticated
     *
     * @response 200 scenario="Success" {"data": [{"id": 1, "title": "Promoción",
     *   "subtitle": "Descuento", "image_url": "http://localhost/storage/banners/example.jpg",
     *   "link_url": "https://example.com", "link_text": "Ver más"}]}
     */
    public function __invoke(): AnonymousResourceCollection
    {
        $banners = Banner::query()
            ->active()
            ->orderBy('display_order')
            ->get();

        return BannerResource::collection($banners);
    }
}
