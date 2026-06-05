<?php

use App\Models\User;

it('prevents guests from viewing scribe routes', function (string $routeName) {
    $this->get(route($routeName))->assertRedirect(route('login'));
})->with([
    'docs' => 'scribe',
    'postman collection' => 'scribe.postman',
    'openapi spec' => 'scribe.openapi',
]);

it('prevents customers from viewing scribe routes', function (string $routeName) {
    $user = User::factory()->create();

    $this->actingAs($user)->get(route($routeName))->assertForbidden();
})->with([
    'docs' => 'scribe',
    'postman collection' => 'scribe.postman',
    'openapi spec' => 'scribe.openapi',
]);

it('allows admins to view scribe documentation', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)->get(route('scribe'))->assertOk();
});
