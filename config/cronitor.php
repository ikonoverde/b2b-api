<?php

use App\Jobs\CreateBlogPost;

return [
    'enabled' => env('CRONITOR_ENABLED', true),
    'api_key' => env('CRONITOR_API_KEY'),
    'api_version' => env('CRONITOR_API_VERSION'),
    'environment' => env('CRONITOR_ENVIRONMENT'),

    // Applied to monitors created by `cronitor:sync`.
    'monitor_defaults' => [],

    // Ignore queue telemetry for matching raw names or resolved keys.
    'ignored_jobs' => [
        CreateBlogPost::class,
    ],

    // Ignore schedule sync + telemetry for matching task summaries or keys.
    'ignored_tasks' => [],
];
