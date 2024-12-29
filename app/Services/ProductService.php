<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductService
{

    public static function index(Request $request)
    {
        $query = Product::with('category','store','variants')->active();

        if ($request->has('category') && $request->input('category') != '') {
            $query->whereIn('category_id', $request->input('category'));
        }

        // if (($request->has('brands'))) {
        //     $query->whereIn('category_id', $request->input('brands'));
        // }

        // Apply filter sorting
        if ($request->has('filter')) {
            $filter = $request->input('filter');

            if ($filter == 'trending') {
                $query->where('is_trend', 1);
            } elseif ($filter == 'a_z') {
                $query->orderBy('name', 'ASC');
            } elseif ($filter == 'z_a') {
                $query->orderBy('name', 'DESC');
            } elseif ($filter == 'low_high') {
                $query->orderBy('price', 'ASC');
            } elseif ($filter == 'high_low') {
                $query->orderBy('price', 'DESC');
            } else {
                $query->latest(); // Default sorting by latest if no specific filter applied
            }
        } else {
            $query->latest(); // Apply latest sorting if no filter is provided
        }

        if ($request->has('range')) {
            $min = $request->input('range')['min'];
            $max = $request->input('range')['max'];
            $query->whereBetween('price', [$min, $max]);
        }


        if ($request->has('paginate')) {
            $products = $query->paginate($request->input('perPage'));
            return $products;
        }

        $products = $query->get();

        return $products;
    }
}