<?php

namespace App\Models;

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
