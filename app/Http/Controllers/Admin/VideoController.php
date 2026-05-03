<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VideoController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Videos/Index', [
            'videos' => Video::orderBy('created_at', 'desc')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'file'  => 'nullable|file|mimes:mp4,webm,mov|max:102400',
            'url'   => 'nullable|url',
        ]);

        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('videos', 'public');
        }

        Video::create([
            'title'      => $request->title,
            'file_path'  => $filePath,
            'url'        => $request->url,
        ]);

        return redirect()->route('admin.videos.index')->with('success', 'Video added.');
    }

    public function destroy(Video $video)
    {
        if ($video->file_path) {
            \Storage::disk('public')->delete($video->file_path);
        }
        $video->delete();
        return back()->with('success', 'Video deleted.');
    }
}
