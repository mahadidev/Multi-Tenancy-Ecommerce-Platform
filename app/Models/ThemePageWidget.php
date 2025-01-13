<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ThemePageWidget extends Model
{
    protected $fillable = [
        'theme_id',
        'name',
        'label',
        'type',
        'value',
        'inputs',
        'thumbnail',
    ];

    protected $casts = [
        'value' => 'json', // Use 'json' instead of 'array'
        'inputs' => 'json',
    ];

    protected $hidden  = [
        'created_at',
        'updated_at',
    ];
    
}
