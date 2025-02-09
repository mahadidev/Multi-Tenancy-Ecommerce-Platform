<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\HtmlString;

class SvgIcon extends Model
{
    protected $fillable = [
        'name',
        'icon',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function getIconPreviewAttribute(): HtmlString
    {
        return new HtmlString(
            '<div style="width: 40px; height: 40px;">' . $this->icon . '</div>'
        );
    }
}
