<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\User;
use App\Http\Resources\CartResource;

class CartController extends Controller
{
    public function placeOrder(Request $request){
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'product_id' => 'required|exists:products,id',
            'qty' => 'required|min:1',
            'session_id' => 'nullable'
        ]);

        $product = Product::authorized()->find($request->product_id);
        $user = User::storeRegistered()->find($request->user_id);

        if(!$product){
            return response()->json([
                'status' => 404,
                'message' => 'Invalid Product Id, this product do not belong to this store'
            ],404);
        }

        if(!$user){
            return response()->json([
                'status' => 404,
                'message' => 'Invalid User Id, not a registered user for this store'
            ],404);
        }

        $response = \App\Http\Controllers\Api\v1\site\CartController::addToCart($request, $user->id, true);

        return $response->original;

    }

    public function getCartItems(Request $request){

        $request->validate([
            'user_id' => 'required|exists:users,id', // user_id is required and must exist in the users table
        ]);
    
        // If validation passes, proceed with your logic
        $user = User::storeRegistered()->find($request->input('user_id'));

        if(!$user){
            return response()->json([
                'status' => 404,
                'message' => 'Invalid User Id, not a registered user for this store'
            ],404);
        }

        return response()->json([
            'status' => 200,
            'data' => [
                'cart_items' => CartResource::collection($user->cartItems),
            ],
        ]);
    }

    public function updateCartItem(Request $request){
        $request->validate([
            'cart_id' => 'required|exists:carts,id',
            'qty' => 'required|numeric|min:1',
        ]);

        $response = \App\Http\Controllers\Api\v1\site\CartController::updateCartItem($request);

        return $response->original;
    }

    public function deleteCartItem(Request $request){
        $request->validate([
            'cart_id' => 'required|exists:carts,id',
        ]);

        $response = \App\Http\Controllers\Api\v1\site\CartController::deleteCartItem($request);
        return $response->original;
    }
}
