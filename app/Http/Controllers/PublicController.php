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
            ->get(['id', 'name', 'message', 'image_path', 'admin_reply', 'created_at'])
            ->sortBy('created_at')
            ->values();

        $videos = \App\Models\Video::orderBy('created_at', 'desc')->get()->map(function ($v) {
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
                    'image_url' => str_starts_with($w->image_path, 'http') ? $w->image_path : asset('storage/' . $w->image_path),
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

    public function getMessages()
    {
        $messages = \App\Models\Message::orderBy('created_at', 'asc')
            ->limit(100)
            ->get(['id', 'name', 'message', 'image_path', 'admin_reply', 'created_at'])
            ->map(fn($m) => [
                'id'          => $m->id,
                'sender'      => $m->name,
                'text'        => $m->message,
                'image'       => $m->image_path ? asset('storage/' . $m->image_path) : null,
                'admin_reply' => $m->admin_reply,
            ])
            ->values();

        return response()->json($messages);
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

        $messageModel = \App\Models\Message::create([
            'name'       => $validated['name'],
            'email'      => $validated['email'],
            'message'    => $validated['message'] ?? '',
            'image_path' => $imagePath,
        ]);

        // Send to Discord Webhook
        if (env('DISCORD_WEBHOOK_URL')) {
            try {
                $messageText = !empty($validated['message']) ? $validated['message'] : '*No message text provided*';
                
                // Reduced line break: 1 \n after New Message
                $description = "**Sender**\n{$validated['name']}\n\n**New Message**\n\"{$messageText}\"";

                $embed = [
                    'description' => $description,
                    'color'       => hexdec('00b0f4'), // Windows 95 blue
                    'footer'      => [
                        'text' => "Sxna's Space"
                    ],
                    'timestamp'   => now()->toIso8601String(),
                ];

                $data = [
                    'embeds'  => [$embed]
                ];
                
                if ($imagePath) {
                    $fullPath = storage_path('app/public/' . $imagePath);
                    if (file_exists($fullPath)) {
                        $filename = basename($fullPath);
                        // Tell Discord to use the attached file as the embed image
                        $data['embeds'][0]['image'] = ['url' => 'attachment://' . $filename];
                        
                        \Illuminate\Support\Facades\Http::attach(
                            'file', file_get_contents($fullPath), $filename
                        )->post(env('DISCORD_WEBHOOK_URL'), [
                            'payload_json' => json_encode($data)
                        ]);
                    } else {
                        \Illuminate\Support\Facades\Http::post(env('DISCORD_WEBHOOK_URL'), $data);
                    }
                } else {
                    \Illuminate\Support\Facades\Http::post(env('DISCORD_WEBHOOK_URL'), $data);
                }
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Discord Webhook Error: ' . $e->getMessage());
            }
        }

        return redirect()->back()->with('success', 'Message sent!');
    }
}
