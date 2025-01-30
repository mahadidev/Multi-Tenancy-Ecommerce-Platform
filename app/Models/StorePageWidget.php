<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StorePageWidget extends Model
{
    protected $fillable = [
        'store_page_id',
        'name',
        'label',
        'serial',
        'is_editable'
    ];

    protected $casts = [
        'inputs' => 'array',
        'is_editable' => 'boolean',
    ];

    protected $hidden  = [
        'created_at',
        'updated_at',
    ];

    public function page(){
        return $this->belongsTo(StorePage::class, 'store_page_id');
    }

    public function widgetInputs(){
        return $this->hasMany(StorePageWidgetInput::class, 'widget_id');
    }
}
