<?php

namespace App\Modules\NotificationManagement\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $table = 'notifications';
    protected $fillable = ['id', 'type', 'notifiable_id', 'notifiable_type', 'data', 'read_at'];
    protected $casts = [
        'data' => 'array',
        'read_at' => 'datetime',
    ];
    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = true;
    protected $primaryKey = 'id';
    protected $dates = ['created_at', 'updated_at', 'read_at'];

    public function notifiable()
    {
        return $this->morphTo();
    }
}