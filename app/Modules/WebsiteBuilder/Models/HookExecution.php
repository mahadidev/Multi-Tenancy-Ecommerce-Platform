<?php

namespace App\Modules\WebsiteBuilder\Models;

use App\Models\Seller;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HookExecution extends Model
{
    protected $fillable = [
        'seller_id',
        'hook_id',
        'session_id',
        'payload',
        'response',
        'execution_time',
        'success',
        'error_message',
        'ip_address',
        'user_agent'
    ];

    protected $casts = [
        'payload' => 'array',
        'response' => 'array',
        'execution_time' => 'integer',
        'success' => 'boolean'
    ];

    public $timestamps = false;

    protected $dates = ['created_at'];

    /**
     * Get the seller
     */
    public function seller(): BelongsTo
    {
        return $this->belongsTo(Seller::class);
    }

    /**
     * Get the hook
     */
    public function hook(): BelongsTo
    {
        return $this->belongsTo(ThemeHook::class, 'hook_id');
    }

    /**
     * Get execution time in seconds
     */
    public function getExecutionTimeInSecondsAttribute(): float
    {
        return $this->execution_time / 1000;
    }

    /**
     * Check if execution was slow
     */
    public function isSlow(int $thresholdMs = 1000): bool
    {
        return $this->execution_time > $thresholdMs;
    }

    /**
     * Scope for successful executions
     */
    public function scopeSuccessful($query)
    {
        return $query->where('success', true);
    }

    /**
     * Scope for failed executions
     */
    public function scopeFailed($query)
    {
        return $query->where('success', false);
    }

    /**
     * Scope for slow executions
     */
    public function scopeSlow($query, int $thresholdMs = 1000)
    {
        return $query->where('execution_time', '>', $thresholdMs);
    }

    /**
     * Scope by date range
     */
    public function scopeDateRange($query, $from, $to)
    {
        return $query->whereBetween('created_at', [$from, $to]);
    }
}