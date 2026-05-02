<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Show;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShowController extends Controller
{
    private function formatShow(Show $show): array
    {
        $imageFields = ['main_image', 'poster_1', 'poster_2', 'poster_3'];
        $result = [
            'id'          => $show->id,
            'title'       => $show->title,
            'description' => $show->description,
            'status'      => $show->status,
            'sort_order'  => $show->sort_order,
        ];
        foreach ($imageFields as $field) {
            $val = $show->$field;
            if (!$val) {
                $result[$field] = null;
            } elseif (str_starts_with($val, 'http')) {
                $result[$field] = $val; // direct URL, return as-is
            } else {
                $result[$field] = asset('storage/' . $val);
            }
        }
        return $result;
    }

    public function index()
    {
        $shows = Show::orderBy('sort_order')->orderBy('id')->get()->map(fn($s) => $this->formatShow($s));

        return Inertia::render('Admin/Shows/Index', [
            'shows' => $shows,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:200',
            'description' => 'nullable|string',
            'status'      => 'required|in:watching,watched,watchlist',
            'sort_order'  => 'nullable|integer',
            'main_image'  => 'nullable|file|image|max:10240',
            'poster_1'    => 'nullable|file|image|max:5120',
            'poster_2'    => 'nullable|file|image|max:5120',
            'poster_3'    => 'nullable|file|image|max:5120',
        ]);

        $data = $request->only('title', 'description', 'status', 'sort_order');

        foreach (['main_image', 'poster_1', 'poster_2', 'poster_3'] as $field) {
            if ($request->hasFile($field)) {
                // File upload takes priority
                $data[$field] = $request->file($field)->store('shows', 'public');
            } elseif ($request->filled("{$field}_url")) {
                // Direct URL (e.g. from Pinterest/pinimg)
                $data[$field] = $request->input("{$field}_url");
            }
        }

        Show::create($data);

        return back()->with('success', 'Show added.');
    }

    public function update(Request $request, Show $show)
    {
        $request->validate([
            'title'       => 'required|string|max:200',
            'description' => 'nullable|string',
            'status'      => 'required|in:watching,watched,watchlist',
            'sort_order'  => 'nullable|integer',
            'main_image'  => 'nullable|file|image|max:10240',
            'poster_1'    => 'nullable|file|image|max:5120',
            'poster_2'    => 'nullable|file|image|max:5120',
            'poster_3'    => 'nullable|file|image|max:5120',
        ]);

        $data = $request->only('title', 'description', 'status', 'sort_order');

        foreach (['main_image', 'poster_1', 'poster_2', 'poster_3'] as $field) {
            if ($request->hasFile($field)) {
                // New file upload — delete old stored file if it was a local path
                if ($show->$field && !str_starts_with($show->$field, 'http')) {
                    \Storage::disk('public')->delete($show->$field);
                }
                $data[$field] = $request->file($field)->store('shows', 'public');
            } elseif ($request->filled("{$field}_url")) {
                // Direct URL — delete old stored file if applicable
                if ($show->$field && !str_starts_with($show->$field, 'http')) {
                    \Storage::disk('public')->delete($show->$field);
                }
                $data[$field] = $request->input("{$field}_url");
            }
        }

        $show->update($data);

        return back()->with('success', 'Show updated.');
    }

    public function destroy(Show $show)
    {
        foreach (['main_image', 'poster_1', 'poster_2', 'poster_3'] as $field) {
            // Only delete if it's a local stored file, not an external URL
            if ($show->$field && !str_starts_with($show->$field, 'http')) {
                \Storage::disk('public')->delete($show->$field);
            }
        }
        $show->delete();
        return back()->with('success', 'Show deleted.');
    }
}
