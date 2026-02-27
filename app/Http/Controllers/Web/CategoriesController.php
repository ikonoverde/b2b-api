<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CategoriesController extends Controller
{
    /**
     * Display a listing of categories in tree structure.
     */
    public function index(): Response
    {
        $categories = Category::query()
            ->withCount('products')
            ->orderBy('display_order')
            ->orderBy('name')
            ->get()
            ->map(fn (Category $category) => $this->formatCategory($category));

        $tree = $this->buildTree($categories);

        return Inertia::render('Categories', [
            'categories' => $tree,
            'flatCategories' => $categories,
        ]);
    }

    /**
     * Store a newly created category.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'parent_id' => ['nullable', 'integer', 'exists:categories,id'],
            'is_active' => ['boolean'],
        ]);

        $maxOrder = Category::query()
            ->where('parent_id', $validated['parent_id'] ?? null)
            ->max('display_order') ?? 0;

        Category::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
            'parent_id' => $validated['parent_id'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'display_order' => $maxOrder + 1,
        ]);

        return redirect()->route('admin.categories')
            ->with('success', 'Categoría creada exitosamente.');
    }

    /**
     * Update the specified category.
     */
    public function update(Request $request, Category $category): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'parent_id' => ['nullable', 'integer', 'exists:categories,id'],
            'is_active' => ['boolean'],
        ]);

        if (isset($validated['parent_id']) && $validated['parent_id'] === $category->id) {
            return redirect()->back()
                ->with('error', 'Una categoría no puede ser su propio padre.');
        }

        if (isset($validated['parent_id']) && $this->isDescendant($category, $validated['parent_id'])) {
            return redirect()->back()
                ->with('error', 'No puedes asignar una categoría como padre de una de sus subcategorías.');
        }

        $slugChanged = $validated['name'] !== $category->name;

        $category->update([
            'name' => $validated['name'],
            'slug' => $slugChanged ? Str::slug($validated['name']) : $category->slug,
            'description' => $validated['description'] ?? null,
            'parent_id' => $validated['parent_id'] ?? null,
            'is_active' => $validated['is_active'] ?? $category->is_active,
        ]);

        return redirect()->route('admin.categories')
            ->with('success', 'Categoría actualizada exitosamente.');
    }

    /**
     * Remove the specified category.
     */
    public function destroy(Category $category): RedirectResponse
    {
        if ($category->children()->count() > 0) {
            return redirect()->back()
                ->with('error', 'No puedes eliminar una categoría que tiene subcategorías. Mueve o elimina las subcategorías primero.');
        }

        if ($category->products()->count() > 0) {
            return redirect()->back()
                ->with('error', 'No puedes eliminar una categoría que tiene productos. Reasigna o elimina los productos primero.');
        }

        $category->delete();

        return redirect()->route('admin.categories')
            ->with('success', 'Categoría eliminada exitosamente.');
    }

    /**
     * Toggle category visibility.
     */
    public function toggleVisibility(Category $category): JsonResponse
    {
        $category->update(['is_active' => ! $category->is_active]);

        return response()->json([
            'success' => true,
            'is_active' => $category->is_active,
        ]);
    }

    /**
     * Update category order via drag-and-drop.
     */
    public function reorder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'integer', 'exists:categories,id'],
            'items.*.parent_id' => ['nullable', 'integer', 'exists:categories,id'],
            'items.*.display_order' => ['required', 'integer', 'min:0'],
        ]);

        try {
            DB::beginTransaction();

            foreach ($validated['items'] as $item) {
                Category::query()
                    ->where('id', $item['id'])
                    ->update([
                        'parent_id' => $item['parent_id'],
                        'display_order' => $item['display_order'],
                    ]);
            }

            DB::commit();

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get category statistics for delete confirmation.
     */
    public function stats(Category $category): JsonResponse
    {
        return response()->json([
            'products_count' => $category->products()->count(),
            'children_count' => $category->children()->count(),
        ]);
    }

    private function formatCategory(Category $category): array
    {
        return [
            'id' => $category->id,
            'name' => $category->name,
            'slug' => $category->slug,
            'description' => $category->description,
            'is_active' => $category->is_active,
            'parent_id' => $category->parent_id,
            'display_order' => $category->display_order,
            'products_count' => $category->products_count,
            'depth' => 0,
        ];
    }

    /**
     * Build tree structure from flat array.
     *
     * @param  \Illuminate\Support\Collection<int, array>  $categories
     * @return array<int, array>
     */
    private function buildTree($categories, ?int $parentId = null, int $depth = 0): array
    {
        $tree = [];

        foreach ($categories as $category) {
            if ($category['parent_id'] === $parentId) {
                $category['depth'] = $depth;
                $children = $this->buildTree($categories, $category['id'], $depth + 1);

                if (! empty($children)) {
                    $category['children'] = $children;
                }

                $tree[] = $category;
            }
        }

        return $tree;
    }

    /**
     * Check if a category is a descendant of another.
     */
    private function isDescendant(Category $category, int $potentialParentId): bool
    {
        $parent = Category::find($potentialParentId);

        while ($parent !== null) {
            if ($parent->id === $category->id) {
                return true;
            }

            $parent = $parent->parent;
        }

        return false;
    }
}
