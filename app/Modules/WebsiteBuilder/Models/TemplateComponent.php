<?php

namespace App\Modules\WebsiteBuilder\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TemplateComponent extends Model
{
    protected $fillable = [
        'template_section_id',
        'component_type_id',
        'name',
        'props',
        'styles',
        'sort_order',
        'meta_data',
    ];

    protected $casts = [
        'props' => 'json',
        'styles' => 'json',
        'meta_data' => 'json',
    ];

    public function templateSection(): BelongsTo
    {
        return $this->belongsTo(TemplateSection::class, 'template_section_id');
    }

    public function componentType(): BelongsTo
    {
        return $this->belongsTo(ComponentType::class, 'component_type_id');
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }
}