<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\StaticPage;
use Inertia\Inertia;
use Inertia\Response;

class StaticPageController extends Controller
{
    public function show(string $slug): Response
    {
        $page = StaticPage::query()
            ->where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        return Inertia::render('StaticPage', [
            'page' => [
                'slug' => $page->slug,
                'title' => $page->title,
                'content' => $page->content,
                'updated_at' => $page->updated_at?->toISOString(),
            ],
        ]);
    }
}
