<?php

namespace App\Services\StaticPages;

use App\Http\Controllers\Web\StaticPageController;
use App\Models\StaticPage;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

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
     * A create carries the slug an edit forbids: this is the one moment a page's identity is set, and
     * the storefront route table is keyed on that slug, so it must be unique and route-safe. `title` and
     * `content` are required outright rather than `sometimes`, because a new page has no stored value for
     * an omitted field to fall back to. `is_published` is absent for the same reason it is absent from
     * the edit tool that runs unattended: the create tool drops it and forces a draft.
     *
     * @return array<string, list<mixed>>
     */
    public function createRules(): array
    {
        return [
            'slug' => ['required', 'string', 'max:255', 'alpha_dash', Rule::unique('static_pages', 'slug')],
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function createMessages(): array
    {
        return [
            'slug.required' => 'Provide a slug for the new static page, such as shipping or returns.',
            'slug.alpha_dash' => 'The slug may only contain letters, numbers, dashes, and underscores. Strip accents and spaces.',
            'slug.unique' => 'A static page with that slug already exists. Call the list tool to see the slugs in use, and edit that page instead of creating another.',
            'title.required' => 'Provide a non-empty title for the new static page.',
            'content.required' => 'Provide non-empty markdown content for the new static page.',
        ];
    }

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
     * Derive the slug from the title when the caller sends none, mirroring the blog create tool, and let
     * an empty string fall through to validation rather than silently becoming a slug of `""`.
     *
     * @param  array<string, mixed>  $arguments
     * @return array<string, mixed>
     */
    public function normalizeForCreate(array $arguments): array
    {
        foreach (['slug', 'title', 'content'] as $key) {
            if (array_key_exists($key, $arguments) && is_string($arguments[$key])) {
                $arguments[$key] = trim($arguments[$key]) === '' ? null : trim($arguments[$key]);
            }
        }

        if (($arguments['slug'] ?? null) === null && is_string($arguments['title'] ?? null)) {
            $arguments['slug'] = Str::slug($arguments['title']);
        }

        return $arguments;
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
     * A page an agent creates is always a draft. The storefront web routes name their slugs one by one,
     * so a fresh slug is unreachable on the web however published it claims to be; the mobile API serves
     * any published slug, so leaving `is_published` on would put an unreviewed page in front of the app
     * the moment it saves. Force the draft here rather than trusting the caller to omit the flag.
     *
     * @param  array<string, mixed>  $validated
     */
    public function create(array $validated): StaticPage
    {
        return StaticPage::create([
            'slug' => $validated['slug'],
            'title' => $validated['title'],
            'content' => $validated['content'],
            'is_published' => false,
        ]);
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
     * rather than hardcoding slugs.
     *
     * Since /terms, /privacy, /about and /faq moved to hardcoded components, no route carries a
     * slug and this returns nothing — every page correctly reports itself as not publicly visible.
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
