<?php

namespace App\Modules\StoreManagement\Models;

use Illuminate\Database\Eloquent\Model;
use App\Modules\StoreManagement\Models\StoreMenu;

class StoreMenuItem extends Model
{
    protected $fillable = ['label', 'href', 'store_menu_id', "visibility"];

    // Relationship with StoreMenu
    public function storeMenu()
    {
        return $this->belongsTo(StoreMenu::class);
    }
}
