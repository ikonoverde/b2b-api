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

    'default_parcel' => [
        'weight_kg' => 1.0,
        'width_cm' => 20.0,
        'height_cm' => 15.0,
        'depth_cm' => 10.0,
    ],

];
