<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\Cors;
use App\Http\Middleware\LogRequests;
use App\Http\Middleware\StoreMiddleware;
use App\Http\Middleware\TrackStoreVisitor;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->append(Cors::class);
        $middleware->append(TrackStoreVisitor::class);
        $middleware->append(LogRequests::class);
        $middleware->alias([
            'store' => StoreMiddleware::class,
        ]);
        $middleware->api(prepend: [
            \Illuminate\Session\Middleware\StartSession::class,
        ]);
        // Default middleware
        $middleware->web([
            \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
