<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Shop Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains configuration settings for the shop functionality
    | including shipping costs, tax rates, and other business rules.
    |
    */

    'shipping_cost' => env('SHOP_SHIPPING_COST', 10.00),

    'shipping_origin_postal_code' => env('SHOP_ORIGIN_POSTAL_CODE', '06600'),

    'shipping_origin' => [
        'name' => env('SHOP_ORIGIN_NAME', 'Ikono'),
        'street' => env('SHOP_ORIGIN_STREET', ''),
        'phone' => env('SHOP_ORIGIN_PHONE', ''),
        'email' => env('SHOP_ORIGIN_EMAIL', ''),
        'postal_code' => '97130',
        'state' => 'Yucatán',
        'city' => 'Mérida',
        'neighborhood' => 'Altabrisa',
    ],

    'default_parcel' => [
        'weight_kg' => 1.0,
        'width_cm' => 20.0,
        'height_cm' => 15.0,
        'depth_cm' => 10.0,
    ],

];
