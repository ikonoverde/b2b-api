<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;

beforeEach(function () {
    $this->admin = User::factory()->create(['role' => 'admin']);
    $this->user = User::factory()->create(['role' => 'user']);
});

// Authentication & Authorization Tests
describe('Authentication', function () {
    it('requires authentication to access categories page', function () {
        $response = $this->get('/admin/categories');

        $response->assertRedirect('/admin/login');
    });

    it('allows authenticated users to access categories page', function () {
        $response = $this->actingAs($this->admin)
            ->get('/admin/categories');

        $response->assertSuccessful();
    });

    it('allows authenticated non-admin users to access categories page', function () {
        $response = $this->actingAs($this->user)
            ->get('/admin/categories');

        $response->assertSuccessful();
    });
});

// Index/List Tests
describe('Index', function () {
    it('displays categories in tree structure', function () {
        $parent = Category::factory()->create(['name' => 'Parent', 'display_order' => 1]);
        $child = Category::factory()->create([
            'name' => 'Child',
            'parent_id' => $parent->id,
            'display_order' => 1,
        ]);

        $response = $this->actingAs($this->admin)
            ->get('/admin/categories');

        $response->assertInertia(fn ($page) => $page
            ->component('Categories')
            ->has('categories', 1)
            ->where('categories.0.name', 'Parent')
            ->has('categories.0.children', 1)
            ->where('categories.0.children.0.name', 'Child')
        );
    });

    it('shows product counts for each category', function () {
        $category = Category::factory()->create();
        Product::factory()->count(3)->create(['category_id' => $category->id]);

        $response = $this->actingAs($this->admin)
            ->get('/admin/categories');

        $response->assertInertia(fn ($page) => $page
            ->has('flatCategories')
            ->where('flatCategories.0.products_count', 3)
        );
    });
});

// Create Tests
describe('Create', function () {
    it('can create a root category', function () {
        $response = $this->actingAs($this->admin)
            ->post('/admin/categories', [
                'name' => 'New Category',
                'description' => 'Category description',
                'parent_id' => null,
                'is_active' => true,
            ]);

        $response->assertRedirect('/admin/categories');
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('categories', [
            'name' => 'New Category',
            'slug' => 'new-category',
            'description' => 'Category description',
            'parent_id' => null,
            'is_active' => true,
            'display_order' => 1,
        ]);
    });

    it('can create a subcategory', function () {
        $parent = Category::factory()->create();

        $response = $this->actingAs($this->admin)
            ->post('/admin/categories', [
                'name' => 'Subcategory',
                'description' => null,
                'parent_id' => $parent->id,
                'is_active' => true,
            ]);

        $response->assertRedirect('/admin/categories');

        $this->assertDatabaseHas('categories', [
            'name' => 'Subcategory',
            'parent_id' => $parent->id,
        ]);
    });

    it('assigns correct display order for siblings', function () {
        $parent = Category::factory()->create();
        Category::factory()->create(['parent_id' => $parent->id, 'display_order' => 5]);

        $response = $this->actingAs($this->admin)
            ->post('/admin/categories', [
                'name' => 'Second Child',
                'parent_id' => $parent->id,
            ]);

        $this->assertDatabaseHas('categories', [
            'name' => 'Second Child',
            'display_order' => 6,
        ]);
    });

    it('validates required name field', function () {
        $response = $this->actingAs($this->admin)
            ->post('/admin/categories', [
                'name' => '',
            ]);

        $response->assertSessionHasErrors('name');
    });

    it('validates parent_id exists', function () {
        $response = $this->actingAs($this->admin)
            ->post('/admin/categories', [
                'name' => 'Test',
                'parent_id' => 9999,
            ]);

        $response->assertSessionHasErrors('parent_id');
    });
});

