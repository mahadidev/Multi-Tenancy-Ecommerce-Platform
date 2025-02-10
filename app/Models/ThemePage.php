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
        return $this->belongsTo(ThemeWidget::class, 'layout_id');
    }
}
