<?php

use App\Models\User;
use Illuminate\Support\Facades\Gate;

it('allows super admin users to view horizon', function () {
    $user = User::factory()->superAdmin()->create();

    expect(Gate::forUser($user)->allows('viewHorizon'))->toBeTrue();
});

it('denies non super admin users from viewing horizon', function (string $role) {
    $user = User::factory()->create(['role' => $role]);

    expect(Gate::forUser($user)->allows('viewHorizon'))->toBeFalse();
})->with([
    'customer' => 'customer',
    'admin' => 'admin',
]);

it('denies guests from viewing horizon', function () {
    expect(Gate::allows('viewHorizon'))->toBeFalse();
});
