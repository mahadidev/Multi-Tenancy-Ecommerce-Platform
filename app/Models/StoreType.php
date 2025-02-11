<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoreType extends Model
{
    protected $fillable = [
        'label', 'type'
    ];

    public function stores(){
        return $this->hasMany(Store::class, 'store_type_id');
    }
}
