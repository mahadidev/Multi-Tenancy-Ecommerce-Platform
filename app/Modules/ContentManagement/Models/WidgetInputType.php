<?php

namespace App\Modules\ContentManagement\Models;

use Illuminate\Database\Eloquent\Model;

class WidgetInputType extends Model
{
    protected $fillable = [
        'label',
        'value',
    ];
}