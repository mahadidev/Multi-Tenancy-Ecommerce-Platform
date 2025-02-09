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
    public function index(Request $request)
    {
        $search = $request->input('search'); // Search keyword
        $sort = $request->input('sort'); // Sort order,
        $perPage = $request->input('per_page'); // Items per page,

        $pages = StorePage::authorized()->with('widgets')
            ->when($search, function ($query, $search) {
                $query
                    ->where('name', 'like', '%' . $search . '%')
                    ->orWhere('slug', 'like', '%' . $search . '%')
                    ->orWhere('title', 'like', '%' . $search . '%');
            })
            ->when($sort, fn($query) => $query->orderBy('created_at', $sort), fn($query) => $query->latest());

        // Paginate or get all results based on the presence of `per_page`
        $paginated = $perPage ? $pages->paginate($perPage) : $pages->get();

        // Prepare the response
        $response = [
            'status' => 200,
            'data' => [
                'pages' => StorePagesResource::collection($paginated),
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

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string',
            'slug' => 'nullable|string|max:25|unique:store_pages,slug',
            'type' => 'required|exists:page_types,id',
            'title' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'widgets' => 'nullable|array',
            'widgets.*.name' => 'required|string',
            'widgets.*.label' => 'required|string',
            'widgets.*.serial' => 'nullable|numeric',
            'widgets.*.thumbnail' => 'nullable|string',
            'widgets.*.is_editable' => 'nullable|boolean',
            'widgets.*.widget_type_id' => 'nullable|exists:widget_types,id',
            'widgets.*.inputs' => 'nullable|array',
            'widgets.*.inputs.*.name' => 'required|string',
            'widgets.*.inputs.*.label' => 'required|string',
            'widgets.*.inputs.*.serial' => 'nullable|numeric',
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
        $validatedData["store_id"] = authStore();


        $storePage = StorePage::authorized()->create($validatedData);

        // Create the widgets for the store page if they exist
        if ($request->has('widgets')) {
            foreach ($request->widgets as $key => $widget) {
                $storePageWidgetData = [
                    'name' => $widget['name'],
                    'label' => $widget['label'],
                    'serial' =>  $widget['serial'] ?? ($key + 1),
                    'is_editable' => $widget['is_editable'] ?? true,
                    'widget_type_id' => $request->widget_type_id ?? null
                ];

                $storePageWidget = $storePage->widgets()->create($storePageWidgetData);

                // Create the inputs for the widget
                if (isset($widget['inputs'])) {
                    foreach ($widget['inputs'] as $key2 => $input) {
                        $inputData = [
                            'name' => $input['name'],
                            'label' => $input['label'],
                            'serial' => $input['serial'] ?? ($key2 + 1),
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
            ],
            200,
        );
    }

    public function view(Request $request, $page_id)
    {
        $page = StorePage::authorized()->with('widgets')
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

    public function update(Request $request, $store_page_id)
    {
        // Find the store page to update
        $storePage = StorePage::authorized()->find($store_page_id);

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
            'name' => 'required|string',
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
            'widgets.*.widget_type_id' => 'nullable|exists:widget_types,id',
            'widgets.*.is_editable' => 'nullable|boolean',
            'widgets.*.inputs' => 'nullable|array',
            'widgets.*.inputs.*.name' => 'required|string',
            'widgets.*.inputs.*.label' => 'required|string',
            'widgets.*.inputs.*.serial' => 'nullable|numeric',
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
                    'is_editable' => $widget['is_editable'] ?? true,
                    'widget_type_id' => $request->widget_type_id ?? null,
                ];

                $storePageWidget = $storePage->widgets()->create($widgetData);

                // Process inputs if provided
                if (isset($widget['inputs'])) {

                    $storePageWidget->widgetInputs()->delete();

                    foreach ($widget['inputs'] as $key2 => $input) {
                        $inputData = [
                            'name' => $input['name'] ?? null,
                            'label' => $input['label'] ?? null,
                            'serial' => isset($input['serial']) ? $input['serial'] : ($key2 + 1),
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
            , 200,
        );
    }

    public function destroy(Request $request, $store_page_id)
    {

        // Find the store page to delete
        $storePage = StorePage::authorized()->find($store_page_id);

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
