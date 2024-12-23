<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Theme extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'thumbnail',
        'is_active',
    ];
    
    public function widgetGroups()
    {
        return $this->belongsToMany(WidgetGroup::class, 'theme_widget_group')
                    ->withTimestamps(); // Includes timestamps from the pivot table
    }
}
