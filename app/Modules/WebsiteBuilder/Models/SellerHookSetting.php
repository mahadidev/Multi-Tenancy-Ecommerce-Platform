<?php

namespace App\Modules\WebsiteBuilder\Models;

use App\Models\Seller;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SellerHookSetting extends Model
{
    protected $fillable = [
        'seller_id',
        'hook_id',
        'is_enabled',
        'custom_handler',
        'settings',
        'priority'
    ];

    protected $casts = [
        'is_enabled' => 'boolean',
        'settings' => 'array',
        'priority' => 'integer'
    ];

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
     * Check if custom handler is configured
     */
    public function hasCustomHandler(): bool
    {
        return !empty($this->custom_handler);
    }

    /**
     * Get setting value
     */
    public function getSetting(string $key, $default = null)
    {
        return $this->settings[$key] ?? $default;
    }

    /**
     * Set setting value
     */
    public function setSetting(string $key, $value): void
    {
        $settings = $this->settings ?? [];
        $settings[$key] = $value;
        $this->settings = $settings;
        $this->save();
    }

    /**
     * Scope for enabled hooks
     */
    public function scopeEnabled($query)
    {
        return $query->where('is_enabled', true);
    }

    /**
     * Scope by priority
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('priority', 'asc');
    }
}