<?php

namespace App\Modules\WebsiteBuilder\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WebsitePage extends Model
{
    protected $fillable = [
        'website_id',
        'title',
        'slug',
        'description',
        'content',
        'type',
        'seo_meta',
        'is_published',
        'is_homepage',
        'access_level',
        'sort_order',
        'meta_data',
    ];

    protected $casts = [
        'seo_meta' => 'json',
        'is_published' => 'boolean',
        'is_homepage' => 'boolean',
        'meta_data' => 'json',
    ];

    public function website(): BelongsTo
    {
        return $this->belongsTo(StoreWebsite::class, 'website_id');
    }

    public function sections(): HasMany
    {
        return $this->hasMany(PageSection::class, 'page_id')->orderBy('sort_order');
    }

    public function pageViews(): HasMany
    {
        return $this->hasMany(WebsitePageView::class, 'page_id');
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }

    public function scopeAccessibleTo($query, bool $isAuthenticated)
    {
        return $query->where(function ($q) use ($isAuthenticated) {
            $q->where('access_level', 'all')
              ->when($isAuthenticated, function ($query) {
                  $query->orWhere('access_level', 'user');
              })
              ->when(!$isAuthenticated, function ($query) {
                  $query->orWhere('access_level', 'guest');
              });
        });
    }

    public function getFullUrlAttribute(): string
    {
        $website = $this->website;
        return $website->full_domain . '/' . $this->slug;
    }

    public function getSeoTitleAttribute(): string
    {
        return $this->seo_meta['title'] ?? $this->title;
    }

    public function getSeoDescriptionAttribute(): ?string
    {
        return $this->seo_meta['description'] ?? $this->description;
    }

    public function getSeoKeywordsAttribute(): ?string
    {
        return $this->seo_meta['keywords'] ?? null;
    }
}