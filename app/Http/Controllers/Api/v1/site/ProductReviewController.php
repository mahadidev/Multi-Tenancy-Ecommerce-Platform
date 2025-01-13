<?php

namespace App\Http\Controllers\Api\v1\site;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProductReview;
use App\Models\StoreSession;

class ProductReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $reviews = ProductReview::where('product_id', $request->product_id)
            // ->where('user_id', auth()->id())
            ->where('store_id', authStore())
            ->get();

        return response()->json([
            'status' => 200,
            'data' => [
                'reviews' => $reviews,
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating' => 'nullable|integer|min:1|max:5',
            'review' => 'nullable|string',
        ]);

        $review = ProductReview::create([
            'product_id' => $validated['product_id'],
            'store_id' => authStore(),
            'user_id' => auth()->id(),
            'rating' => $validated['rating'],
            'review' => $validated['review'],
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Review has been submitted',
            'data' => [
                'review' => $review,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $review = ProductReview::find($id)
            ->where('user_id', auth()->id())
            ->where('store_id', authStore());

        if (!$review) {
            return response()->json([
                'status' => 404,
                'message' => 'Review not found',
            ]);
        }

        $validated = $request->validate([
            'rating' => 'nullable|integer|min:1|max:5',
            'review' => 'nullable|string',
        ]);

        $review->update([
            'rating' => $validated['rating'],
            'review' => $validated['review'],
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Review has been updated',
            'data' => [
                'review' => $review,
            ],
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */

    public function destroy(string $id)
    {
        $review = ProductReview::where('id', $id)
            ->where('store_id', authStore())
            ->first();

        if (!$review) {
            return response()->json([
                'status' => 404,
                'message' => 'Review not found',
            ]);
        }

        $user = auth()->user();

        if ($user->hasRole('user') && $review->user_id === $user->id) {
            // User can delete their own review
            $review->delete();
        } elseif ($user->hasRole('seller')) {
            $storeSession = StoreSession::where('store_id', $review->store_id)
                ->where('user_id', $user->id)
                ->exists();

            if ($storeSession) {
                // Seller can delete review if they belong to the store
                $review->delete();
            } else {
                return response()->json([
                    'status' => 403,
                    'message' => 'Unauthorized to delete this review2',
                ]);
            }
        } else {
            return response()->json([
                'status' => 403,
                'message' => 'Unauthorized to delete this review',
            ]);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Review has been deleted',
        ]);
    }
}
