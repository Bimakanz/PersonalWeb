<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicController extends Controller
{
    public function index()
    {
        $projects = \App\Models\Project::latest()->get();
        $messages = \App\Models\Message::orderBy('created_at', 'asc')
            ->latest()
            ->limit(100)
            ->get(['id', 'name', 'message', 'image_path', 'created_at'])
            ->sortBy('created_at')
            ->values();

        $videos = \App\Models\Video::orderBy('sort_order')->orderBy('created_at')->get()->map(function ($v) {
            return [
                'id'    => $v->id,
                'title' => $v->title,
                'src'   => $v->file_path ? asset('storage/' . $v->file_path) : $v->url,
            ];
        });

        $wallpaperFolders = \App\Models\WallpaperFolder::with('wallpapers')->orderBy('name')->get()->map(function ($f) {
            return [
                'id'   => $f->id,
                'name' => $f->name,
                'wallpapers' => $f->wallpapers->map(fn($w) => [
                    'id'        => $w->id,
                    'name'      => $w->name,
                    'image_url' => asset('storage/' . $w->image_path),
                ]),
            ];
        });

        $shows = \App\Models\Show::orderBy('id', 'desc')->get()->map(function ($s) {
            $formatImg = fn($val) => $val ? (str_starts_with($val, 'http') ? $val : asset('storage/' . $val)) : null;
            return [
                'id'          => $s->id,
                'title'       => $s->title,
                'description' => $s->description,
                'status'      => $s->status,
                'main_image'  => $formatImg($s->main_image),
                'poster_1'    => $formatImg($s->poster_1),
                'poster_2'    => $formatImg($s->poster_2),
                'poster_3'    => $formatImg($s->poster_3),
            ];
        });

        return Inertia::render('Public/Home', [
            'projects'        => $projects,
            'chatMessages'    => $messages,
            'videos'          => $videos,
            'wallpaperFolders' => $wallpaperFolders,
            'shows'           => $shows,
        ]);
    }

    public function storeMessage(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email|max:255',
            'message' => 'required_without:image|nullable|string',
            'image'   => 'nullable|image|max:4096',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('chat-images', 'public');
        }

        \App\Models\Message::create([
            'name'       => $validated['name'],
            'email'      => $validated['email'],
            'message'    => $validated['message'] ?? '',
            'image_path' => $imagePath,
        ]);

        return redirect()->back()->with('success', 'Message sent!');
    }
}
