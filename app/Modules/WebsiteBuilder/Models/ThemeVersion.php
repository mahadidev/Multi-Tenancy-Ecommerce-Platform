<?php

namespace App\Modules\WebsiteBuilder\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ThemeVersion extends Model
{
    protected $fillable = [
        'theme_id',
        'version',
        'changelog',
        'breaking_changes',
        'is_stable',
        'released_at'
    ];

    protected $casts = [
        'breaking_changes' => 'array',
        'is_stable' => 'boolean',
        'released_at' => 'datetime'
    ];

    /**
     * Get the theme
     */
    public function theme(): BelongsTo
    {
        return $this->belongsTo(Theme::class);
    }

    /**
     * Check if version has breaking changes
     */
    public function hasBreakingChanges(): bool
    {
        return !empty($this->breaking_changes);
    }

    /**
     * Compare version numbers
     */
    public function isNewerThan(string $version): bool
    {
        return version_compare($this->version, $version, '>');
    }

    /**
     * Scope for stable versions
     */
    public function scopeStable($query)
    {
        return $query->where('is_stable', true);
    }

    /**
     * Scope for latest version
     */
    public function scopeLatest($query)
    {
        return $query->orderBy('released_at', 'desc')->limit(1);
    }
}