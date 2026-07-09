<?php

use App\Mcp\Servers\AdsServer;
use App\Mcp\Servers\BlogServer;
use App\Mcp\Servers\GoogleSearchServer;
use App\Mcp\Servers\ImageServer;
use App\Mcp\Servers\MarketingServer;
use Laravel\Mcp\Facades\Mcp;

// Mcp::web('/mcp/demo', \App\Mcp\Servers\PublicServer::class);

Mcp::oauthRoutes();

Mcp::web('/mcp/images', ImageServer::class)
    ->middleware('auth:api');

Mcp::web('/mcp/blog', BlogServer::class)
    ->middleware('auth:api');

Mcp::web('/mcp/marketing', MarketingServer::class)
    ->middleware('auth:api');

Mcp::web('/mcp/google-search', GoogleSearchServer::class)
    ->middleware('auth:api');

Mcp::web('/mcp/ads', AdsServer::class)
    ->middleware('auth:api');
