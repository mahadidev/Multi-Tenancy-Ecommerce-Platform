<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use Illuminate\Database\Schema\Builder;
use Illuminate\Support\Facades\Schema;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Builder::defaultStringLength(191);
        Schema::defaultStringLength(125);

        $user = auth()->user();
        Gate::define('viewPulse', function ($user) {
            return $user->isAdmin();
        });
    }
}
