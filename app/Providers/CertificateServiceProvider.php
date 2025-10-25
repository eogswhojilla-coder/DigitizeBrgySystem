<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\CertificateGenerationService;

class CertificateServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton(CertificateGenerationService::class, function ($app) {
            return new CertificateGenerationService();
        });
    }

    public function boot()
    {
        //
    }
}