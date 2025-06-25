<?php
// app/Jobs/ProcessGitHubWebhook.php
namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessGitHubWebhook implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $payload;

    public function __construct(array $payload)
    {
        $this->payload = $payload;
    }

    public function handle()
    {
        // Process the webhook payload here
        $action = $this->payload['action'] ?? 'unknown';
        $repository = $this->payload['repository']['full_name'] ?? 'unknown';

        Log::info("Processing GitHub webhook. Action: {$action}, Repository: {$repository}");

        // Example:  Log the event and repository name
        // You would replace this with your actual logic
        // based on the webhook event type and payload data.

         if ($action === 'opened' && strpos($repository, 'your-org/your-repo') !== false) {
                // Handle new issue creation
                Log::info("New issue created in your-org/your-repo");
                // Add your specific logic here to handle the new issue
            }

    }
}
