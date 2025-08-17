<?php

namespace App\Modules\CustomerManagement\Models;

use App\Modules\StoreManagement\Models\Store;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\ValidationException;

class Subscriber extends Model
{
    protected $fillable = ['email', 'status', 'store_id'];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}