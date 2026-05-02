<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WallpaperFolder extends Model
{
    protected $fillable = ['name'];

    public function wallpapers()
    {
        return $this->hasMany(Wallpaper::class);
    }
}
