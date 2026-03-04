<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StaticPageResource;
use App\Models\StaticPage;

/**
 * @group Pages
 *
 * APIs for static pages
 */
class StaticPagesController extends Controller
{
    /**
     * Get Static Page
     *
     * Retrieve a published static page by slug.
     *
     * @unauthenticated
     *
     * @urlParam slug string required The page slug. Example: terms
     *
     * @response 200 scenario="Success" {"data": {"slug": "terms",
     *   "title": "Términos y Condiciones", "content": "## 1. Aceptación...",
     *   "updated_at": "2026-03-04T00:00:00.000000Z"}}
     * @response 404 scenario="Not Found" {"message": "Page not found."}
     */
    public function __invoke(string $slug): StaticPageResource
    {
        $page = StaticPage::query()
            ->where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        return new StaticPageResource($page);
    }
}
