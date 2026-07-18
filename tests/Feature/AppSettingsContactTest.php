<?php

declare(strict_types=1);

use App\Models\AppSettings;
use Illuminate\Support\Facades\DB;

/**
 * Admins type the contact phone freehand in Ajustes, so the wa.me link has to survive whatever
 * spacing and punctuation they use — and refuse to build a link it cannot vouch for.
 */
test('it builds a wa.me link from a freehand phone number', function (?string $phone, ?string $expected) {
    AppSettings::current()->update(['contact_phone' => $phone]);

    expect(AppSettings::current()->whatsappUrl())->toBe($expected);
})->with([
    'ten digits get the Mexican country code' => ['984 156 9014', 'https://wa.me/529841569014'],
    'punctuation is stripped' => ['(984) 156-9014', 'https://wa.me/529841569014'],
    'an existing country code is kept' => ['+52 984 156 9014', 'https://wa.me/529841569014'],
    'a foreign number is left alone' => ['+1 415 555 2671', 'https://wa.me/14155552671'],
    'too short to dial' => ['156 9014', null],
    'too long to dial' => ['1234567890123456', null],
    'blank' => [null, null],
]);

test('the footer contact prop is shared on public pages', function () {
    AppSettings::current()->update(['contact_phone' => '984 156 9014']);

    $this->get('/')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->where('contact.phone', '984 156 9014')
            ->where('contact.whatsappUrl', 'https://wa.me/529841569014')
        );
});

/**
 * The settings row is cached, so the risk worth pinning is a stale storefront: an admin saves a
 * new number in Ajustes and the footer keeps advertising the old one.
 */
test('saving new settings invalidates the cached row', function () {
    AppSettings::current()->update(['contact_phone' => '984 156 9014']);

    $this->get('/')->assertInertia(fn ($page) => $page->where('contact.phone', '984 156 9014'));

    AppSettings::current()->update(['contact_phone' => '999 111 2233']);

    $this->get('/')
        ->assertInertia(fn ($page) => $page
            ->where('contact.phone', '999 111 2233')
            ->where('contact.whatsappUrl', 'https://wa.me/529991112233')
        );
});

test('the cached row is only fetched once per request cycle', function () {
    AppSettings::current();

    DB::enableQueryLog();

    AppSettings::current();
    AppSettings::current();

    expect(DB::getQueryLog())->toBeEmpty();
});

test('a blank phone shares no link for the footer to render', function () {
    AppSettings::current()->update(['contact_phone' => null]);

    $this->get('/')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->where('contact.phone', null)
            ->where('contact.whatsappUrl', null)
        );
});
