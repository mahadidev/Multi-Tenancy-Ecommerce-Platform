<?php

namespace App\Modules\WebsiteBuilder\Jobs;

use App\Modules\WebsiteBuilder\Services\ThemeInstallationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class InstallThemeJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public array $installationOptions;
    
    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;
    
    /**
     * The maximum number of unhandled exceptions to allow before failing.
     */
    public int $maxExceptions = 2;
    
    /**
     * The number of seconds the job can run before timing out.
     */
    public int $timeout = 300; // 5 minutes

    /**
     * Create a new job instance.
     */
    public function __construct(array $installationOptions)
    {
        $this->installationOptions = $installationOptions;
    }

    /**
     * Execute the job.
     */
    public function handle(ThemeInstallationService $installationService): void
    {
        Log::info('Starting background theme installation', [
            'options' => $this->installationOptions,
            'job_id' => $this->job->getJobId()
        ]);

        try {
            $result = $installationService->installTheme($this->installationOptions);
            
            if ($result['success']) {
                Log::info('Theme installation completed successfully', [
                    'website_id' => $this->installationOptions['website_id'],
                    'theme_slug' => $this->installationOptions['theme_slug'],
                    'pages_created' => count($result['pages'])
                ]);
            } else {
                Log::error('Theme installation failed', [
                    'website_id' => $this->installationOptions['website_id'],
                    'theme_slug' => $this->installationOptions['theme_slug'],
                    'errors' => $result['errors']
                ]);
                
                $this->fail(new \Exception('Theme installation failed: ' . implode(', ', $result['errors'])));
            }
        } catch (\Exception $e) {
            Log::error('Theme installation job failed', [
                'website_id' => $this->installationOptions['website_id'],
                'theme_slug' => $this->installationOptions['theme_slug'],
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Theme installation job failed permanently', [
            'options' => $this->installationOptions,
            'error' => $exception->getMessage(),
            'attempts' => $this->attempts()
        ]);

        // Update installation status to failed
        $installationService = app(ThemeInstallationService::class);
        $websiteId = $this->installationOptions['website_id'];
        
        // This method should be added to the service
        $installationService->markInstallationAsFailed($websiteId, $exception->getMessage());
    }

    /**
     * Calculate the number of seconds to wait before retrying the job.
     */
    public function backoff(): array
    {
        return [10, 30, 60]; // Wait 10s, then 30s, then 60s between retries
    }
}