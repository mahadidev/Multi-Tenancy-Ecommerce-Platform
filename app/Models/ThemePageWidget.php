<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ThemePageWidget extends Model
{
    protected $fillable = [
        'theme_id',
        'name',
        'label',
        'type',
        'value',
        'inputs',
        'thumbnail',
        'is_editable',
        'widget_type_id',
    ];

    protected $casts = [
        'value' => 'json', // Use 'json' instead of 'array'
        'inputs' => 'json',
        'is_editable' => 'boolean',
    ];

    protected $hidden  = [
        'created_at',
        'updated_at',
    ];
    
    public function widgetType(){
        return $this->belongsTo(WidgetType::class, 'widget_type_id');
    }
}
