<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Show extends Model
{
    protected $fillable = [
        'title',
        'description',
        'status',
        'main_image',
        'poster_1',
        'poster_2',
        'poster_3',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];
}
