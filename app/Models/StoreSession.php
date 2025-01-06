<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
