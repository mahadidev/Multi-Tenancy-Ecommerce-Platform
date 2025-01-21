<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Controller;
use App\Http\Resources\StorePagesResource;
use App\Http\Resources\StoreResource;
use App\Models\Store;
use App\Models\StorePage;
use App\Models\StorePageWidget;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class StorePageController extends Controller
{
    public function index(Request $request, $store_id)
    {
        $store = Store::storeOwner()->find($store_id);

        if (!$store) {
            return response()->json(
                [
                    'status' => 404,
                    'message' => 'store not found',
                ],
                404,
            );
        }

        $search = $request->input('search'); // Search keyword
        $sort = $request->input('sort', 'desc'); // Sort order, default is 'desc'
        $perPage = $request->input('per_page', 10); // Items per page, default is 10

        $pages = StorePage::with('widgets')
            ->where('store_id', $store_id)
            ->when($search, function ($query, $search) {
                $query
                    ->where('name', 'like', '%' . $search . '%')
                    ->orWhere('slug', 'like', '%' . $search . '%')
                    ->orWhere('title', 'like', '%' . $search . '%');
            })
            ->orderBy('created_at', $sort) // Sort by 'created_at' in the specified order
            ->paginate($perPage);

        return response()->json(
            [
                'status' => 200,
                'data' => [
                    'pages' => StorePagesResource::collection($pages),
                ],
                'meta' => [
                    'current_page' => $pages->currentPage(),
                    'first_page_url' => $pages->url(1),
                    'last_page' => $pages->lastPage(),
                    'last_page_url' => $pages->url($pages->lastPage()),
                    'next_page_url' => $pages->nextPageUrl(),
                    'prev_page_url' => $pages->previousPageUrl(),
                    'total' => $pages->total(),
                    'per_page' => $pages->perPage(),
                ],
            ],
            200,
        );
    }

    public function store(Request $request, $store_id)
    {
        $store = Store::storeOwner()->find($store_id);

        if (!$store) {
            return response()->json(
                [
                    'status' => 404,
                    'message' => 'Invalid store id',
                ],
                404,
            );
        }

        $validatedData = $request->validate([
            'name' => 'required|string',
            'slug' => 'nullable|string|max:25|unique:store_pages,slug',
            'type' => 'required|exists:page_types,id',
            'title' => 'nullable|string',
            'is_active' => 'required|boolean',
            'widgets' => 'nullable|array',
            'widgets.*.name' => 'required|string',
            'widgets.*.label' => 'required|string',
            'widgets.*.serial' => 'nullable|numeric',
            'widgets.*.thumbnail' => 'nullable|string',
            'widgets.*.inputs' => 'nullable|array',
            'widgets.*.inputs.*.name' => 'required|string',
            'widgets.*.inputs.*.label' => 'required|string',
            'widgets.*.inputs.*.placeholder' => 'nullable|string',
            'widgets.*.inputs.*.value' => 'nullable|string',
            'widgets.*.inputs.*.required' => 'nullable|boolean',
            'widgets.*.inputs.*.type' => 'required|string',
            'widgets.*.inputs.*.items' => 'nullable|array',
            'widgets.*.inputs.*.items.*.name' => 'required|string',
            'widgets.*.inputs.*.items.*.label' => 'required|string',
            'widgets.*.inputs.*.items.*.placeholder' => 'nullable|string',
            'widgets.*.inputs.*.items.*.value' => 'nullable|string',
            'widgets.*.inputs.*.items.*.required' => 'required|boolean',
            'widgets.*.inputs.*.items.*.type' => 'nullable|string',
        ]);

        // Add the $store_id from the route to the validated data
        $validatedData['store_id'] = $store_id;

        $storePage = StorePage::create($validatedData);

        // Create the widgets for the store page if they exist
        if ($request->has('widgets')) {
            foreach ($request->widgets as $key => $widget) {
                $storePageWidgetData = [
                    'name' => $widget['name'],
                    'label' => $widget['label'],
                    'serial' => isset($widget['label']) ? $widget['serial'] : ($key + 1),

                ];

                $storePageWidget = $storePage->widgets()->create($storePageWidgetData);

                // Create the inputs for the widget
                if (isset($widget['inputs'])) {
                    foreach ($widget['inputs'] as $input) {
                        $inputData = [
                            'name' => $input['name'],
                            'label' => $input['label'],
                            'placeholder' => $input['placeholder'],
                            'value' => $input['value'],
                            'required' => $input['required'],
                            'type' => $input['type'],
                        ];

                        $storePageWidgetInput = $storePageWidget->widgetInputs()->create($inputData);

                        // Create the items for the input
                        if (isset($input['items'])) {
                            foreach ($input['items'] as $item) {
                                $itemData = [
                                    'name' => $item['name'],
                                    'label' => $item['label'],
                                    'placeholder' => $item['placeholder'],
                                    'value' => $item['value'],
                                    'required' => $item['required'],
                                    'type' => $item['type'],
                                ];

                                $storePageWidgetInput->items()->create($itemData);
                            }
                        }
                    }
                }
            }
        }

        return response()->json(
            [
                'status' => 200,
                'message' => 'Store page created successfully.',
                'data' => new StorePagesResource($storePage->load('widgets')),
            ]
        );
    }

    public function view(Request $request, $store_id, $page_id)
    {
        $store = Store::active()->find($store_id);
        if (!$store) {
            return response()->json(
                [
                    'status' => 404,
                    'message' => 'Invalid store id',
                ],
                404,
            );
        }

        $page = StorePage::with('widgets')
            ->where('store_id', $store->id)
            ->where('id', $page_id)
            ->first();
        if (!$page) {
            return response()->json(
                [
                    'status' => 404,
                    'message' => 'Invalid store page id',
                ],
                404,
            );
        }

        return response()->json(
            [
                'status' => 200,
                'data' => [
                    'page' => new StorePagesResource($page),
                ],
            ],
            200,
        );
    }

    public function update(Request $request, $store_id, $store_page_id)
    {
        // Check if the store exists and is active
        $store = Store::storeOwner()->active()->find($store_id);

        if (!$store) {
            return response()->json(
                [
                    'status' => 404,
                    'message' => 'Invalid store id',
                ],
                404,
            );
        }

        // Find the store page to update
        $storePage = StorePage::where('store_id', $store_id)->find($store_page_id);

        if (!$storePage) {
            return response()->json(
                [
                    'status' => 404,
                    'message' => 'Invalid store page id',
                ],
                404,
            );
        }

        // Validate the request data
        $validatedData = $request->validate([
            'name' => 'nullable|string',
            'slug' => [
                'nullable',
                'string',
                'max:25',
                Rule::unique('store_pages', 'slug')->ignore($store_page_id), // Unique rule for update
            ],
            'type' => 'nullable|exists:page_types,id',
            'title' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'widgets' => 'nullable|array',
            'widgets.*.name' => 'required|string',
            'widgets.*.label' => 'required|string',
            'widgets.*.serial' => 'nullable|numeric',
            'widgets.*.thumbnail' => 'nullable|string',
            'widgets.*.inputs' => 'nullable|array',
            'widgets.*.inputs.*.name' => 'required|string',
            'widgets.*.inputs.*.label' => 'required|string',
            'widgets.*.inputs.*.placeholder' => 'nullable|string',
            'widgets.*.inputs.*.value' => 'nullable|string',
            'widgets.*.inputs.*.required' => 'nullable|boolean',
            'widgets.*.inputs.*.type' => 'required|string',
            'widgets.*.inputs.*.items' => 'nullable|array',
            'widgets.*.inputs.*.items.*.name' => 'required|string',
            'widgets.*.inputs.*.items.*.label' => 'required|string',
            'widgets.*.inputs.*.items.*.placeholder' => 'nullable|string',
            'widgets.*.inputs.*.items.*.value' => 'nullable|string',
            'widgets.*.inputs.*.items.*.required' => 'required|boolean',
            'widgets.*.inputs.*.items.*.type' => 'required|string',
        ]);

        // Update the store page's basic details
        $storePage->update($validatedData);

        // Process widgets if provided
        if ($request->has('widgets')) {

            $storePage->widgets()->delete();

            foreach ($request->widgets as $key => $widget) {
                $widgetData = [
                    'name' => $widget['name'],
                    'label' => $widget['label'],
                    'serial' => isset($widget['serial']) ? $widget['serial'] : ($key + 1),
                ];

                $storePageWidget = $storePage->widgets()->create($widgetData);

                // Process inputs if provided
                if (isset($widget['inputs'])) {

                    $storePageWidget->widgetInputs()->delete();

                    foreach ($widget['inputs'] as $input) {
                        $inputData = [
                            'name' => $input['name'] ?? null,
                            'label' => $input['label'] ?? null,
                            'placeholder' => $input['placeholder'] ?? null,
                            'value' => $input['value'] ?? null,
                            'required' => $input['required'] ?? null,
                            'type' => $input['type'] ?? null,
                        ];

                        $storePageWidgetInput = $storePageWidget->widgetInputs()->create($inputData);

                        // Process items if provided
                        if (isset($input['items'])) {

                            $storePageWidgetInput->items()->delete();

                            foreach ($input['items'] as $item) {
                                $itemData = [
                                    'name' => $item['name'] ?? null,
                                    'label' => $item['label'] ?? null,
                                    'placeholder' => $item['placeholder'] ?? null,
                                    'value' => $item['value'] ?? null,
                                    'required' => $item['required'] ?? null,
                                    'type' => $item['type'] ?? null,
                                ];

                                $storePageWidgetInput->items()->create($itemData);
                            }
                        }
                    }
                }
            }
        }

        return response()->json(
            [
                'status' => 200,
                'message' => 'Store page updated successfully.',
                'data' => new StorePagesResource($storePage->load('widgets.widgetInputs.items')),
            ]
        );
    }

    public function destroy(Request $request, $store_id, $store_page_id)
    {
        // Check if the store exists and is active
        $store = Store::storeOwner()->active()->find($store_id);

        if (!$store) {
            return response()->json(
                [
                    'status' => 404,
                    'message' => 'Invalid store id',
                ],
                404,
            );
        }

        // Find the store page to delete
        $storePage = StorePage::where('store_id', $store_id)->find($store_page_id);

        if (!$storePage) {
            return response()->json(
                [
                    'status' => 404,
                    'message' => 'Invalid store page id',
                ],
                404,
            );
        }

        // Delete the store page
        $storePage->delete();

        // Return a success response
        return response()->json(
            [
                'message' => 'Store page deleted successfully.',
                'status' => 200,
            ],
            200,
        );
    }
}
