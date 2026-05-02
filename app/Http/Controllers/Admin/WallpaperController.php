<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Wallpaper;
use App\Models\WallpaperFolder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WallpaperController extends Controller
{
    public function index()
    {
        $folders = WallpaperFolder::with('wallpapers')->orderBy('name')->get()->map(function ($f) {
            return [
                'id'   => $f->id,
                'name' => $f->name,
                'wallpapers' => $f->wallpapers->map(fn($w) => [
                    'id'        => $w->id,
                    'name'      => $w->name,
                    'image_url' => asset('storage/' . $w->image_path),
                ])->values(),
            ];
        });

        return Inertia::render('Admin/Wallpapers/Index', [
            'folders' => $folders,
        ]);
    }

    public function storeFolder(Request $request)
    {
        $request->validate(['name' => 'required|string|max:100']);
        WallpaperFolder::create(['name' => $request->name]);
        return back()->with('success', 'Folder created.');
    }

    public function destroyFolder(WallpaperFolder $folder)
    {
        foreach ($folder->wallpapers as $wp) {
            \Storage::disk('public')->delete($wp->image_path);
        }
        $folder->delete();
        return back()->with('success', 'Folder deleted.');
    }

    public function storeWallpaper(Request $request)
    {
        $request->validate([
            'wallpaper_folder_id' => 'required|exists:wallpaper_folders,id',
            'name'  => 'required|string|max:100',
            'image' => 'required|file|mimetypes:image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm|max:51200',
        ]);

        $path = $request->file('image')->store('wallpapers', 'public');

        Wallpaper::create([
            'wallpaper_folder_id' => $request->wallpaper_folder_id,
            'name'       => $request->name,
            'image_path' => $path,
        ]);

        return back()->with('success', 'Wallpaper added.');
    }

    public function destroyWallpaper(Wallpaper $wallpaper)
    {
        \Storage::disk('public')->delete($wallpaper->image_path);
        $wallpaper->delete();
        return back()->with('success', 'Wallpaper deleted.');
    }
}
