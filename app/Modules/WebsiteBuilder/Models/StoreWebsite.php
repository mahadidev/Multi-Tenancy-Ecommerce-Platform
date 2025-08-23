<?php

namespace App\Modules\WebsiteBuilder\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Modules\StoreManagement\Models\Store;

class StoreWebsite extends Model
{
    protected $fillable = [
        'store_id',
        'template_id',
        'domain',
        'subdomain',
        'title',
        'description',
        'favicon',
        'seo_meta',
        'global_styles',
        'analytics_settings',
        'is_published',
        'published_at',
        'is_maintenance_mode',
        'maintenance_message',
        'meta_data',
    ];

    protected $casts = [
        'seo_meta' => 'json',
        'global_styles' => 'json',
        'analytics_settings' => 'json',
        'is_published' => 'boolean',
        'published_at' => 'datetime',
        'is_maintenance_mode' => 'boolean',
        'meta_data' => 'json',
    ];

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(WebsiteTemplate::class, 'template_id');
    }

    public function pages(): HasMany
    {
        return $this->hasMany(WebsitePage::class, 'website_id');
    }

    public function assets(): HasMany
    {
        return $this->hasMany(WebsiteAsset::class, 'website_id');
    }

    public function menus(): HasMany
    {
        return $this->hasMany(WebsiteMenu::class, 'website_id');
    }

    public function forms(): HasMany
    {
        return $this->hasMany(WebsiteForm::class, 'website_id');
    }

    public function pageViews(): HasMany
    {
        return $this->hasMany(WebsitePageView::class, 'website_id');
    }

    public function homepage()
    {
        return $this->pages()->where('is_homepage', true)->first();
    }

    public function getFullDomainAttribute(): string
    {
        if ($this->domain) {
            return $this->domain;
        }
        
        $baseUrl = config('app.url');
        return $baseUrl . '/sites/' . $this->subdomain;
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeByStore($query, $storeId)
    {
        return $query->where('store_id', $storeId);
    }
}