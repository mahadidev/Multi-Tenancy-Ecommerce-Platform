<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoreWidget extends Model
{
    protected $fillable = [
        'store_id',
        'widget_type_id',
        'name',
        'label',
        'inputs',
        'is_editable',
        'thumbnail',
    ];

    public function store(){
        return $this->belongsTo(Store::class, 'store_id');
    }

    public function widgetType(){
        return $this->belongsTo(WidgetType::class, 'widget_type_id');
    }
}
