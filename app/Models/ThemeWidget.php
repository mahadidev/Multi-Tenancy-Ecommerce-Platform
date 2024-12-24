<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ThemeWidget extends Model
{
    protected $fillable = [
        'theme_id',
        'name',
        'label',
        'type',
        'value',
    ];

    protected $casts = [
        'value' => 'json', // Use 'json' instead of 'array'
    ];
    
}
