<?php

namespace App\Modules\ContentManagement\Models;

use Illuminate\Database\Eloquent\Model;

class WidgetType extends Model
{
    protected $fillable = [
        'type', 'label'
    ];

}