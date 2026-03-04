<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\Content\UpdateStaticPageRequest;
use App\Models\StaticPage;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class StaticPagesController extends Controller
{
    public function index(): Response
    {
        $pages = StaticPage::query()
            ->orderBy('title')
            ->get()
            ->map(fn (StaticPage $page) => [
                'id' => $page->id,
                'slug' => $page->slug,
                'title' => $page->title,
                'is_published' => $page->is_published,
                'updated_at' => $page->updated_at?->toISOString(),
            ]);

        return Inertia::render('Content/StaticPages', [
            'pages' => $pages,
        ]);
    }

    public function edit(StaticPage $staticPage): Response
    {
        return Inertia::render('Content/StaticPages/Edit', [
            'page' => [
                'id' => $staticPage->id,
                'slug' => $staticPage->slug,
                'title' => $staticPage->title,
                'content' => $staticPage->content,
                'is_published' => $staticPage->is_published,
            ],
        ]);
    }

    public function update(UpdateStaticPageRequest $request, StaticPage $staticPage): RedirectResponse
    {
        $staticPage->update($request->validated());

        return redirect()->route('admin.static-pages')
            ->with('success', 'Página actualizada exitosamente.');
    }
}
