<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function index()
    {
        $messages = Message::latest()->get();
        return Inertia::render('Admin/Messages/Index', [
            'messages' => $messages
        ]);
    }

    public function show(Message $message)
    {
        if (!$message->is_read) {
            $message->update(['is_read' => true]);
        }
        
        return Inertia::render('Admin/Messages/Show', [
            'message' => $message
        ]);
    }

    public function markAsRead(Message $message)
    {
        $message->update(['is_read' => true]);
        return redirect()->back();
    }

    public function destroy(Message $message)
    {
        $message->delete();
        return redirect()->route('messages.index')->with('success', 'Message deleted successfully.');
    }

    public function reply(Request $request, Message $message)
    {
        $request->validate([
            'admin_reply' => 'required|string',
        ]);

        $message->update([
            'admin_reply' => $request->admin_reply,
        ]);

        return redirect()->route('messages.show', $message->id)->with('success', 'Reply saved successfully.');
    }
}
