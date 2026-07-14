<?php

namespace App\Services\StaticPages;

use App\Http\Controllers\Web\StaticPageController;
use App\Models\StaticPage;
use Illuminate\Support\Facades\Route;

class StaticPageService
{
    /**
     * Fields an edit may set. Ordered as they appear on the model.
     *
     * The slug is not among them. It is the identity of the page and the storefront routes are keyed
     * on it, so renaming the slug of `terms` does not move the terms page, it 404s it. A static page
     * is chosen by slug, never renamed by one.
     *
     * @var list<string>
     */
    public const EDITABLE = ['title', 'content', 'is_published'];

    /**
     * @var array<string, string>|null
     */
    private ?array $publicUrls = null;

    /**
     * @return array<string, list<mixed>>
     */
    public function editRules(): array
    {
        return [
            'id' => ['nullable', 'integer', 'exists:static_pages,id'],
            'slug' => ['nullable', 'string', 'exists:static_pages,slug'],
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'content' => ['sometimes', 'required', 'string'],
            'is_published' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function editMessages(): array
    {
        return [
            'id.exists' => 'No static page exists for the provided id.',
            'slug.exists' => 'No static page exists for the provided slug. Call the list tool to see which pages exist; static pages cannot be created.',
            'title.required' => 'Provide a non-empty title when updating the title.',
            'content.required' => 'Provide non-empty markdown content when updating the content.',
        ];
    }

    /**
     * @return array<string, list<mixed>>
     */
    public function lookupRules(): array
    {
        return [
            'id' => ['nullable', 'integer', 'exists:static_pages,id'],
            'slug' => ['nullable', 'string', 'exists:static_pages,slug'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function lookupMessages(): array
    {
        return [
            'id.exists' => 'No static page exists for the provided id.',
            'slug.exists' => 'No static page exists for the provided slug. Call the list tool to see which pages exist.',
        ];
    }

    /**
     * An edit is a partial update, so an omitted field must leave the stored value alone. Nothing on a
     * static page is clearable: an empty title or an empty terms page is a defect, not an intention,
     * so an empty string survives normalization and fails validation instead of erasing a live page.
     *
     * @param  array<string, mixed>  $arguments
     * @return array<string, mixed>
     */
    public function normalizeForEdit(array $arguments): array
    {
        foreach (['slug', 'title', 'content'] as $key) {
            if (array_key_exists($key, $arguments) && is_string($arguments[$key])) {
                $arguments[$key] = trim($arguments[$key]);
            }
        }

        if (($arguments['slug'] ?? null) === '') {
            $arguments['slug'] = null;
        }

        foreach (['id', 'slug', ...self::EDITABLE] as $key) {
            if (($arguments[$key] ?? null) === null) {
                unset($arguments[$key]);
            }
        }

        return $arguments;
    }

    /**
     * @param  array<string, mixed>  $arguments
     * @return array<string, mixed>
     */
    public function normalizeForLookup(array $arguments): array
    {
        if (array_key_exists('slug', $arguments) && is_string($arguments['slug'])) {
            $arguments['slug'] = trim($arguments['slug']) === '' ? null : trim($arguments['slug']);
        }

        return $arguments;
    }

    /**
     * Find the page an id-or-slug pair refers to.
     *
     * @param  array<string, mixed>  $validated
     */
    public function resolve(array $validated): ?StaticPage
    {
        $id = $validated['id'] ?? null;
        $slug = $validated['slug'] ?? null;

        if ($id === null && $slug === null) {
            return null;
        }

        return StaticPage::query()
            ->when($id !== null, fn ($query) => $query->whereKey($id))
            ->when($id === null, fn ($query) => $query->where('slug', $slug))
            ->firstOrFail();
    }

    /**
     * Reduce a validated edit payload to the fields it actually carries.
     *
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    public function updates(array $validated): array
    {
        $updates = [];

        foreach (self::EDITABLE as $field) {
            if (array_key_exists($field, $validated)) {
                $updates[$field] = $validated[$field];
            }
        }

        return $updates;
    }

    /**
     * @param  array<string, mixed>  $updates
     */
    public function update(StaticPage $staticPage, array $updates): StaticPage
    {
        $staticPage->update($updates);

        return $staticPage;
    }

    /**
     * Every static page there is. There is no tool to create one, so this is the whole set a caller
     * may edit, and the only way to learn the slugs.
     *
     * @return list<array<string, mixed>>
     */
    public function all(): array
    {
        return StaticPage::query()
            ->orderBy('slug')
            ->get()
            ->map(fn (StaticPage $staticPage): array => $this->payload($staticPage))
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    public function payload(StaticPage $staticPage, bool $withContent = false): array
    {
        $url = $this->publicUrls()[$staticPage->slug] ?? null;

        $payload = [
            'id' => $staticPage->id,
            'slug' => $staticPage->slug,
            'title' => $staticPage->title,
        ];

        if ($withContent) {
            $payload['content'] = $staticPage->content;
        }

        $payload['is_published'] = $staticPage->is_published;
        $payload['is_publicly_visible'] = $staticPage->is_published && $url !== null;
        $payload['url'] = $url;
        $payload['updated_at'] = $staticPage->updated_at?->toISOString();

        return $payload;
    }

    /**
     * The storefront serves a static page only where a route carries its slug, so a page nothing
     * routes to has no public URL however published it claims to be. Read that from the route table
     * rather than hardcoding the four slugs that happen to be routed today.
     *
     * @return array<string, string>
     */
    private function publicUrls(): array
    {
        if ($this->publicUrls !== null) {
            return $this->publicUrls;
        }

        $urls = [];

        foreach (Route::getRoutes()->getRoutes() as $route) {
            $slug = $route->defaults['slug'] ?? null;
            $controller = $route->getAction('controller');

            if (is_string($slug) && is_string($controller) && str_starts_with($controller, StaticPageController::class)) {
                $urls[$slug] = url($route->uri());
            }
        }

        return $this->publicUrls = $urls;
    }
}
