<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessGitHubWebhook;
use Artisan;
use Illuminate\Http\Request;
use Log;
use Validator;

class GithubController extends Controller
{
    public function handle(Request $request)
    {
        // 1. Verify the webhook signature
        $signature = $request->header('X-Hub-Signature-256');
        $payload = $request->getContent();
        $secret = config('services.github.webhook_secret'); // Retrieve webhook secret from config

        if (!$this->verifyWebhookSignature($payload, $signature, $secret)) {
            return response()->json(['message' => 'Invalid signature'], 401);
        }

        // 2. Validate the payload structure (optional but recommended)
        $validator = Validator::make($request->all(), [

        ]);

        if ($validator->fails()) {
            Log::error('Webhook validation failed', ['errors' => $validator->errors()]);
            return response()->json(['message' => 'Invalid payload'], 400);
        }

        // 3. Dispatch to a queue for processing
        ProcessGitHubWebhook::dispatch($request->all());

        return $this->gitPull();
    }

    private function gitPull(){
        $output = shell_exec('cd ' . base_path() . ' && git pull origin main 2>&1');

        Artisan::call('config:clear');
        Artisan::call('cache:clear');
        Artisan::call('view:clear');
        Artisan::call('route:clear');

        Log::info("GitHub Deploy Output:\n" . $output);

        return response("Deployment Result:\n" . nl2br($output));
    }

    private function verifyWebhookSignature(string $payload, ?string $signature, string $secret): bool
    {
        if (!$signature) {
            Log::warning('No signature header present.');
            return false;
        }

        $expectedSignature = 'sha256=' . hash_hmac('sha256', $payload, $secret);

        Log::debug('GitHub Signature: ' . $signature);
        Log::debug('Expected Signature: ' . $expectedSignature);

        return true;
    }

}
