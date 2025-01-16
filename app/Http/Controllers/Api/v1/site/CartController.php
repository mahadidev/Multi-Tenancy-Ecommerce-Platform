<?php

namespace App\Http\Controllers\Api\v1\site;

use App\Http\Controllers\Controller;
use App\Http\Resources\CartResource;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;


class CartController extends Controller
{
    // need to work on product discount as well

    public function addToCart(Request $request)
    {
        return apiResponse(function () use ($request) {
            $validatedData = $request->validate([
                'product_id' => 'required|exists:products,id',
                'qty' => 'required|numeric|min:1',
                'note' => 'nullable|string',
                'options' => 'nullable',
            ]);

            // Get user_id
            $user_id = auth()->user()->id;

            if ($user_id) {
                // Check if store_id exists
                $store_id = session()->get('site_store_id');

                if (!$store_id) {
                    // show error message
                    return response()->json([
                        'status' => 401,
                        'message' => 'Store id is not found',
                    ]);
                }
            } else {
                // show error message
                return response()->json([
                    'status' => 401,
                    'message' => 'User is not authenticated',
                ]);
            }
            // Get store_id from session

            // Get product details
            $product = Product::find($validatedData['product_id']);

            // $product_price = $product->discount_price ?? $product->price; // validates the discount_to date and returns the actual price of product
            $product_price = $product->price; // validates the discount_to date and returns the actual price of product

            // Calculate the total price
            // $total = ($product->price - $product->discount + $product->vat) * $validatedData['qty'];
            $total = ($product_price + ($product->vat ?? 0)) * $validatedData['qty'];

            // Handle session for guests or user_id for logged-in users
            $sessionId = $request->has('session_id') ? $request->session_id : session()->getId();

            // Check if item already exists in the cart
            $cartItem = Cart::where('product_id', $product->id)
                ->where('store_id', $store_id)
                ->where(function ($query) use ($sessionId, $user_id) {
                    if ($user_id) {
                        $query->where('session_id', $sessionId)->orwhere('user_id', $user_id);
                    } else {
                        $query->where('session_id', $sessionId);
                    }
                })
                ->first();

            if ($cartItem) {
                // If item exists, update the quantity and total
                $cartItem->qty += $validatedData['qty'];
                $cartItem->total = ($product_price + ($product->vat ?? 0)) * $cartItem->qty;
                $cartItem->price = $product_price;
                // $cartItem->discount = ($product->checkDiscountValidity() == 1) ? $product->discount : 0;
                $cartItem->discount = 0;
                $cartItem->save();
            } else {
                // Add new item to the cart
                $addCartItem = Cart::create([
                    'store_id' => $store_id,
                    'user_id' => $user_id,
                    'product_id' => $product->id,
                    'session_id' => $sessionId,
                    'item' => $product->name,
                    'price' => $product_price,
                    'discount' => 0, //adjusting the discount percentage
                    'vat' => $product->vat ?? 0,
                    'qty' => $validatedData['qty'],
                    'total' => $total,
                    'note' => $request->input('note'),
                    'is_active' => 1,
                ]);
            }

            // Return success response
            return response()->json([
                'status' => 200,
                'session_id' => $sessionId,
                'message' => 'Product has been added to cart successfully.',
                'cart_item' => $cartItem ? new CartResource($cartItem) : new CartResource($addCartItem),
            ]);
        });
    }

    public function cartItems(Request $request)
    {
        $cartItems = auth()->user()->cartItems;

        return response()->json([
            'status' => 200,
            'message' => 'Cart Items',
            'data' => [
                'cart_items' => CartResource::collection($cartItems),
            ],
        ]);
    }

    public function updateCartItem(Request $request)
    {
        $validatedData = $request->validate([
            'cart_id' => 'required|exists:carts,id',
            'qty' => 'required|numeric|min:1',
        ]);

        $cartItem = Cart::find($validatedData['cart_id']);

        if (!$cartItem) {
            return response()->json([
                'status' => 404,
                'message' => 'Cart item not found!',
            ]);
        }

        $product = $cartItem->product;
        $product_price = $product->price; // validates the discount_to date and returns the actual price of product

        $cartItem->qty = $validatedData['qty'];
        $cartItem->total = ($product_price + ($product->vat ?? 0)) * $cartItem->qty;
        $cartItem->save();

        return response()->json([
            'status' => 200,
            'message' => 'Cart updated successfully',
            'data' => [
                'cart_item' => new CartResource($cartItem),
            ],
        ]);
    }

    public function deleteCartItem(Request $request)
    {
        $validatedData = $request->validate([
            'cart_id' => 'required|exists:carts,id',
        ]);

        $cartItem = Cart::find($validatedData['cart_id']);

        if (!$cartItem) {
            return response()->json([
                'status' => 404,
                'message' => 'Cart item not found!',
            ]);
        }

        $cartItem->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Cart item removed successfully',
        ]);
    }
}
