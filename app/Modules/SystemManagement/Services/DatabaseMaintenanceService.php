<?php

namespace App\Modules\SystemManagement\Services;

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;

class DatabaseMaintenanceService
{
    /**
     * Ensure core tables exist and recreate them if missing
     */
    public static function ensureCoreTables(): void
    {
        $coreTables = [
            'cache' => 'database/migrations/core/0001_01_01_000001_create_cache_table.php',
            'jobs' => 'database/migrations/core/0001_01_01_000002_create_jobs_table.php',
            'request_logs' => 'database/migrations/core/2024_12_28_145345_create_request_logs_table.php',
        ];

        foreach ($coreTables as $table => $migrationPath) {
            if (!Schema::hasTable($table)) {
                Log::warning("Core table '{$table}' missing, recreating...");
                try {
                    Artisan::call('migrate', [
                        '--path' => $migrationPath,
                        '--force' => true
                    ]);
                    Log::info("Successfully recreated table '{$table}'");
                } catch (\Exception $e) {
                    Log::error("Failed to recreate table '{$table}': " . $e->getMessage());
                }
            }
        }
    }

    /**
     * Check if cache table exists, create if missing
     */
    public static function ensureCacheTable(): bool
    {
        if (!Schema::hasTable('cache')) {
            try {
                Artisan::call('migrate', [
                    '--path' => 'database/migrations/core/0001_01_01_000001_create_cache_table.php',
                    '--force' => true
                ]);
                return true;
            } catch (\Exception $e) {
                Log::error('Failed to create cache table: ' . $e->getMessage());
                return false;
            }
        }
        return true;
    }
}