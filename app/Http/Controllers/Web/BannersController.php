<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\Content\StoreBannerRequest;
use App\Http\Requests\Web\Content\UpdateBannerRequest;
use App\Models\Banner;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BannersController extends Controller
{
    public function index(): Response
    {
        $banners = Banner::query()
            ->orderBy('display_order')
            ->get()
            ->map(fn (Banner $banner) => [
                'id' => $banner->id,
                'title' => $banner->title,
                'subtitle' => $banner->subtitle,
                'image_url' => $banner->image_url,
                'link_type' => $banner->link_type,
                'link_value' => $banner->link_value,
                'link_text' => $banner->link_text,
                'display_order' => $banner->display_order,
                'is_active' => $banner->is_active,
                'starts_at' => $banner->starts_at?->toISOString(),
                'ends_at' => $banner->ends_at?->toISOString(),
                'status' => $this->getBannerStatus($banner),
            ]);

        return Inertia::render('Content/Banners', [
            'banners' => $banners,
        ]);
    }

    public function store(StoreBannerRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $imagePath = $request->file('image')->store('banners', 'public');

        $maxOrder = Banner::query()->max('display_order') ?? 0;

        Banner::create([
            'title' => $validated['title'],
            'subtitle' => $validated['subtitle'] ?? null,
            'image_path' => $imagePath,
            'link_type' => $validated['link_type'] ?? null,
            'link_value' => $validated['link_value'] ?? null,
            'link_text' => $validated['link_text'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'starts_at' => $validated['starts_at'] ?? null,
            'ends_at' => $validated['ends_at'] ?? null,
            'display_order' => $maxOrder + 1,
        ]);

        return redirect()->route('admin.banners')
            ->with('success', 'Banner creado exitosamente.');
    }

    public function update(UpdateBannerRequest $request, Banner $banner): RedirectResponse
    {
        $validated = $request->validated();

        $data = [
            'title' => $validated['title'],
            'subtitle' => $validated['subtitle'] ?? null,
            'link_type' => $validated['link_type'] ?? null,
            'link_value' => $validated['link_value'] ?? null,
            'link_text' => $validated['link_text'] ?? null,
            'is_active' => $validated['is_active'] ?? $banner->is_active,
            'starts_at' => $validated['starts_at'] ?? null,
            'ends_at' => $validated['ends_at'] ?? null,
        ];

        if ($request->hasFile('image')) {
            Storage::disk('public')->delete($banner->image_path);
            $data['image_path'] = $request->file('image')->store('banners', 'public');
        }

        $banner->update($data);

        return redirect()->route('admin.banners')
            ->with('success', 'Banner actualizado exitosamente.');
    }

    public function destroy(Banner $banner): RedirectResponse
    {
        Storage::disk('public')->delete($banner->image_path);
        $banner->delete();

        return redirect()->route('admin.banners')
            ->with('success', 'Banner eliminado exitosamente.');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'integer', 'exists:banners,id'],
            'items.*.display_order' => ['required', 'integer', 'min:0'],
        ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated['items'] as $item) {
                Banner::query()
                    ->where('id', $item['id'])
                    ->update(['display_order' => $item['display_order']]);
            }
        });

        return redirect()->route('admin.banners');
    }

    public function toggleVisibility(Banner $banner): RedirectResponse
    {
        $banner->update(['is_active' => ! $banner->is_active]);

        return redirect()->route('admin.banners');
    }

    private function getBannerStatus(Banner $banner): string
    {
        if (! $banner->is_active) {
            return 'inactive';
        }

        if ($banner->starts_at?->isFuture()) {
            return 'scheduled';
        }

        return $banner->ends_at?->isPast() ? 'expired' : 'active';
    }
}
