<?php

namespace App\Modules\Authentication;

use App\Modules\BaseModule;

class AuthenticationModule extends BaseModule
{
    public function getName(): string
    {
        return 'Authentication';
    }

    public function getVersion(): string
    {
        return '1.0.0';
    }

    public function getDescription(): string
    {
        return 'Handles user authentication, registration, email verification, and password management';
    }

    public function boot(): void
    {
        // Register module-specific middleware
        $this->registerMiddleware();
        
        // Register module-specific events
        $this->registerEvents();
    }

    public function register(): void
    {
        // Register module services
        $this->app->singleton('authentication.service', function () {
            return new Services\AuthenticationService();
        });
    }

    protected function registerMiddleware(): void
    {
        // Register authentication middleware if needed
    }

    protected function registerEvents(): void
    {
        // Register authentication events
    }

    public function getConfig(): array
    {
        return [
            'email_verification_enabled' => true,
            'social_login_enabled' => true,
            'password_reset_enabled' => true,
            'session_timeout' => 120, // minutes
        ];
    }

    public function getDependencies(): array
    {
        return [];
    }
}