<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Controller;
use App\Http\Resources\StoreResource;
use App\Models\Store;
use App\Models\StorePage;
use App\Models\StorePageWidget;
use Illuminate\Http\Request;

class StorePageController extends Controller
{
    public function pages(Request $request, $store_id)
    {
        $store = Store::storeOwner()->active()->find($store_id);
        
        if(!$store){
            return response()->json([
                'status' => 404,
                'message' => 'Invalid store id'
            ],404);
        }

        $pages = StorePage::with('widgets')->where('store_id', $store->id)->get();
       
        return response()->json([
            'status' => 200,
            'data' => [
                'pages' => $pages
            ]
        ],200);

    }

    public function store(Request $request, $store_id) 
    {

        $store = Store::storeOwner()->active()->find($store_id);

        if(!$store){
            return response()->json([
                'status' => 404,
                'message' => 'Invalid store id'
            ],404);
        }

        $validatedData = $request->validate([
            'name' => 'required|string',
            'slug' => 'nullable|string',
            'title' => 'nullable|string',
            'is_active' => 'required|boolean',
            'widgets' => 'nullable|array',
            'widgets.*.name' => 'required|string',
            'widgets.*.label' => 'required|string',
            'widgets.*.inputs' => 'nullable|array',
            'widgets.*.inputs.*.name' => 'required|string',
            'widgets.*.inputs.*.label' => 'required|string',
            'widgets.*.inputs.*.value' => 'nullable|string',
            'widgets.*.inputs.*.placeholder' => 'nullable|string',
        ]);

        // Add the $store_id from the route to the validated data
        $validatedData['store_id'] = $store_id;

        $storePage = StorePage::create($validatedData);

        if($request->has('widgets')){
            foreach($request->widgets as $widget){
                $storePageWidget = StorePageWidget::create([
                    'store_page_id' => $storePage->id,
                    'name' => $widget['name'],
                    'label' => $widget['label'],
                    'inputs' => $widget['inputs'],
                ]);
            }
        }
        

        return response()->json([
            'message' => 'Store page created successfully.',
            'data' => $storePage->load('widgets'),
        ], 201);
    }

    public function view(Request $request, $store_id, $page_id){
       
        $store = Store::storeOwner()->active()->find($store_id);
        if(!$store){
            return response()->json([
                'status' => 404,
                'message' => 'Invalid store id'
            ],404);
        }

        $page = StorePage::with('widgets')->where('store_id', $store->id)->where('id',$page_id)->first();
        if(!$page){
            return response()->json([
                'status' => 404,
                'message' => 'Invalid store page id'
            ],404);
        }

        return response()->json([
            'status' => 200,
            'data' => [
                'page' => $page
            ]
        ],200);

    }

    public function update(Request $request, $store_id, $store_page_id)
    {
        // Check if the store exists and is active
        $store = Store::storeOwner()->active()->find($store_id);

        if (!$store) {
            return response()->json([
                'status' => 404,
                'message' => 'Invalid store id',
            ], 404);
        }

        // Find the store page to update
        $storePage = StorePage::where('store_id', $store_id)->find($store_page_id);

        if (!$storePage) {
            return response()->json([
                'status' => 404,
                'message' => 'Invalid store page id',
            ], 404);
        }

        // Validate the request data
        $validatedData = $request->validate([
            'name' => 'required|string',
            'slug' => 'nullable|string',
            'title' => 'nullable|string',
            'is_active' => 'required|boolean',
            'widgets' => 'nullable|array',
            'widgets.*.id' => 'nullable|exists:store_page_widgets,id',
            'widgets.*.name' => 'required|string',
            'widgets.*.label' => 'required|string',
            'widgets.*.inputs' => 'nullable|array',
            'widgets.*.inputs.*.name' => 'required|string',
            'widgets.*.inputs.*.label' => 'required|string',
            'widgets.*.inputs.*.value' => 'nullable|string',
            'widgets.*.inputs.*.placeholder' => 'nullable|string',
        ]);

        // Update the store page
        $storePage->update($validatedData);

        // Update widgets if provided
        if ($request->has('widgets')) {
            $storePage->widgets()->delete();

            foreach ($validatedData['widgets'] as $widget) {
                StorePageWidget::create([
                    'store_page_id' => $storePage->id,
                    'name' => $widget['name'],
                    'label' => $widget['label'],
                    'inputs' => $widget['inputs'] ?? [],
                ]);
            }
           
        }

        // Return a success response
        return response()->json([
            'message' => 'Store page updated successfully.',
            'data' => $storePage->load('widgets'),
        ], 200);
    }

}
