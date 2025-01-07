<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Blog;
use App\Models\Category;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\BlogResource;


class BlogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return apiResponse(function () use ($request) {
            $blogs = Blog::with('category')->where('user_id', Auth::id())->latest()->get();

            return response()->json([
                'status' => 200,
                'data' => [
                    'blogs' =>  BlogResource::collection($blogs),
                ],
            ]);
        });
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        return apiResponse(function () use ($request) {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'required|string',
                'image' => 'nullable|image',
                'status' => 'required|in:active,inactive',
                'category_id' => [
                    'required',
                    'exists:categories,id',
                    function ($attribute, $value, $fail) {
                        $category = Category::find($value);
                        if ($category && $category->type !== 'post') {
                            $fail('The selected category is not of type blog.');
                        }
                    },
                ],
            ]);

            $imagePath = null;
            if ($request->hasFile('image') && isset($request->image)) {
                $imagePath = $request->file('image')->store('blogs', 'public');
            }

            $blog = Blog::create([
                'title' => $validated['title'],
                'content' => $validated['content'],
                'image' => $imagePath ? $imagePath : null,
                'category_id' => $validated['category_id'],
                'status' => $validated['status'],
            ]);

            return response()->json([
                'status' => 200,
                'message' => 'Blog created successfully',
                'data' => [
                    'blog' => new BlogResource($blog),
                ],
            ]);
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $id)
    {
        return apiResponse(function () use ($request, $id) {
            $blog = Blog::with('category')->where('user_id', Auth::id())->findOrFail($id);

            // show error if blog is not found
            if (!$blog) {
                return response()->json([
                    'success' => false,
                    'message' => 'Blog not found',
                ], 404);
            }

            return response()->json([
                'status' => 200,
                'data' => [
                    'blog' => new BlogResource($blog),
                ],
            ]);
        });
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        return apiResponse(function () use ($request, $id) {
            $blog = Blog::where('user_id', Auth::id())->findOrFail($id);

            if (!$blog) {
                return response()->json([
                    'success' => false,
                    'message' => 'Blog not found',
                ], 404);
            }

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'required|string',
                'image' => 'nullable|image',
                'status' => 'required|in:active,inactive',
                'category_id' => [
                    'required',
                    'exists:categories,id',
                    function ($attribute, $value, $fail) {
                        $category = Category::find($value);
                        if ($category && $category->type !== 'post') {
                            $fail('The selected category is not of type blog.');
                        }
                    },
                ],
            ]);

            $imagePath = null;
            if ($request->hasFile('image') && isset($request->image)) {
                if ($blog->image) {
                    Storage::disk('public')->delete($blog->image);
                }
                $imagePath = $request->file('image')->store('blogs', 'public');
            }

            $blog->update([
                'title' => $validated['title'],
                'content' => $validated['content'],
                'image' => $imagePath ? $imagePath : $blog->image,
                'category_id' => $validated['category_id'],
                'status' => $validated['status'],
            ]);

            return response()->json([
                'status' => 200,
                'message' => 'Blog updated successfully',
                'data' => [
                    'blog' => new BlogResource($blog),
                ],
            ]);
        });
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $id)
    {
        return apiResponse(function () use ($request, $id) {
            $blog = Blog::where('user_id', Auth::id())->findOrFail($id);

            if (!$blog) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to delete this blog or it does not exist.',
                ]);
            }

            if ($blog->image) {
                Storage::disk('public')->delete($blog->image);
            }

            $blog->delete();

            return response()->json([
                'success' => true,
                'message' => 'Blog deleted successfully',
            ]);
        });
    }
}
