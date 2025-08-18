<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\Cors;
use App\Http\Middleware\LogRequests;
use App\Http\Middleware\StoreMiddleware;
use App\Http\Middleware\TrackStoreVisitor;
use App\Http\Middleware\CheckCustomPermission;
use App\Http\Middleware\CheckCustomRole;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->validateCsrfTokens(except: [
            '/success','/cancel','/fail','/ipn',
            'api/*',
            'sanctum/csrf-cookie'
        ]);
        $middleware->append(Cors::class);
        $middleware->append(TrackStoreVisitor::class);
        $middleware->append(LogRequests::class);
        $middleware->alias([
            'store' => StoreMiddleware::class,
            'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
            'custom.role' => CheckCustomRole::class,
            'custom.permission' => CheckCustomPermission::class,
            // Legacy Spatie middleware (deprecated)
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
            'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
        ]);
        $middleware->api(prepend: [
            \Illuminate\Session\Middleware\StartSession::class,
        ]);
        // Default middleware
        // $middleware->api([
        //     \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
        // ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