// Update Tests
describe('Update', function () {
    it('can update category name', function () {
        $category = Category::factory()->create(['name' => 'Old Name']);

        $response = $this->actingAs($this->admin)
            ->put("/admin/categories/{$category->id}", [
                'name' => 'New Name',
                'is_active' => true,
            ]);

        $response->assertRedirect('/admin/categories');

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'New Name',
            'slug' => 'new-name',
        ]);
    });

    it('can change parent category', function () {
        $oldParent = Category::factory()->create();
        $newParent = Category::factory()->create();
        $category = Category::factory()->create(['parent_id' => $oldParent->id]);

        $response = $this->actingAs($this->admin)
            ->put("/admin/categories/{$category->id}", [
                'name' => $category->name,
                'parent_id' => $newParent->id,
                'is_active' => true,
            ]);

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'parent_id' => $newParent->id,
        ]);
    });

    it('can convert to root category', function () {
        $parent = Category::factory()->create();
        $category = Category::factory()->create(['parent_id' => $parent->id]);

        $response = $this->actingAs($this->admin)
            ->put("/admin/categories/{$category->id}", [
                'name' => $category->name,
                'parent_id' => null,
                'is_active' => true,
            ]);

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'parent_id' => null,
        ]);
    });

    it('cannot set category as its own parent', function () {
        $category = Category::factory()->create();

        $response = $this->actingAs($this->admin)
            ->put("/admin/categories/{$category->id}", [
                'name' => $category->name,
                'parent_id' => $category->id,
                'is_active' => true,
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('error');
    });

    it('cannot set descendant as parent (prevent circular reference)', function () {
        $grandparent = Category::factory()->create();
        $parent = Category::factory()->create(['parent_id' => $grandparent->id]);
        $child = Category::factory()->create(['parent_id' => $parent->id]);

        $response = $this->actingAs($this->admin)
            ->put("/admin/categories/{$grandparent->id}", [
                'name' => $grandparent->name,
                'parent_id' => $child->id,
                'is_active' => true,
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('error');
    });
});

// Delete Tests
describe('Delete', function () {
    it('can delete category without children or products', function () {
        $category = Category::factory()->create();

        $response = $this->actingAs($this->admin)
            ->delete("/admin/categories/{$category->id}");

        $response->assertRedirect('/admin/categories');
        $response->assertSessionHas('success');

        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    });

    it('cannot delete category with children', function () {
        $parent = Category::factory()->create();
        Category::factory()->create(['parent_id' => $parent->id]);

        $response = $this->actingAs($this->admin)
            ->delete("/admin/categories/{$parent->id}");

        $response->assertRedirect();
        $response->assertSessionHas('error');

        $this->assertDatabaseHas('categories', ['id' => $parent->id]);
    });

    it('cannot delete category with products', function () {
        $category = Category::factory()->create();
        Product::factory()->create(['category_id' => $category->id]);

        $response = $this->actingAs($this->admin)
            ->delete("/admin/categories/{$category->id}");

        $response->assertRedirect();
        $response->assertSessionHas('error');

        $this->assertDatabaseHas('categories', ['id' => $category->id]);
    });

    it('provides stats via API for delete confirmation', function () {
        $category = Category::factory()->create();
        Category::factory()->create(['parent_id' => $category->id]);
        Product::factory()->create(['category_id' => $category->id]);

        $response = $this->actingAs($this->admin)
            ->get("/admin/categories/{$category->id}/stats");

        $response->assertOk();
        $response->assertJson([
            'children_count' => 1,
            'products_count' => 1,
        ]);
    });
});

// Visibility Toggle Tests
describe('Toggle Visibility', function () {
    it('can toggle visibility via API', function () {
        $category = Category::factory()->create(['is_active' => true]);

        $response = $this->actingAs($this->admin)
            ->patch("/admin/categories/{$category->id}/visibility");

        $response->assertOk();
        $response->assertJson([
            'success' => true,
            'is_active' => false,
        ]);

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'is_active' => false,
        ]);
    });

    it('can reactivate hidden category', function () {
        $category = Category::factory()->create(['is_active' => false]);

        $response = $this->actingAs($this->admin)
            ->patch("/admin/categories/{$category->id}/visibility");

        $response->assertOk();
        $response->assertJson([
            'success' => true,
            'is_active' => true,
        ]);
    });
});

