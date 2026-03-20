<?php

use App\Models\User;
use Laravel\Socialite\Contracts\User as SocialiteUser;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\GoogleProvider;

function mockSocialiteUser(string $id = 'google-123', string $name = 'Test User', string $email = 'test@example.com'): void
{
    $socialiteUser = Mockery::mock(SocialiteUser::class);
    $socialiteUser->shouldReceive('getId')->andReturn($id);
    $socialiteUser->shouldReceive('getName')->andReturn($name);
    $socialiteUser->shouldReceive('getEmail')->andReturn($email);

    $provider = Mockery::mock(GoogleProvider::class);
    $provider->shouldReceive('user')->andReturn($socialiteUser);

    Socialite::shouldReceive('driver')->with('google')->andReturn($provider);
}

describe('GET /auth/google', function () {
    it('redirects to Google', function () {
        $provider = Mockery::mock(GoogleProvider::class);
        $provider->shouldReceive('redirect')->andReturn(redirect('https://accounts.google.com'));

        Socialite::shouldReceive('driver')->with('google')->andReturn($provider);

        $response = $this->get('/auth/google');

        $response->assertRedirect();
    });
});

describe('GET /auth/google/callback', function () {
    it('logs in an existing user by google_id', function () {
        $user = User::factory()->withGoogle('google-123')->create();

        mockSocialiteUser('google-123', 'Test User', 'other@example.com');

        $response = $this->get('/auth/google/callback');

        $response->assertRedirect(route('dashboard'));
        $this->assertAuthenticatedAs($user);
    });

    it('logs in an existing user by email and links google_id', function () {
        $user = User::factory()->create(['email' => 'test@example.com']);

        expect($user->google_id)->toBeNull();

        mockSocialiteUser('google-456', 'Test User', 'test@example.com');

        $response = $this->get('/auth/google/callback');

        $response->assertRedirect(route('dashboard'));
        $this->assertAuthenticatedAs($user);
        expect($user->fresh()->google_id)->toBe('google-456');
    });

    it('rejects inactive users', function () {
        User::factory()->inactive()->withGoogle('google-123')->create();

        mockSocialiteUser('google-123');

        $response = $this->get('/auth/google/callback');

        $response->assertRedirect(route('login'));
        $response->assertSessionHasErrors('google');
        $this->assertGuest();
    });

    it('does not link google_id to inactive users found by email', function () {
        $user = User::factory()->inactive()->create(['email' => 'inactive@example.com']);

        mockSocialiteUser('google-999', 'Inactive User', 'inactive@example.com');

        $response = $this->get('/auth/google/callback');

        $response->assertRedirect(route('login'));
        $response->assertSessionHasErrors('google');
        $this->assertGuest();
        expect($user->fresh()->google_id)->toBeNull();
    });

    it('redirects new users to complete registration', function () {
        mockSocialiteUser('google-789', 'New User', 'new@example.com');

        $response = $this->get('/auth/google/callback');

        $response->assertRedirect(route('google.complete-registration'));
        expect(session('google_user'))->toBe([
            'id' => 'google-789',
            'name' => 'New User',
            'email' => 'new@example.com',
        ]);
    });

    it('redirects to login on Google auth failure', function () {
        $provider = Mockery::mock(GoogleProvider::class);
        $provider->shouldReceive('user')->andThrow(new \Exception('Google error'));

        Socialite::shouldReceive('driver')->with('google')->andReturn($provider);

        $response = $this->get('/auth/google/callback');

        $response->assertRedirect(route('login'));
        $response->assertSessionHasErrors('google');
    });
});

describe('GET /auth/google/complete-registration', function () {
    it('shows the form when session has google data', function () {
        $response = $this->withSession([
            'google_user' => ['id' => 'g-1', 'name' => 'Test', 'email' => 'test@example.com'],
        ])->get('/auth/google/complete-registration');

        $response->assertSuccessful();
        $response->assertInertia(fn ($page) => $page
            ->component('Auth/GoogleCompleteRegistration')
            ->has('googleName')
            ->has('googleEmail')
        );
    });

    it('redirects to login when session is missing', function () {
        $response = $this->get('/auth/google/complete-registration');

        $response->assertRedirect(route('login'));
    });
});

describe('POST /auth/google/complete-registration', function () {
    it('creates user and logs in', function () {
        $response = $this->withSession([
            'google_user' => ['id' => 'g-1', 'name' => 'Spa Test', 'email' => 'spa@example.com'],
        ])->post('/auth/google/complete-registration', [
            'name' => 'Mi Spa',
            'rfc' => 'XAXX010101000',
            'phone' => '5551234567',
            'terms_accepted' => true,
        ]);

        $response->assertRedirect(route('dashboard'));

        $user = User::where('email', 'spa@example.com')->first();
        expect($user)->not->toBeNull();
        expect($user->google_id)->toBe('g-1');
        expect($user->name)->toBe('Mi Spa');
        expect($user->rfc)->toBe('XAXX010101000');
        expect($user->password)->toBeNull();
        $this->assertAuthenticatedAs($user);
    });

    it('redirects to login when session is missing', function () {
        $response = $this->post('/auth/google/complete-registration', [
            'name' => 'Mi Spa',
            'rfc' => 'XAXX010101000',
            'phone' => '5551234567',
            'terms_accepted' => true,
        ]);

        $response->assertRedirect(route('login'));
        $this->assertGuest();
    });

    it('validates required fields', function () {
        $response = $this->withSession([
            'google_user' => ['id' => 'g-1', 'name' => 'Test', 'email' => 'test@example.com'],
        ])->post('/auth/google/complete-registration', []);

        $response->assertSessionHasErrors(['name', 'rfc', 'phone', 'terms_accepted']);
    });

    it('validates RFC format', function () {
        $response = $this->withSession([
            'google_user' => ['id' => 'g-1', 'name' => 'Test', 'email' => 'test@example.com'],
        ])->post('/auth/google/complete-registration', [
            'name' => 'Mi Spa',
            'rfc' => 'INVALID',
            'phone' => '5551234567',
            'terms_accepted' => true,
        ]);

        $response->assertSessionHasErrors('rfc');
    });

    it('uses email from session not user input', function () {
        $response = $this->withSession([
            'google_user' => ['id' => 'g-1', 'name' => 'Test', 'email' => 'real@example.com'],
        ])->post('/auth/google/complete-registration', [
            'name' => 'Mi Spa',
            'rfc' => 'XAXX010101000',
            'phone' => '5551234567',
            'terms_accepted' => true,
            'email' => 'spoofed@example.com',
        ]);

        $response->assertRedirect(route('dashboard'));

        $user = User::where('google_id', 'g-1')->first();
        expect($user->email)->toBe('real@example.com');
    });
});
