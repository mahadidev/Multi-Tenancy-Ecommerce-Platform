<?php

namespace App\Modules\WebsiteBuilder\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ThemeInstallationStarted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $websiteId;
    public string $themeSlug;
    public array $options;

    /**
     * Create a new event instance.
     */
    public function __construct(int $websiteId, string $themeSlug, array $options = [])
    {
        $this->websiteId = $websiteId;
        $this->themeSlug = $themeSlug;
        $this->options = $options;
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
            'status' => 'started',
            'progress' => 0,
            'message' => 'Theme installation has started',
            'timestamp' => now()->toISOString()
        ];
    }

    /**
     * Get the broadcast event name.
     */
    public function broadcastAs(): string
    {
        return 'theme.installation.started';
    }
}