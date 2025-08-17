<?php

namespace App\Modules\AnalyticsManagement\Models;

use Illuminate\Database\Eloquent\Model;

class RequestLog extends Model
{
    protected $fillable = [
        'method', 'url', 'headers', 'body', 'ip',
    ];
}