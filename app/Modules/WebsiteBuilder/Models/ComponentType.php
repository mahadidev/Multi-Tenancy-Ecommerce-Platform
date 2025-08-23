<?php

namespace App\Modules\WebsiteBuilder\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ComponentType extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'icon',
        'default_props',
        'schema',
        'template',
        'styles',
        'is_active',
        'is_premium',
        'sort_order',
        'meta_data',
    ];

    protected $casts = [
        'default_props' => 'json',
        'schema' => 'json',
        'styles' => 'json',
        'is_active' => 'boolean',
        'is_premium' => 'boolean',
        'meta_data' => 'json',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(ComponentCategory::class, 'category_id');
    }

    public function pageComponents(): HasMany
    {
        return $this->hasMany(PageComponent::class, 'component_type_id');
    }

    public function templateComponents(): HasMany
    {
        return $this->hasMany(TemplateComponent::class, 'component_type_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    public function scopeFree($query)
    {
        return $query->where('is_premium', false);
    }

    public function scopePremium($query)
    {
        return $query->where('is_premium', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }

    public function getSchemaWithDefaultsAttribute(): array
    {
        $schema = $this->schema ?? [];
        $defaults = $this->default_props ?? [];

        // Merge schema with default values
        if (isset($schema['properties'])) {
            foreach ($schema['properties'] as $key => &$property) {
                if (isset($defaults[$key])) {
                    $property['default'] = $defaults[$key];
                }
            }
        }

        return $schema;
    }
}