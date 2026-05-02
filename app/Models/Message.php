<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'name',
        'email',
        'message',
        'is_read',
        'image_path',
        'admin_reply',
    ];
}
