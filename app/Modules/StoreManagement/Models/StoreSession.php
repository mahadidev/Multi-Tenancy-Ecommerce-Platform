<?php

namespace App\Modules\StoreManagement\Models;

use Illuminate\Database\Eloquent\Model;
use App\Modules\StoreManagement\Models\Store;
use App\Modules\UserManagement\Models\User;

class StoreSession extends Model
{
    protected $fillable = [ 'store_id', 'user_id' ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
