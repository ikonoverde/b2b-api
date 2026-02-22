<?php

it('admin dashboard route has admin prefix', function () {
    expect(route('admin.dashboard'))->toContain('/admin');
});

it('admin login route has admin prefix', function () {
    expect(route('admin.login'))->toContain('/admin/login');
});

it('admin products route has admin prefix', function () {
    expect(route('admin.products'))->toContain('/admin/products');
});

it('admin logout route has admin prefix', function () {
    expect(route('admin.logout'))->toContain('/admin/logout');
});

it('customer routes do not have admin prefix', function () {
    expect(route('home'))->not->toContain('/admin');
    expect(route('catalog'))->not->toContain('/admin');
    expect(route('login'))->not->toContain('/admin');
    expect(route('register'))->not->toContain('/admin');
    expect(route('dashboard'))->not->toContain('/admin');
});
