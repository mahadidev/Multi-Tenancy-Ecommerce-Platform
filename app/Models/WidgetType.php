<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WidgetType extends Model
{
    protected $fillable = [
        'type', 'label'
    ];

    public function themeWidgets(){
        return $this->belongsTo(ThemeWidget::class, 'widget_type_id');
    }
}
