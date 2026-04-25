<?php

namespace App\Providers;

use App\Services\OutscraperService;
use App\Services\ProductionApiService;
use App\Services\SkydropxService;
use Illuminate\Support\ServiceProvider;
use OutscraperClient;

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

        $this->app->singleton(OutscraperClient::class, function () {
            return new OutscraperClient(config('services.outscraper.api_key') ?? '');
        });

        $this->app->singleton(OutscraperService::class, function ($app) {
            return new OutscraperService($app->make(OutscraperClient::class));
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
