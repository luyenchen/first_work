<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Calendar extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'date',
        'time',
        'text',
        'city',
        'district',
        'detail_address',
        'hourly_rate'
    ];
    // public function user()
    // {
    //     return $this->belongsTo(User::class);
    // }
}