<?php

namespace App\Modules\WebsiteBuilder\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WebsitePageView extends Model
{
    protected $fillable = [
        'website_id',
        'page_id',
        'path',
        'ip_address',
        'user_agent',
        'referrer',
        'viewed_at',
        'session_duration',
    ];

    protected $casts = [
        'viewed_at' => 'datetime',
    ];

    public function website(): BelongsTo
    {
        return $this->belongsTo(StoreWebsite::class, 'website_id');
    }

    public function page(): BelongsTo
    {
        return $this->belongsTo(WebsitePage::class, 'page_id');
    }

    public function scopeToday($query)
    {
        return $query->whereDate('viewed_at', today());
    }

    public function scopeThisWeek($query)
    {
        return $query->whereBetween('viewed_at', [now()->startOfWeek(), now()->endOfWeek()]);
    }

    public function scopeThisMonth($query)
    {
        return $query->whereMonth('viewed_at', now()->month)
                     ->whereYear('viewed_at', now()->year);
    }

    public function scopeUnique($query)
    {
        return $query->distinct('ip_address');
    }

    public function getSessionDurationHumanAttribute(): string
    {
        if (!$this->session_duration) {
            return '0s';
        }
        
        $duration = $this->session_duration;
        
        if ($duration < 60) {
            return $duration . 's';
        } elseif ($duration < 3600) {
            return floor($duration / 60) . 'm ' . ($duration % 60) . 's';
        } else {
            $hours = floor($duration / 3600);
            $minutes = floor(($duration % 3600) / 60);
            $seconds = $duration % 60;
            return $hours . 'h ' . $minutes . 'm ' . $seconds . 's';
        }
    }
}