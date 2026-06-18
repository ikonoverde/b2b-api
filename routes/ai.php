<?php

use App\Mcp\Servers\ImageServer;
use Laravel\Mcp\Facades\Mcp;

// Mcp::web('/mcp/demo', \App\Mcp\Servers\PublicServer::class);

Mcp::oauthRoutes();

Mcp::web('/mcp/images', ImageServer::class)
    ->middleware('auth:api');
