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
        // Retrieve query parameters
        $search = $request->input('search'); // Search keyword
        $sort = $request->input('sort'); // Sort order
        $perPage = $request->input('per_page'); // Items per page
    
        // Build the base query
        $blogs = Blog::authorized()
            ->with('category')
            ->when($search, function ($query) use ($search) {
                $query->whereRaw('LOWER(title) LIKE ?', ['%' . strtolower($search) . '%'])->orWhereRaw('LOWER(slug) LIKE ?', ['%' . strtolower($search) . '%']);
            })
            ->when($sort, fn($query) => $query->orderBy('created_at', $sort), fn($query) => $query->latest());
    
        // Paginate or get all results based on the presence of `per_page`
        $paginated = $perPage ? $blogs->paginate($perPage) : $blogs->get();
    
        // Prepare the response
        $response = [
            'status' => 200,
            'data' => [
                'blogs' => BlogResource::collection($paginated),
            ],
        ];
    
        // Add pagination meta data if `per_page` is provided
        if ($perPage) {
            $response['meta'] = [
                'current_page' => $paginated->currentPage(),
                'first_page_url' => $paginated->url(1),
                'last_page' => $paginated->lastPage(),
                'last_page_url' => $paginated->url($paginated->lastPage()),
                'next_page_url' => $paginated->nextPageUrl(),
                'prev_page_url' => $paginated->previousPageUrl(),
                'total' => $paginated->total(),
                'per_page' => $paginated->perPage(),
            ];
        }
    
        return response()->json($response, 200);
    }
    
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'title' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) {
                    if (Blog::where('title', $value)->where('user_id', Auth::id())->exists()) {
                        $fail('The title has already been taken.');
                    }
                },
            ],
            'content' => 'required|string',
            'image' => 'nullable|string|max:255',
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


        $blog = Blog::create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'image' => $validated['image'],
            'category_id' => $validated['category_id'],
            'status' => $validated['status'],
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Blog created successfully',
            'data' =>  [
                'blog' => new BlogResource($blog),
            ],
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $id)
    {
        $blog = Blog::with('category')->authorized()->find($id);

        // show error if blog is not found
        if (!$blog) {
            return response()->json([
                'status' => 404,
                'message' => 'Blog not found',
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' =>  [
                'blog' => new BlogResource($blog),
            ],
        ],200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $blog = Blog::authorized()->find($id);

        if (!$blog) {
            return response()->json([
                'status' => 404,
                'message' => 'Blog not found',
            ], 404);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'title' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) use ($id) {
                    if (Blog::where('title', $value)->where('user_id', Auth::id())->where('id', '!=', $id)->exists()) {
                        $fail('The title has already been taken.');
                    }
                },
            ],
            'content' => 'required|string',
            'image' => 'nullable|string|max:255',
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

        $blog->update([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'image' => $validated['image'],
            'category_id' => $validated['category_id'],
            'status' => $validated['status'],
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Blog updated successfully',
            'data' => [
                'blog' => new BlogResource($blog),
            ],
        ],200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $id)
    {
        $blog = Blog::authorized()->find($id);

        if (!$blog) {
            return response()->json([
                'status' => 404,
                'message' => 'Blog not found',
            ], 404);
        }

        $blog->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Blog deleted successfully',
        ],200);
    }
}
