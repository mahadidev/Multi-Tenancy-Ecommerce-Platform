<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StorePageWidgetInputItem extends Model
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

    public function input()
    {
        return $this->belongsTo(StorePageWidgetInput::class, 'widget_input_id');
    }
}
