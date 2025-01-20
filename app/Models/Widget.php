<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Widget extends Model
{
    use HasFactory;

    protected $fillable = [
        'group_id',
        'meta_title',
        'meta_name',
        'meta_value',
        'field_type',
        'sorting',
        'serial',
        'placeholder',
        'settings',
        'is_active',
    ];

    protected $casts = [
        'settings' => 'array',
        'is_active' => 'boolean',
    ];
    /**
     * Define the relationship with WidgetGroup.
     * Each Widget belongs to a single WidgetGroup.
     */
    public function group()
    {
        return $this->belongsTo(WidgetGroup::class, 'group_id');
    }

    protected static function booted()
    {
        static::creating(function ($widget) {
            if (is_null($widget->serial)) {
                $widget->serial = self::max('serial') + 1;
            }
        });
    }
    
}