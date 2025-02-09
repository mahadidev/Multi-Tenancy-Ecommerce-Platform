<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoreMenu extends Model
{
    protected $fillable = [
        'store_id',
        'label',
        'name',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    
}
