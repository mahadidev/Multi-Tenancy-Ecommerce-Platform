<?php

namespace App\Http\Controllers\Api\v1\Seller;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{

    // need to work on product discount as well

    public function addToCart(Request $request)
    {   

        // return $request->all();

        return apiResponse(function () use ($request) {
       
            $validatedData = $request->validate([
                'product_id' => 'required|exists:products,id',
                'qty' => 'required|numeric',
            ]);

            
            $store_id = 1;
    
            // Get product details
            $product = Product::find($validatedData['product_id']);
            
            // $product_price = $product->discount_price ?? $product->price; // validates the discount_to date and returns the actual price of product
            $product_price = $product->price; // validates the discount_to date and returns the actual price of product
    
            // Calculate the total price
            // $total = ($product->price - $product->discount + $product->vat) * $validatedData['qty'];
            $total = ($product_price +  ($product->vat ?? 0)) * $validatedData['qty'];
            
            // Handle session for guests or user_id for logged-in users
            $sessionId = session()->getId();
            // $userId = Auth::check() ? Auth::id() : null;
            $userId = 1;
            
            // Check if item already exists in the cart
            $cartItem = Cart::where('product_id', $product->id)->where('store_id', $store_id)
                ->where(function ($query) use ($sessionId, $userId) {
                    if($userId){
                        $query->where('session_id', $sessionId)->orwhere('user_id', $userId);
                    }
                    else{
                        $query->where('session_id', $sessionId);
                    }
                })
                ->first();
    
            if ($cartItem) {
                // If item exists, update the quantity and total
                $cartItem->qty += $validatedData['qty'];
                $cartItem->total = (($product_price + ($product->vat ?? 0)) * $cartItem->qty);
                $cartItem->price = $product_price;
                // $cartItem->discount = ($product->checkDiscountValidity() == 1) ? $product->discount : 0;
                $cartItem->discount = 0;
                $cartItem->save();
            } else {
                // Add new item to the cart
                Cart::create([
                    'store_id' => $store_id,
                    'user_id' => $userId,
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
                'message' => 'Product has been added to cart successfully.',
            ]);
        });

    }
}
