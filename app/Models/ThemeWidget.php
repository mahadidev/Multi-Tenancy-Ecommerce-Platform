<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ThemeWidget extends Model
{
    protected $fillable = [
        'theme_id',
        'widget_type_id',
        'name',
        'label',
        'inputs',
        'is_editable',
        'thumbnail',
    ];

    public function theme(){
        return $this->belongsTo(Theme::class, 'theme_id');
    }

    public function widgetType(){
        return $this->belongsTo(WidgetType::class, 'widget_type_id');
    }
}
