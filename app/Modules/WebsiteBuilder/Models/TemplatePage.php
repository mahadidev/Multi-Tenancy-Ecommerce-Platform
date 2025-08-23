<?php

namespace App\Modules\WebsiteBuilder\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TemplatePage extends Model
{
    protected $fillable = [
        'template_id',
        'title',
        'slug',
        'type',
        'description',
        'is_homepage',
        'sort_order',
        'meta_data',
    ];

    protected $casts = [
        'is_homepage' => 'boolean',
        'meta_data' => 'json',
    ];

    public function template(): BelongsTo
    {
        return $this->belongsTo(WebsiteTemplate::class, 'template_id');
    }

    public function sections(): HasMany
    {
        return $this->hasMany(TemplateSection::class, 'template_page_id')->orderBy('sort_order');
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