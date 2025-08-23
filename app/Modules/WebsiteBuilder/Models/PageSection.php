<?php

namespace App\Modules\WebsiteBuilder\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PageSection extends Model
{
    protected $fillable = [
        'page_id',
        'name',
        'type',
        'container_styles',
        'sort_order',
        'is_visible',
        'responsive_settings',
        'meta_data',
    ];

    protected $casts = [
        'container_styles' => 'json',
        'is_visible' => 'boolean',
        'responsive_settings' => 'json',
        'meta_data' => 'json',
    ];

    public function page(): BelongsTo
    {
        return $this->belongsTo(WebsitePage::class, 'page_id');
    }

    public function components(): HasMany
    {
        return $this->hasMany(PageComponent::class, 'section_id')->orderBy('sort_order');
    }

    public function scopeVisible($query)
    {
        return $query->where('is_visible', true);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }
}