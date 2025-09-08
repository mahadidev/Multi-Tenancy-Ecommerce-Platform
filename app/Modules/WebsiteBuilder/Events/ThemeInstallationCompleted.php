<?php

namespace App\Modules\WebsiteBuilder\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ThemeInstallationCompleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $websiteId;
    public string $themeSlug;
    public int $pagesCreated;
    public array $data;

    /**
     * Create a new event instance.
     */
    public function __construct(int $websiteId, string $themeSlug, int $pagesCreated, array $data = [])
    {
        $this->websiteId = $websiteId;
        $this->themeSlug = $themeSlug;
        $this->pagesCreated = $pagesCreated;
        $this->data = $data;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("website.{$this->websiteId}.theme-installation"),
        ];
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'website_id' => $this->websiteId,
            'theme_slug' => $this->themeSlug,
            'status' => 'completed',
            'progress' => 100,
            'pages_created' => $this->pagesCreated,
            'message' => 'Theme installation completed successfully',
            'data' => $this->data,
            'timestamp' => now()->toISOString()
        ];
    }

    /**
     * Get the broadcast event name.
     */
    public function broadcastAs(): string
    {
        return 'theme.installation.completed';
    }
}