<?php

namespace App\Http\Controllers;

use App\Models\BarangayHighlight;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Helpers\FileHelper;

class BarangayHighlightController extends Controller
{
    /**
     * Display a listing of the barangay highlights.
     */
    public function index()
    {
        $highlights = BarangayHighlight::orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('administrator/brgy_carousel_highlight/page', [
            'highlights' => $highlights
        ]);
    }

    /**
     * Show the form for creating a new highlight.
     */
    public function create()
    {
        return Inertia::render('administrator/brgy_carousel_highlight/create');
    }

    /**
     * Store a newly created highlight in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string|max:100',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:5120', // 5MB max
            'order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $validated['image'] = FileHelper::toBase64($request->file('image'));
        }

        $highlight = BarangayHighlight::create($validated);

        return redirect()->route('admin.highlights.index')
            ->with('success', 'Barangay highlight created successfully!');
    }

    /**
     * Show the form for editing the specified highlight.
     */
    public function edit(BarangayHighlight $highlight)
    {
        return Inertia::render('administrator/brgy_carousel_highlight/edit', [
            'highlight' => $highlight
        ]);
    }

    /**
     * Update the specified highlight in storage.
     */
    public function update(Request $request, BarangayHighlight $highlight)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string|max:100',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:5120',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $validated['image'] = FileHelper::toBase64($request->file('image'));
        }

        $highlight->update($validated);

        return redirect()->route('admin.highlights.index')
            ->with('success', 'Barangay highlight updated successfully!');
    }

    /**
     * Remove the specified highlight from storage.
     */
    public function destroy(BarangayHighlight $highlight)
    {
        $highlight->delete();

        return redirect()->route('admin.highlights.index')
            ->with('success', 'Barangay highlight deleted successfully!');
    }

    /**
     * Toggle the active status of a highlight.
     */
    public function toggleActive(BarangayHighlight $highlight)
    {
        $highlight->update([
            'is_active' => !$highlight->is_active
        ]);

        return back()->with('success', 'Highlight status updated!');
    }

    /**
     * Get active highlights for the public page.
     */
    public function getActiveHighlights()
    {
        return BarangayHighlight::active()
            ->ordered()
            ->get()
            ->map(function ($highlight) {
                return [
                    'id' => $highlight->id,
                    'image' => $highlight->image,
                    'title' => $highlight->title,
                    'description' => $highlight->description,
                    'tag' => $highlight->category,
                    'alt' => $highlight->title,
                ];
            });
    }
}
