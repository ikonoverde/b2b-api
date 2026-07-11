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

    /*
    | The timezone the business operates in. Timestamps are stored in UTC, so
    | reporting must convert calendar-day boundaries through this timezone to
    | bucket orders into the correct business day.
    */

    'timezone' => env('SHOP_TIMEZONE', 'America/Merida'),

    /*
    | Identifies this storefront on the Stripe account shared with the retail
    | site. Stripe broadcasts every event to every endpoint on the account, so
    | this key is stamped onto Stripe metadata at checkout and checked again on
    | the way back in to discard events belonging to the other storefront.
    */

    'site_key' => env('SHOP_SITE_KEY', 'pro'),

    'shipping_cost' => env('SHOP_SHIPPING_COST', 150.00),

    'shipping_origin_postal_code' => env('SHOP_ORIGIN_POSTAL_CODE', '06600'),

    'shipping_origin' => [
        'name' => env('SHOP_ORIGIN_NAME', 'Sandra Morales Olvera'),
        'street' => env('SHOP_ORIGIN_STREET', 'Calle 27 223A'),
        'phone' => env('SHOP_ORIGIN_PHONE', '9995340996'),
        'email' => env('SHOP_ORIGIN_EMAIL', 'moeric@gmail.com'),
        'reference' => env('SHOP_ORIGIN_REFERENCE', 'Bodega'),
        'postal_code' => '97345',
        'state' => 'Yucatán',
        'city' => 'Conkal',
        'neighborhood' => 'San Diego Cutz Dos',
    ],

    'default_parcel' => [
        'weight_kg' => 1.0,
        'width_cm' => 20.0,
        'height_cm' => 15.0,
        'depth_cm' => 10.0,
    ],

    'visitor_location' => [
        'database_path' => env('GEOIP_DATABASE_PATH', storage_path('app/geoip/GeoLite2-City.mmdb')),
        'download_url' => env('GEOIP_DOWNLOAD_URL', 'https://download.maxmind.com/app/geoip_download'),
        'license_key' => env('MAXMIND_LICENSE_KEY'),
        'cache_ttl' => env('GEOIP_CACHE_TTL', 86400),
        'merida_promotion' => [
            'enabled' => env('MERIDA_PROMOTION_ENABLED', true),
            'local_override' => env('MERIDA_PROMOTION_LOCAL_OVERRIDE', false),
            'country' => env('MERIDA_PROMOTION_COUNTRY', 'MX'),
            'region' => env('MERIDA_PROMOTION_REGION', 'Yucatán'),
        ],
    ],

];
