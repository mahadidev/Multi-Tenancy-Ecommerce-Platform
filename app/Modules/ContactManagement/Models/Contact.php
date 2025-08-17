<?php

namespace App\Modules\ContactManagement\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    protected $fillable = [
        'store_id',
        'name',
        'email',
        'subject',
        'phone',
        'message',
    ];


    public function scopeAuthorized($query){
        return $query->where('store_id', authStore());
    }


}