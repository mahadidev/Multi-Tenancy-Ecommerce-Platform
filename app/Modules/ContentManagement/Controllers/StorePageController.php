<?php

namespace App\Modules\ContentManagement\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\StoreManagement\Resources\StorePagesResource;
use App\Modules\StoreManagement\Models\Store;
use App\Modules\ContentManagement\Models\StorePage;
use App\Modules\ThemeManagement\Models\Theme;
use App\Modules\ContentManagement\Models\Widget;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class StorePageController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search'); // Search keyword
        $sort = $request->input('sort'); // Sort order,
        $perPage = $request->input('per_page'); // Items per page,

        $pages = StorePage::authorized()
            ->with('widgets')
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
            'page_type_id' => 'required|exists:page_types,id',
            'title' => 'nullable|string',
            'layout_id' => 'nullable|exists:widgets,id',
            'is_active' => 'nullable|boolean',

            'widgets' => 'nullable|array',
            'widgets.*.name' => 'required|string',
            'widgets.*.label' => 'required|string',
            'widgets.*.serial' => 'nullable|numeric',
            'widgets.*.thumbnail' => 'nullable|string',
            'widgets.*.widget_type_id' => 'required|exists:widget_types,id',
            'widgets.*.inputs' => 'nullable|array',
            'widgets.*.inputs.*.parent_id' => 'nullable|exists:widget_inputs,id',
            'widgets.*.inputs.*.input_type_id' => ['required', 'exists:widget_input_types,id'],
            'widgets.*.inputs.*.name' => 'required|string',
            'widgets.*.inputs.*.label' => 'required|string',
            'widgets.*.inputs.*.placeholder' => 'nullable|string',
            'widgets.*.inputs.*.value' => 'nullable|string',
            'widgets.*.inputs.*.options' => 'nullable|array',
            'widgets.*.inputs.*.required' => 'nullable|boolean',


            'widgets.*.inputs.child' => 'nullable|array',
            'widgets.*.inputs.*.child.*.input_type_id' => ['required', 'exists:widget_input_types,id'],
            'widgets.*.inputs.*.child.*.name' => 'required|string',
            'widgets.*.inputs.*.child.*.label' => 'required|string',
            'widgets.*.inputs.*.child.*.placeholder' => 'nullable|string',
            'widgets.*.inputs.*.child.*.value' => 'nullable|string',
            'widgets.*.inputs.*.child.*.options' => 'nullable|array',
            'widgets.*.inputs.*.child.*.required' => 'nullable|boolean',
        ]);

        $validatedData['store_id'] = authStore();
        $validatedData["type"] = $validatedData["page_type_id"];


        $slug = $validatedData['slug'] ?? Str::slug($validatedData['name']); // Generate slug from name
        $originalSlug = $slug;
        $counter = 1;

        // Check if slug already exists in the `store_pages` table
        while (StorePage::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        // if not layout
        if(!isset($validatedData["layout_id"])){
            $theme = Store::where(["id" => authStore()])->first();

            $validatedData["layout_id"] = Widget::where(["ref_type" => Theme::class, "ref_id" => $theme->id, "type_id" => 1])->first() ? Widget::where(["ref_type" => Theme::class, "ref_id" => $theme->id, "type_id" => 1])->first()->id : null;

        }

        // $storePage = StorePage::authorized()->create($validatedData);
        $storePage = StorePage::create([
            'store_id' =>  $validatedData['store_id'],
            'name' => $validatedData['name'],
            'slug' => $slug, // Use unique slug
            'type' => $validatedData['page_type_id'],
            'title' => $validatedData['title'],
            'layout_id' => $validatedData['layout_id'],
            'is_active' => $validatedData['is_active'] ?? false,
        ]);

        // Create the widgets for the store page if they exist
        if ($request->has('widgets')) {
            foreach ($request->widgets as $key => $widget) {
                $widgetData = [
                    'name' => $widget['name'],
                    'label' => $widget['label'],
                    'type_id' => $widget['widget_type_id'] ?? 3,
                    'serial' => isset($widget['serial']) ? $widget['serial'] : $key + 1,
                    'thumbnail' => $widget['thumbnail'] ?? null,
                ];

                $storePageWidget = $storePage->widgets()->create($widgetData);

                // Create the inputs for the widget
                if (isset($widget['inputs'])) {
                    foreach ($widget['inputs'] as $key2 => $input) {
                        $inputData = [
                            'parent_id' => isset($input['parent_id']) ? $input['parent_id'] : null,
                            'type_id' => $input['input_type_id'],
                            'name' => $input['name'],
                            'label' => $input['label'],
                            'placeholder' => $input['placeholder'] ?? null,
                            'value' => $input['value'] ?? null,
                            'options' => isset($input['options']) ?  json_encode($input['options']) : null,
                            'required' => $input['required'] ?? false,
                        ];

                        $storePageWidgetInput = $storePageWidget->widgetInputs()->create($inputData);

                        if(isset($input["child"])){
                            foreach ($input['child'] as $key2 => $childInput) {
                                $inputData = [
                                    'parent_id' => $storePageWidgetInput->id,
                                    'type_id' => $childInput['input_type_id'],
                                    'name' => $childInput['name'],
                                    'label' => $childInput['label'],
                                    'placeholder' => $childInput['placeholder'] ?? null,
                                    'value' => $childInput['value'] ?? null,
                                    'options' => isset($childInput['options']) ? json_encode($childInput['options']) : null,
                                    'required' => $childInput['required'] ?? false,
                                ];

                                $storePageWidgetInputChild = $storePageWidget->widgetInputs()->create($inputData);
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
                'data' => [
                    'store_page' => StorePagesResource::make($storePage->load('widgets.widgetInputs')),
                ],
            ],
            200,
        );
    }

    public function view(Request $request, $page_id)
    {
        $page = StorePage::authorized()->with('widgets')->where('id', $page_id)->first();

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
            'name' => 'nullable|string',
            'slug' => 'nullable|string|max:25',
            'type_id' => 'nullable|exists:page_types,id',
            'title' => 'nullable|string',
            'layout_id' => 'nullable|exists:widgets,id',
            'is_active' => 'nullable|boolean',

            'widgets' => 'nullable|array',
            'widgets.*.name' => 'required|string',
            'widgets.*.label' => 'required|string',
            'widgets.*.serial' => 'nullable|numeric',
            'widgets.*.thumbnail' => 'nullable|string',
            'widgets.*.type_id' => 'required|exists:widget_types,id',
            'widgets.*.inputs' => 'nullable|array',
            'widgets.*.inputs.*.parent_id' => 'nullable|exists:widget_inputs,id',
            'widgets.*.inputs.*.type_id' => ['required', 'exists:widget_input_types,id'],
            'widgets.*.inputs.*.name' => 'required|string',
            'widgets.*.inputs.*.label' => 'required|string',
            'widgets.*.inputs.*.placeholder' => 'nullable|string',
            'widgets.*.inputs.*.value' => 'nullable|string',
            'widgets.*.inputs.*.options' => 'nullable|array',
            'widgets.*.inputs.*.required' => 'nullable|boolean',


            'widgets.*.inputs.child' => 'nullable|array',
            'widgets.*.inputs.*.child.*.type_id' => ['required', 'exists:widget_input_types,id'],
            'widgets.*.inputs.*.child.*.name' => 'required|string',
            'widgets.*.inputs.*.child.*.label' => 'required|string',
            'widgets.*.inputs.*.child.*.placeholder' => 'nullable|string',
            'widgets.*.inputs.*.child.*.value' => 'nullable|string',
            'widgets.*.inputs.*.child.*.options' => 'nullable|array',
            'widgets.*.inputs.*.child.*.required' => 'nullable|boolean',
        ]);


        $validatedData["type"] = $validatedData["type_id"];

         // Get the existing slug from the database
        $slug = $storePage->slug;

        // If a new slug is provided, check for uniqueness
        if (!empty($validatedData['slug'])) {
            $newSlug = Str::slug($validatedData['slug']);
            $originalSlug = $newSlug;
            $counter = 1;

            // Ensure slug uniqueness (excluding the current store page)
            while (StorePage::where('slug', $newSlug)->where('id', '!=', $storePage->id)->exists()) {
                $newSlug = $originalSlug . '-' . $counter;
                $counter++;
            }

            $slug = $newSlug;
        }

        $validatedData['slug'] = $slug;

        // Update the store page's basic details
        $storePage->update($validatedData);

        // Process widgets if provided
        if ($request->has('widgets')) {
            $storePage->widgets()->delete();

            foreach ($request->widgets as $key => $widget) {
                $widgetData = [
                    'name' => $widget['name'],
                    'label' => $widget['label'],
                    'type_id' => $widget['type_id'] ?? null,
                    'serial' => isset($widget['serial']) ? $widget['serial'] : $key + 1,
                    'thumbnail' => $widget['thumbnail'] ?? null,
                ];

                $storePageWidget = $storePage->widgets()->create($widgetData);

                // Create the inputs for the widget
                if (isset($widget['inputs'])) {

                    $storePageWidget->widgetInputs()->delete();

                    foreach ($widget['inputs'] as $key2 => $input) {
                        $inputData = [
                            'parent_id' => isset($input['parent_id']) ? $input['parent_id'] : null,
                            'type_id' => $input['type_id'],
                            'name' => $input['name'],
                            'label' => $input['label'],
                            'placeholder' => $input['placeholder'] ?? null,
                            'value' => $input['value'] ?? null,
                            'options' => isset($input['options']) ? json_encode($input['options']) : null,
                            'required' => $input['required'] ?? false,
                        ];

                        $storePageWidgetInput = $storePageWidget->widgetInputs()->create($inputData);

                        if (isset($input["child"])) {
                            foreach ($input['child'] as $key2 => $childInput) {
                                $inputData = [
                                    'parent_id' => $storePageWidgetInput->id,
                                    'type_id' => $childInput['type_id'],
                                    'name' => $childInput['name'],
                                    'label' => $childInput['label'],
                                    'placeholder' => $childInput['placeholder'] ?? null,
                                    'value' => $childInput['value'] ?? null,
                                    'options' => isset($childInput['options']) ? json_encode($childInput['options']) : null,
                                    'required' => $childInput['required'] ?? false,
                                ];

                                $storePageWidgetInputChild = $storePageWidget->widgetInputs()->create($inputData);
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
                'data' => new StorePagesResource($storePage->load('widgets.widgetInputs')),
            ],
            200,
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