<?php

namespace App\Modules;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\File;

class ModuleServiceProvider extends ServiceProvider
{
    protected array $modules = [];

    /**
     * Register services.
     */
    public function register(): void
    {
        $this->loadModules();
        $this->registerModules();
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $this->bootModules();
        $this->loadModuleRoutes();
        $this->loadModuleMigrations();
        $this->loadModuleViews();
        $this->loadModuleTranslations();
    }

    /**
     * Load all modules
     */
    protected function loadModules(): void
    {
        $modulesPath = app_path('Modules');
        
        if (!File::exists($modulesPath)) {
            return;
        }

        $moduleDirs = File::directories($modulesPath);
        
        foreach ($moduleDirs as $moduleDir) {
            $moduleName = basename($moduleDir);
            $moduleClass = "App\\Modules\\{$moduleName}\\{$moduleName}Module";
            
            if (class_exists($moduleClass)) {
                $this->modules[$moduleName] = new $moduleClass($this->app);
            }
        }
    }

    /**
     * Register all modules
     */
    protected function registerModules(): void
    {
        foreach ($this->modules as $module) {
            if ($module->isEnabled()) {
                $module->register();
            }
        }
    }

    /**
     * Boot all modules
     */
    protected function bootModules(): void
    {
        foreach ($this->modules as $module) {
            if ($module->isEnabled()) {
                $module->boot();
            }
        }
    }

    /**
     * Load module routes
     */
    protected function loadModuleRoutes(): void
    {
        foreach ($this->modules as $moduleName => $module) {
            if (!$module->isEnabled()) {
                continue;
            }

            $routesPath = app_path("Modules/{$moduleName}/Routes");
            
            if (File::exists($routesPath)) {
                // Load API routes
                $apiRoutesFile = "{$routesPath}/api.php";
                if (File::exists($apiRoutesFile)) {
                    $this->loadRoutesFrom($apiRoutesFile);
                }

                // Load web routes
                $webRoutesFile = "{$routesPath}/web.php";
                if (File::exists($webRoutesFile)) {
                    $this->loadRoutesFrom($webRoutesFile);
                }
            }
        }
    }

    /**
     * Load module migrations
     */
    protected function loadModuleMigrations(): void
    {
        foreach ($this->modules as $moduleName => $module) {
            if (!$module->isEnabled()) {
                continue;
            }

            $migrationsPath = app_path("Modules/{$moduleName}/Database/Migrations");
            
            if (File::exists($migrationsPath)) {
                $this->loadMigrationsFrom($migrationsPath);
            }
        }
    }

    /**
     * Load module views
     */
    protected function loadModuleViews(): void
    {
        foreach ($this->modules as $moduleName => $module) {
            if (!$module->isEnabled()) {
                continue;
            }

            $viewsPath = app_path("Modules/{$moduleName}/Resources/Views");
            
            if (File::exists($viewsPath)) {
                $this->loadViewsFrom($viewsPath, strtolower($moduleName));
            }
        }
    }

    /**
     * Load module translations
     */
    protected function loadModuleTranslations(): void
    {
        foreach ($this->modules as $moduleName => $module) {
            if (!$module->isEnabled()) {
                continue;
            }

            $langPath = app_path("Modules/{$moduleName}/Resources/Lang");
            
            if (File::exists($langPath)) {
                $this->loadTranslationsFrom($langPath, strtolower($moduleName));
            }
        }
    }

    /**
     * Get loaded modules
     */
    public function getModules(): array
    {
        return $this->modules;
    }

    /**
     * Get module by name
     */
    public function getModule(string $name): ?BaseModule
    {
        return $this->modules[$name] ?? null;
    }
}