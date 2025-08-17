<?php

namespace App\Modules\StoreManagement\Models;

use Illuminate\Database\Eloquent\Model;
use App\Modules\StoreManagement\Models\Store;

class StoreType extends Model
{
    protected $fillable = [
        'label', 'type'
    ];

    public function stores(){
        return $this->hasMany(Store::class, 'store_type_id');
    }
}
