<?php

namespace App\Modules\WebsiteBuilder\Models;

use App\Models\Seller;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ThemeAsset extends Model
{
    protected $fillable = [
        'theme_id',
        'seller_id',
        'type',
        'path',
        'url',
        'mime_type',
        'size',
        'metadata'
    ];

    protected $casts = [
        'metadata' => 'array',
        'size' => 'integer'
    ];

    // Asset types
    const TYPE_CSS = 'css';
    const TYPE_JS = 'js';
    const TYPE_IMAGE = 'image';
    const TYPE_FONT = 'font';
    const TYPE_OTHER = 'other';

    /**
     * Get the theme
     */
    public function theme(): BelongsTo
    {
        return $this->belongsTo(Theme::class);
    }

    /**
     * Get the seller (for custom assets)
     */
    public function seller(): BelongsTo
    {
        return $this->belongsTo(Seller::class);
    }

    /**
     * Check if asset is custom (seller-specific)
     */
    public function isCustom(): bool
    {
        return $this->seller_id !== null;
    }

    /**
     * Get file size in KB
     */
    public function getSizeInKbAttribute(): float
    {
        return round($this->size / 1024, 2);
    }

    /**
     * Get file size in MB
     */
    public function getSizeInMbAttribute(): float
    {
        return round($this->size / (1024 * 1024), 2);
    }

    /**
     * Scope by asset type
     */
    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope for theme assets (not custom)
     */
    public function scopeThemeAssets($query)
    {
        return $query->whereNull('seller_id');
    }

    /**
     * Scope for custom assets
     */
    public function scopeCustomAssets($query)
    {
        return $query->whereNotNull('seller_id');
    }
}