<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ThemePage extends Model
{
    protected $fillable = [
        "theme_id",
        "name",
        "label",
        "type",
        "slug",
        "title",
        "layout_id",
        "thumbnail",
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    protected static function boot()
    {
        parent::boot();

        // Delete related widgets when deleting a theme
        static::deleting(function ($data) {
            $data->widgets()->delete(); // Delete related widgets
        });
    }

    public function page_widgets()
    {
        return $this->hasMany(ThemePageWidget::class);
    }

    public function type()
    {
        return $this->belongsTo(PageType::class, 'type');
    }

    public function layout()
    {
        return $this->morphMany(Widget::class, 'ref');
    }
}
