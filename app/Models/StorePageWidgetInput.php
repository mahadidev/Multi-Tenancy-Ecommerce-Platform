<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StorePageWidgetInput extends Model
{
    protected $fillable = [
        "name",
        "label",
        "placeholder",
        "value",
        "required",
        "type",
        "widget_id"
    ];


    public function widget()
    {
        return $this->belongsTo(StorePageWidget::class, 'widget_id');
    }

    public function items()
    {
        return $this->hasMany(StorePageWidgetInputItem::class, 'widget_input_id');
    }
}
