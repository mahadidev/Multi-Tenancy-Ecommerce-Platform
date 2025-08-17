<?php

namespace App\Modules\ThemeManagement\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Widget;
use App\Models\PageType;

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

    public function widgets()
    {
        return $this->morphMany(Widget::class, 'ref')->where(["type_id" => 3]);
    }

    public function type()
    {
        return $this->belongsTo(PageType::class, 'type');
    }

    public function layout()
    {
        return $this->belongsTo(Widget::class, 'layout_id');
    }

    public function theme()
    {
        return $this->belongsTo(Theme::class);
    }
}