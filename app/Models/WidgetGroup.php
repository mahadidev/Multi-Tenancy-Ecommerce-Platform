<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WidgetGroup extends Model
{
    use HasFactory;

    protected $fillable = [
        'group_name',
        'group_label',
        'location',
    ];

    /**
     * Define the relationship with Widget.
     * A WidgetGroup can have many Widgets.
     */
    public function widgets()
    {
        return $this->hasMany(Widget::class, 'group_id')
            ->orderBy('sorting');
    }
    public function activeWidgets()
    {
        return $this->widgets()
            ->where('is_active', true);
    }

    public function themes()
    {
        return $this->belongsToMany(Theme::class, 'theme_widget_group')
                    ->withTimestamps(); // Includes timestamps from the pivot table
    }
}