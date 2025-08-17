<?php

namespace App\Modules\ContentManagement\Models;

use Illuminate\Database\Eloquent\Model;
use App\Modules\ContentManagement\Models\StorePage;
use App\Modules\ContentManagement\Models\Widget;
use App\Modules\ContentManagement\Models\WidgetInput;
use App\Modules\ContentManagement\Models\WidgetType;

class StorePageWidget extends Model
{
    protected $fillable = [
        'store_page_id',
        'name',
        'label',
        'serial',
        'is_editable',
        "layout_id",
        'widget_type_id',

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
        return $this->hasMany(WidgetInput::class, 'widget_id');
    }
    
    // public function widgetInputs(){
    //     return $this->hasMany(StorePageWidgetInput::class, 'widget_id');
    // }

    public function widgetType(){
        return $this->belongsTo(WidgetType::class, 'widget_type_id');
    }

    public function layout(){
        return $this->belongsTo(Widget::class, 'layout_id');
    }
}