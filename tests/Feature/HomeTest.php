<?php

use App\Models\Product;
use App\Models\User;
use App\Services\VisitorLocationService;

it('renders the home page for guests', function () {
    $response = $this->get('/');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page->component('Home'));
});

it('shares merida promotion eligibility with inertia pages', function () {
    app()->instance(VisitorLocationService::class, new class extends VisitorLocationService
    {
        public function shouldShowMeridaPromotion(string $ip): bool
        {
            return true;
        }
    });

    $response = $this->get('/');

    $response->assertInertia(fn ($page) => $page
        ->component('Home')
        ->where('visitor.showMeridaPromo', true)
    );
});

it('shows the homepage benefit copy', function () {
    $homePage = file_get_contents(resource_path('js/Pages/Home.tsx'));

    expect($homePage)
        ->toContain('Para servicios de spa y masaje')
        ->toContain('Cuidado corporal formulado para terapeutas, centros de bienestar, spas y hoteles')
        ->toContain('Ingredientes con propósito')
        ->toContain('activos botánicos pensados para aportar deslizamiento, nutrición, calma o recuperación')
        ->toContain('Absorción agradable')
        ->toContain('Texturas cómodas que se integran a la piel sin sentirse pesadas');
});

it('shows the homepage footer handoff copy', function () {
    $homePage = file_get_contents(resource_path('js/Pages/Home.tsx'));

    expect($homePage)
        ->toContain('Cuidado corporal profesional hecho en México para spas, hoteles y salas de masaje')
        ->toContain('Explorar productos →');
});

it('keeps the homepage purchase path colorized with Ikonoverde tokens', function () {
    $homePage = file_get_contents(resource_path('js/Pages/Home.tsx'));
    $cssSource = file_get_contents(resource_path('css/app.css'));

    expect($homePage)
        ->toContain('Precio visible para todos')
        ->toContain('bg-[var(--iko-accent-mist)]')
        ->toContain('border-[var(--iko-accent-line)]')
        ->toContain('text-[var(--iko-accent-ink)]')
        ->and($cssSource)
        ->toContain('--iko-accent-mist: oklch(')
        ->toContain('--iko-accent-line: oklch(')
        ->toContain('--iko-accent-ink: oklch(')
        ->not->toContain('--iko-accent-mist: #');
});

it('passes featured products to the home page', function () {
    Product::factory(3)->create(['is_active' => true, 'is_featured' => true]);
    Product::factory(2)->create(['is_active' => false]);

    $response = $this->get('/');

    $response->assertInertia(fn ($page) => $page
        ->component('Home')
        ->has('featuredProducts', 3)
        ->has('featuredProducts.0', fn ($product) => $product
            ->has('id')
            ->has('slug')
            ->has('name')
            ->has('category')
            ->has('image_url')
            ->where('price', fn ($price) => is_numeric($price))
        )
    );
});

it('limits featured products to 4', function () {
    Product::factory(10)->create(['is_active' => true, 'is_featured' => true]);

    $response = $this->get('/');

    $response->assertInertia(fn ($page) => $page
        ->component('Home')
        ->has('featuredProducts', 4)
    );
});

it('does not include inactive products', function () {
    Product::factory(2)->create(['is_active' => false, 'is_featured' => true]);

    $response = $this->get('/');

    $response->assertInertia(fn ($page) => $page
        ->component('Home')
        ->has('featuredProducts', 0)
    );
});

it('renders the home page for authenticated users', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page->component('Home'));
});

it('passes banners to the home page', function () {
    $response = $this->get('/');

    $response->assertInertia(fn ($page) => $page
        ->component('Home')
        ->has('banners')
    );
});
