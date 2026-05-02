<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    protected $fillable = ['title', 'file_path', 'url', 'sort_order'];

    public function getSourceAttribute(): string
    {
        return $this->file_path
            ? asset('storage/' . $this->file_path)
            : $this->url;
    }
}
