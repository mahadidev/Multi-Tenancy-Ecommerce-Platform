<?php

namespace App\Modules;

use Illuminate\Contracts\Foundation\Application;

abstract class BaseModule
{
    /**
     * The application instance
     */
    protected Application $app;

    public function __construct(Application $app)
    {
        $this->app = $app;
    }

    /**
     * Module name
     */
    abstract public function getName(): string;

    /**
     * Module version
     */
    abstract public function getVersion(): string;

    /**
     * Module description
     */
    abstract public function getDescription(): string;

    /**
     * Boot the module
     */
    public function boot(): void
    {
        // Override in child modules if needed
    }

    /**
     * Register the module services
     */
    public function register(): void
    {
        // Override in child modules if needed
    }

    /**
     * Get module configuration
     */
    public function getConfig(): array
    {
        return [];
    }

    /**
     * Get module routes
     */
    public function getRoutes(): array
    {
        return [];
    }

    /**
     * Get module migrations
     */
    public function getMigrations(): array
    {
        return [];
    }

    /**
     * Get module seeders
     */
    public function getSeeders(): array
    {
        return [];
    }

    /**
     * Get module dependencies
     */
    public function getDependencies(): array
    {
        return [];
    }

    /**
     * Check if module is enabled
     */
    public function isEnabled(): bool
    {
        return true;
    }
}