<?php

namespace App\Modules\WebsiteBuilder\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WebsiteTemplate extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'preview_image',
        'preview_images',
        'category',
        'is_active',
        'is_premium',
        'price',
        'sort_order',
        'meta_data',
    ];

    protected $casts = [
        'preview_images' => 'json',
        'is_active' => 'boolean',
        'is_premium' => 'boolean',
        'price' => 'decimal:2',
        'meta_data' => 'json',
    ];

    public function pages(): HasMany
    {
        return $this->hasMany(TemplatePage::class, 'template_id');
    }

    public function websites(): HasMany
    {
        return $this->hasMany(StoreWebsite::class, 'template_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeFree($query)
    {
        return $query->where('is_premium', false);
    }

    public function scopePremium($query)
    {
        return $query->where('is_premium', true);
    }

    public function getPreviewImageUrlAttribute(): ?string
    {
        return $this->preview_image ? url($this->preview_image) : null;
    }

    public function getPreviewImageUrlsAttribute(): array
    {
        if (!$this->preview_images) {
            return [];
        }

        return array_map(function ($image) {
            return url($image);
        }, $this->preview_images);
    }
}