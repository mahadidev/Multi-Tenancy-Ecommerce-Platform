<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WidgetInputItem extends Model
{
    protected $fillable = [
        "name",
        "label",
        "placeholder",
        "value",
        "required",
        "type",
        "widget_input_id"
    ];

    public function widgetInput()
    {
        return $this->belongsTo(WidgetInput::class, 'widget_input_id');
    }

}
