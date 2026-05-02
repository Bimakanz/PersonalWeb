<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Wallpaper extends Model
{
    protected $fillable = ['wallpaper_folder_id', 'name', 'image_path'];

    public function folder()
    {
        return $this->belongsTo(WallpaperFolder::class, 'wallpaper_folder_id');
    }

    public function getImageUrlAttribute(): string
    {
        return asset('storage/' . $this->image_path);
    }
}
