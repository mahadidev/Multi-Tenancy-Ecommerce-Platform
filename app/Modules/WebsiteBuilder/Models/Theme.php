<?php

namespace App\Modules\WebsiteBuilder\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Theme extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'thumbnail',
        'is_active',
        'has_widgets',
        // Extended fields (if they exist)
        'version',
        'author',
        'author_url',
        'description',
        'preview_url',
        'category',
        'price',
        'features',
        'config_schema',
        'hooks_manifest',
        'components',
        'layouts',
        'presets',
        'is_featured',
        'installations_count'
    ];

    protected $casts = [
        'features' => 'array',
        'config_schema' => 'array',
        'hooks_manifest' => 'array',
        'components' => 'array',
        'layouts' => 'array',
        'presets' => 'array',
        'price' => 'decimal:2',
        'is_active' => 'boolean',
        'is_featured' => 'boolean'
    ];

    /**
     * Get all seller installations of this theme
     */
    public function sellerThemes(): HasMany
    {
        return $this->hasMany(SellerTheme::class);
    }

    /**
     * Get all sellers using this theme
     */
    public function sellers(): BelongsToMany
    {
        return $this->belongsToMany(
            'App\Models\Seller',
            'seller_themes'
        )->withPivot('is_active', 'activated_at', 'deactivated_at')
          ->withTimestamps();
    }

    /**
     * Get all customizations for this theme
     */
    public function customizations(): HasMany
    {
        return $this->hasMany(ThemeCustomization::class);
    }

    /**
     * Get all websites using this theme
     */
    public function websites(): HasMany
    {
        return $this->hasMany(StoreWebsite::class);
    }

    /**
     * Get theme versions
     */
    public function versions(): HasMany
    {
        return $this->hasMany(ThemeVersion::class);
    }

    /**
     * Get theme assets
     */
    public function assets(): HasMany
    {
        return $this->hasMany(ThemeAsset::class);
    }

    /**
     * Check if theme is free
     */
    public function isFree(): bool
    {
        // Since price column doesn't exist, assume all themes are free
        return true;
    }

    /**
     * Get active sellers count
     */
    public function getActiveInstallationsCountAttribute(): int
    {
        return $this->sellerThemes()
            ->where('is_active', true)
            ->count();
    }

    /**
     * Get theme configuration schema
     */
    public function getConfigSchema(): array
    {
        return $this->config_schema ?? [
            'colors' => [
                'primary' => ['type' => 'color', 'default' => '#000000'],
                'secondary' => ['type' => 'color', 'default' => '#666666'],
            ],
            'fonts' => [
                'heading' => ['type' => 'font', 'default' => 'Inter'],
                'body' => ['type' => 'font', 'default' => 'Inter'],
            ],
            'layout' => [
                'container_width' => ['type' => 'select', 'options' => ['full', 'boxed'], 'default' => 'full'],
                'header_style' => ['type' => 'select', 'options' => ['minimal', 'classic', 'modern'], 'default' => 'modern'],
            ]
        ];
    }

    /**
     * Get required hooks for this theme
     */
    public function getRequiredHooks(): array
    {
        return $this->hooks_manifest['required'] ?? [];
    }

    /**
     * Get optional hooks for this theme
     */
    public function getOptionalHooks(): array
    {
        return $this->hooks_manifest['optional'] ?? [];
    }

    /**
     * Increment installation count
     */
    public function incrementInstallations(): void
    {
        // Since installations_count column doesn't exist, do nothing
        // This would be logged or tracked elsewhere in a real implementation
    }

    /**
     * Scope for active themes
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for featured themes
     */
    public function scopeFeatured($query)
    {
        // Since is_featured column doesn't exist, just return all themes
        return $query;
    }

    /**
     * Scope by category
     */
    public function scopeByCategory($query, string $category)
    {
        // Since category column doesn't exist, just return all themes
        return $query;
    }

    /**
     * Scope for free themes
     */
    public function scopeFree($query)
    {
        // Since price column doesn't exist, just return all themes
        return $query;
    }

    /**
     * Scope for premium themes
     */
    public function scopePremium($query)
    {
        // Since price column doesn't exist, just return all themes
        return $query;
    }
}