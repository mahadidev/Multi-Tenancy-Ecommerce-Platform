<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoreMenuItem extends Model
{
    protected $fillable = ['label', 'href', 'store_menu_id'];

    // Relationship with StoreMenu
    public function storeMenu()
    {
        return $this->belongsTo(StoreMenu::class);
    }
}
