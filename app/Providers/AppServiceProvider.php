<?php

namespace App\Providers;

use App\Services\ProductionApiService;
use Illuminate\Support\ServiceProvider;

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
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
