<?php

namespace App\Providers;

use App\Mail\Transport\SendLayerTransport;
use App\Services\OutscraperService;
use App\Services\ProductionApiService;
use App\Services\SkydropxService;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\ServiceProvider;
use Laravel\Passport\Passport;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(ProductionApiService::class, function () {
            $config = config('services.produccion');

            return new ProductionApiService(
                baseUrl: $config['base_url'],
                clientId: $config['client_id'],
                clientSecret: $config['client_secret'],
            );
        });

        $this->app->singleton(SkydropxService::class, function () {
            return new SkydropxService(
                baseUrl: config('services.skydropx.base_url'),
                apiKey: config('services.skydropx.api_key'),
                apiSecret: config('services.skydropx.api_secret')
            );
        });

        $this->app->singleton(OutscraperService::class, function () {
            return new OutscraperService(
                apiKey: config('services.outscraper.api_key') ?? '',
                baseUrl: config('services.outscraper.base_url') ?? 'https://api.outscraper.cloud',
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Passport::authorizationView(fn ($parameters) => view('mcp.authorize', $parameters));

        Mail::extend('sendlayer', function (array $config): SendLayerTransport {
            return new SendLayerTransport(
                endpoint: $config['endpoint'],
                apiKey: $config['key'] ?? '',
                timeout: $config['timeout'] ?? 15,
                connectTimeout: $config['connect_timeout'] ?? 5,
            );
        });
    }
}