// Reorder Tests
describe('Reorder', function () {
    it('can reorder categories via drag-and-drop API', function () {
        $cat1 = Category::factory()->create(['display_order' => 1, 'parent_id' => null]);
        $cat2 = Category::factory()->create(['display_order' => 2, 'parent_id' => null]);
        $cat3 = Category::factory()->create(['display_order' => 3, 'parent_id' => null]);

        $response = $this->actingAs($this->admin)
            ->postJson('/admin/categories/reorder', [
                'items' => [
                    ['id' => $cat3->id, 'parent_id' => null, 'display_order' => 0],
                    ['id' => $cat1->id, 'parent_id' => null, 'display_order' => 1],
                    ['id' => $cat2->id, 'parent_id' => null, 'display_order' => 2],
                ],
            ]);

        $response->assertOk();
        $response->assertJson(['success' => true]);

        $this->assertDatabaseHas('categories', [
            'id' => $cat3->id,
            'display_order' => 0,
        ]);
    });

    it('can move category to new parent via reorder API', function () {
        $parent = Category::factory()->create();
        $child = Category::factory()->create(['parent_id' => null, 'display_order' => 1]);

        $response = $this->actingAs($this->admin)
            ->postJson('/admin/categories/reorder', [
                'items' => [
                    ['id' => $child->id, 'parent_id' => $parent->id, 'display_order' => 0],
                ],
            ]);

        $response->assertOk();

        $this->assertDatabaseHas('categories', [
            'id' => $child->id,
            'parent_id' => $parent->id,
        ]);
    });

    it('validates reorder items structure', function () {
        $response = $this->actingAs($this->admin)
            ->postJson('/admin/categories/reorder', [
                'items' => [
                    ['id' => 'invalid', 'parent_id' => null, 'display_order' => 0],
                ],
            ]);

        $response->assertStatus(422);
    });
});

// Customer-facing API Tests
describe('Customer-facing API', function () {
    it('categories API only returns active categories', function () {
        Category::factory()->create(['name' => 'Active', 'is_active' => true]);
        Category::factory()->create(['name' => 'Hidden', 'is_active' => false]);

        $response = $this->getJson('/api/categories');

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.name', 'Active');
    });

    it('products API excludes products from hidden categories', function () {
        $activeCategory = Category::factory()->create(['is_active' => true]);
        $hiddenCategory = Category::factory()->create(['is_active' => false]);

        Product::factory()->create([
            'name' => 'Visible Product',
            'category_id' => $activeCategory->id,
            'is_active' => true,
        ]);
        Product::factory()->create([
            'name' => 'Hidden Category Product',
            'category_id' => $hiddenCategory->id,
            'is_active' => true,
        ]);

        $response = $this->getJson('/api/products');

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.name', 'Visible Product');
    });

    it('featured products API excludes products from hidden categories', function () {
        $activeCategory = Category::factory()->create(['is_active' => true]);
        $hiddenCategory = Category::factory()->create(['is_active' => false]);

        Product::factory()->create([
            'category_id' => $activeCategory->id,
            'is_featured' => true,
            'is_active' => true,
        ]);
        Product::factory()->create([
            'category_id' => $hiddenCategory->id,
            'is_featured' => true,
            'is_active' => true,
        ]);

        $response = $this->getJson('/api/products/featured');

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
    });

    it('product detail API returns 404 for hidden category products', function () {
        $hiddenCategory = Category::factory()->create(['is_active' => false]);
        $product = Product::factory()->create([
            'category_id' => $hiddenCategory->id,
            'is_active' => true,
        ]);

        $response = $this->getJson("/api/products/{$product->id}");

        $response->assertNotFound();
    });
});
