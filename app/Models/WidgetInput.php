<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WidgetInput extends Model
{
    protected $fillable = [
        'widget_id',
        'type_id',
        'parent_id',
        'name',
        'label',
        'placeholder',
        'value',
        'options',
        'required',
    ];

    protected $casts = [
        'options' => 'json',
        'required' => 'boolean',
    ];


    /**
     * Get the widget that owns this input.
     */
    public function widget(): BelongsTo
    {
        return $this->belongsTo(Widget::class);
    }

    /**
     * Get the input type.
     */
    public function type(): BelongsTo
    {
        return $this->belongsTo(WidgetInputType::class, 'type_id');
    }

    /**
     * Get the parent input.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    /**
     * Get child inputs.
     */
    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    public function items(){
        return $this->hasMany(WidgetInputItem::class, 'widget_input_id');
    }
}
