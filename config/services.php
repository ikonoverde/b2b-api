<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'produccion' => [
        'base_url' => env('PRODUCCION_URL', 'http://127.0.0.1:8000'),
        'client_id' => env('PRODUCCION_CLIENT'),
        'client_secret' => env('PRODUCCION_SECRET'),
    ],

    'skydropx' => [
        'api_key' => env('SKYDROPX_API_KEY'),
        'api_secret' => env('SKYDROPX_API_SECRET'),
        'base_url' => env('SKYDROPX_BASE_URL', 'https://sb-pro.skydropx.com/api/v1'),
    ],

    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect' => env('GOOGLE_REDIRECT_URI', '/auth/google/callback'),
    ],

    'google_analytics' => [
        'measurement_id' => env('GOOGLE_ANALYTICS_MEASUREMENT_ID'),
        'credentials_path' => env('GOOGLE_ANALYTICS_CREDENTIALS_PATH'),
        'credentials_json' => env('GOOGLE_ANALYTICS_CREDENTIALS_JSON'),
        'default_property_id' => env('GOOGLE_ANALYTICS_PROPERTY_ID'),
    ],

    'meta_graph' => [
        'access_token' => env('META_GRAPH_ACCESS_TOKEN'),
        'api_version' => env('META_GRAPH_API_VERSION', 'v21.0'),
        'page_id' => env('META_PAGE_ID'),
        'instagram_business_account_id' => env('META_INSTAGRAM_BUSINESS_ACCOUNT_ID'),
        'base_url' => env('META_GRAPH_BASE_URL', 'https://graph.facebook.com'),
    ],

    'meta_pixel' => [
        'pixel_id' => env('META_PIXEL_ID'),
        'conversions_api_access_token' => env('META_CONVERSIONS_API_ACCESS_TOKEN'),
        'api_version' => env('META_CONVERSIONS_API_VERSION', 'v21.0'),
        'test_event_code' => env('META_CONVERSIONS_API_TEST_EVENT_CODE'),
        'currency' => env('META_PIXEL_CURRENCY', 'MXN'),
    ],

    'outscraper' => [
        'api_key' => env('OUTSCRAPER_API_KEY'),
        'base_url' => env('OUTSCRAPER_BASE_URL', 'https://api.outscraper.cloud'),
        'limit' => env('OUTSCRAPER_LIMIT_LIMIT', 500),
    ],

    'dataforseo' => [
        'login' => env('DATAFORSEO_LOGIN'),
        'password' => env('DATAFORSEO_PASSWORD'),
        'base_url' => env('DATAFORSEO_BASE_URL', 'https://api.dataforseo.com'),
    ],

    'serpapi' => [
        'api_key' => env('SERPAPI_API_KEY'),
        'base_url' => env('SERPAPI_BASE_URL', 'https://serpapi.com'),
    ],

    'google_search_console' => [
        'site_url' => env('GOOGLE_SEARCH_CONSOLE_SITE_URL'),
        'credentials_path' => env('GOOGLE_SEARCH_CONSOLE_CREDENTIALS_PATH'),
        'credentials_json' => env('GOOGLE_SEARCH_CONSOLE_CREDENTIALS_JSON'),
    ],

    'google_ads' => [
        'developer_token' => env('GOOGLE_ADS_DEVELOPER_TOKEN'),
        'customer_id' => env('GOOGLE_ADS_CUSTOMER_ID'),
        'login_customer_id' => env('GOOGLE_ADS_LOGIN_CUSTOMER_ID'),
        'client_id' => env('GOOGLE_ADS_CLIENT_ID'),
        'client_secret' => env('GOOGLE_ADS_CLIENT_SECRET'),
        'refresh_token' => env('GOOGLE_ADS_REFRESH_TOKEN'),
        'base_url' => env('GOOGLE_ADS_BASE_URL', 'https://googleads.googleapis.com'),
        'api_version' => env('GOOGLE_ADS_API_VERSION', 'v22'),
    ],

    'semrush' => [
        'api_key' => env('SEMRUSH_API_KEY'),
        'base_url' => env('SEMRUSH_BASE_URL', 'https://api.semrush.com'),
    ],

    'ahrefs' => [
        'api_key' => env('AHREFS_API_KEY'),
        'base_url' => env('AHREFS_BASE_URL', 'https://api.ahrefs.com'),
    ],

];
