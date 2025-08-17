<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Modules\ModuleServiceProvider;
use Illuminate\Support\Facades\File;

class ModuleCommand extends Command
{
    protected $signature = 'module {action} {module?}';
    protected $description = 'Manage application modules';

    public function handle()
    {
        $action = $this->argument('action');
        
        switch ($action) {
            case 'list':
                $this->listModules();
                break;
            case 'status':
                $this->showModuleStatus();
                break;
            case 'create':
                $this->createModule();
                break;
            default:
                $this->error('Invalid action. Available actions: list, status, create');
                break;
        }
    }

    protected function listModules()
    {
        // Get modules from config
        $config = config('modules.modules', []);
        
        if (empty($config)) {
            $this->info('No modules found.');
            return;
        }

        $this->info('Available Modules:');
        $this->line('');
        
        foreach ($config as $name => $moduleConfig) {
            $status = $moduleConfig['enabled'] ? '<fg=green>Enabled</fg=green>' : '<fg=red>Disabled</fg=red>';
            $this->line("• <fg=cyan>{$name}</fg=cyan> - {$status}");
            $this->line("  {$moduleConfig['description']}");
            $this->line('');
        }
    }

    protected function showModuleStatus()
    {
        // Get modules from config for now
        $config = config('modules.modules', []);
        
        $headers = ['Module', 'Status', 'Priority', 'Description'];
        $rows = [];
        
        foreach ($config as $name => $moduleConfig) {
            $status = $moduleConfig['enabled'] ? 'Enabled' : 'Disabled';
            
            $rows[] = [
                $name,
                $status,
                $moduleConfig['priority'] ?? 'N/A',
                $moduleConfig['description'] ?? 'N/A'
            ];
        }
        
        $this->table($headers, $rows);
    }

    protected function createModule()
    {
        $moduleName = $this->argument('module');
        
        if (!$moduleName) {
            $moduleName = $this->ask('Enter module name');
        }
        
        if (!$moduleName) {
            $this->error('Module name is required.');
            return;
        }
        
        $modulePath = app_path("Modules/{$moduleName}");
        
        if (File::exists($modulePath)) {
            $this->error("Module {$moduleName} already exists.");
            return;
        }
        
        // Create module directory structure
        $directories = [
            'Controllers',
            'Models', 
            'Services',
            'Requests',
            'Resources',
            'Routes',
            'Database/Migrations',
            'Database/Seeders',
            'Middleware',
            'Policies',
            'Tests'
        ];
        
        foreach ($directories as $dir) {
            File::makeDirectory("{$modulePath}/{$dir}", 0755, true);
        }
        
        // Create module class
        $moduleClass = $this->generateModuleClass($moduleName);
        File::put("{$modulePath}/{$moduleName}Module.php", $moduleClass);
        
        // Create routes files
        File::put("{$modulePath}/Routes/api.php", "<?php\n\n// API routes for {$moduleName} module\n");
        File::put("{$modulePath}/Routes/web.php", "<?php\n\n// Web routes for {$moduleName} module\n");
        
        $this->info("Module {$moduleName} created successfully!");
        $this->line("Location: {$modulePath}");
        $this->line("Don't forget to add the module to config/modules.php");
    }

    protected function generateModuleClass($moduleName)
    {
        return "<?php

namespace App\\Modules\\{$moduleName};

use App\\Modules\\BaseModule;

class {$moduleName}Module extends BaseModule
{
    public function getName(): string
    {
        return '{$moduleName}';
    }

    public function getVersion(): string
    {
        return '1.0.0';
    }

    public function getDescription(): string
    {
        return 'Module for {$moduleName} functionality';
    }

    public function boot(): void
    {
        // Boot module services
    }

    public function register(): void
    {
        // Register module services
    }

    public function getConfig(): array
    {
        return [];
    }

    public function getDependencies(): array
    {
        return [];
    }
}
";
    }
}