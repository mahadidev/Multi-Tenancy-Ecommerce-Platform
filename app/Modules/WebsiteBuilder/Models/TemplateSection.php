<?php

namespace App\Modules\WebsiteBuilder\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TemplateSection extends Model
{
    protected $fillable = [
        'template_page_id',
        'name',
        'type',
        'container_styles',
        'sort_order',
        'meta_data',
    ];

    protected $casts = [
        'container_styles' => 'json',
        'meta_data' => 'json',
    ];

    public function templatePage(): BelongsTo
    {
        return $this->belongsTo(TemplatePage::class, 'template_page_id');
    }

    public function components(): HasMany
    {
        return $this->hasMany(TemplateComponent::class, 'template_section_id')->orderBy('sort_order');
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