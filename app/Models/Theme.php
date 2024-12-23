<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Theme extends Model
{

    protected static function boot()
    {
        parent::boot();

        // Automatically generate a slug when creating
        static::creating(function ($data) {
            if (empty($data->slug)) {
                $data->slug = Str::slug($data->name);  // Generate slug from name
            }
            
        });

        // Automatically update the slug when updating
        static::updating(function ($data) {
            if ($data->isDirty('name')) {  // Check if the 'name' attribute has changed
                $data->slug = Str::slug($data->name);  // Update slug based on new name
            }
        });
    }

    protected $fillable = [
        'name',
        'slug',
        'thumbnail',
        'is_active',
    ];
    
    public function widgetGroups()
    {
        return $this->belongsToMany(WidgetGroup::class, 'theme_widget_group');
    }
}
