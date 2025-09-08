<?php

namespace App\Modules\WebsiteBuilder\Models;

use App\Models\Seller;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SellerTheme extends Model
{
    protected $fillable = [
        'seller_id',
        'theme_id',
        'is_active',
        'activated_at',
        'deactivated_at',
        'license_data'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'activated_at' => 'datetime',
        'deactivated_at' => 'datetime',
        'license_data' => 'array'
    ];

    /**
     * Get the seller
     */
    public function seller(): BelongsTo
    {
        return $this->belongsTo(Seller::class);
    }

    /**
     * Get the theme
     */
    public function theme(): BelongsTo
    {
        return $this->belongsTo(Theme::class);
    }

    /**
     * Activate this theme for the seller
     */
    public function activate(): void
    {
        // Deactivate other themes for this seller
        static::where('seller_id', $this->seller_id)
            ->where('id', '!=', $this->id)
            ->update([
                'is_active' => false,
                'deactivated_at' => now()
            ]);

        // Activate this theme
        $this->update([
            'is_active' => true,
            'activated_at' => now(),
            'deactivated_at' => null
        ]);
    }

    /**
     * Deactivate this theme
     */
    public function deactivate(): void
    {
        $this->update([
            'is_active' => false,
            'deactivated_at' => now()
        ]);
    }

    /**
     * Check if license is valid (for premium themes)
     */
    public function hasValidLicense(): bool
    {
        if (!$this->license_data) {
            return $this->theme->isFree();
        }

        $expiresAt = $this->license_data['expires_at'] ?? null;
        
        if (!$expiresAt) {
            return true; // Lifetime license
        }

        return now()->lt($expiresAt);
    }

    /**
     * Scope for active theme installations
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for valid licenses
     */
    public function scopeWithValidLicense($query)
    {
        return $query->where(function ($q) {
            $q->whereJsonExtract('license_data->expires_at', '>=', now())
              ->orWhereNull('license_data->expires_at')
              ->orWhereHas('theme', function ($theme) {
                  $theme->where('price', 0);
              });
        });
    }
}