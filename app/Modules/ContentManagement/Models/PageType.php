<?php

namespace App\Modules\ContentManagement\Models;

use Illuminate\Database\Eloquent\Model;

class PageType extends Model
{
    protected $fillable = [
        'type',
        'label',
    ];
}