<?php

namespace App\Modules\WebsiteBuilder\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WebsiteMenu extends Model
{
    protected $fillable = [
        'website_id',
        'name',
        'location',
        'items',
        'styles',
        'is_active',
    ];

    protected $casts = [
        'items' => 'json',
        'styles' => 'json',
        'is_active' => 'boolean',
    ];

    public function website(): BelongsTo
    {
        return $this->belongsTo(StoreWebsite::class, 'website_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByLocation($query, $location)
    {
        return $query->where('location', $location);
    }

    public function getItemsTreeAttribute(): array
    {
        return $this->buildMenuTree($this->items ?? []);
    }

    private function buildMenuTree(array $items, $parentId = null): array
    {
        $tree = [];
        
        foreach ($items as $item) {
            if (($item['parent_id'] ?? null) === $parentId) {
                $item['children'] = $this->buildMenuTree($items, $item['id'] ?? null);
                $tree[] = $item;
            }
        }
        
        return $tree;
    }
}