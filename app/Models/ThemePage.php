<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ThemePage extends Model
{
    protected $fillable = [
        "theme_id",
        "name",
        "slug",
        "title"
    ];

    public function page_widgets()
    {
        return $this->hasMany(ThemePageWidget::class);
    }

    public function theme_widgets()
    {
        return $this->belongsToMany(ThemeWidget::class, "theme_id");
    }
}
