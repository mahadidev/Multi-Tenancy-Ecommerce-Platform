<?php

namespace App\Modules\StoreManagement\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\StoreManagement\Resources\StoreResource;
use App\Modules\StoreManagement\Models\Store;
use App\Modules\StoreManagement\Models\StorePage;
use App\Models\Theme;
use App\Models\ThemePage;
use App\Models\Widget;
use App\Models\WidgetInput;
use Illuminate\Http\Request;
use App\Modules\StoreManagement\Models\StoreSession;
use App\Models\StoreSocialMedia;
use App\Models\StoreType;
use App\Modules\StoreManagement\Services\StoreService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class StoreController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $search = $request->input('search'); // Search keyword
        $sort = $request->input('sort'); // Sort order, default is 'desc'
        $perPage = $request->input('per_page'); // Items per page, default is 10

        $stores = Store::with(['website'])
            ->where(["owner_id" => $user->id])
            ->when($search, function ($query, $search) {
                $query
                    ->where('name', 'like', '%' . $search . '%')
                    ->orWhere('domain', 'like', '%' . $search . '%');
            })
            ->when($sort, fn($query) => $query->orderBy('created_at', $sort), fn($query) => $query->latest());

        // Paginate or get all results based on the presence of `per_page`
        $paginated = $perPage ? $stores->paginate($perPage) : $stores->get();

        $storeSession = $user->storeSession()->first();
        $current_store = null;

        if ($storeSession) {
            // remove previous store id from session - check if session is started
            if ($request->hasSession()) {
                $request->session()->forget('store_id');
            }
            if (session()->isStarted() && session()->has('store_id')) {
                session()->forget('store_id');
            }

            // store the store id in session - check if session is available
            if (session()->isStarted()) {
                session(['store_id' => $storeSession->store_id]);
            }

            // Also set it in the request attributes
            $request->attributes->set('store_id', $storeSession->store_id);

            // find the store
            $current_store = Store::with(['website'])->find($storeSession->store_id);
        }

        if (!$storeSession) {
            $current_store = Store::with(['website'])->where('owner_id', $user->id)->first();

            if ($current_store) {
                StoreSession::updateOrCreate([
                    'user_id' => $user->id,
                ], [
                    'store_id' => $current_store->id,
                ]);

                if ($request->hasSession()) {
                    $request->session()->forget('store_id');
                }
                if (session()->isStarted() && session()->has('store_id')) {
                    session()->forget('store_id');
                }

                // store the store id in session - check if session is available
                if (session()->isStarted()) {
                    session(['store_id' => $current_store->id]);
                }

                // Also set it in the request attributes
                $request->attributes->set('store_id', $current_store->id);
            }
        }

        // Prepare the response
        $response = [
            'status' => 200,
            'data' => [
                'stores' => StoreResource::collection($paginated),
                'current_store' => $current_store ? new StoreResource($current_store) : null,
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

    public function show(Request $request, $id)
    {
        $store = Store::storeOwner()->active()->find($id);

        if (!$store) {
            return response()->json([
                'status' => 404,
                'message' => 'store not found'
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => [
                'store' => new StoreResource($store),
            ]
        ], 200);
    }

    public function store(Request $request)
    {
        // Validate the incoming request data
        $request->validate([
            'name' => 'required|string|max:255',
            'domain' => 'required|string|max:25|unique:stores|regex:/^[a-zA-Z0-9\-]+$/',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'location' => 'nullable|string|max:255',
            'currency' => 'nullable|string|max:255',
            'logo' => 'nullable|string|max:255',
            'dark_logo' => 'nullable|string|max:255',
            'settings' => 'nullable|array',
            'type' => 'nullable|string',
            'theme_id' => 'nullable|exists:themes,id',
            'description' => 'nullable|string',
            'store_type_id' => 'nullable|exists:store_types,id',
            'social_media' => 'nullable|array',
            'social_media.*.name' => 'required_with:social_media|string',
            'social_media.*.username' => 'required_with:social_media|string',
            'social_media.*.url' => 'required_with:social_media|string',
            'social_media.*.label' => 'required_with:social_media|string',
        ]);

        $theme_id = $request->theme_id ?? null;

        // Create a new store record
        $store = Store::create([
            'owner_id' => auth()->user()->id,
            'name' => $request->name,
            'slug' => $request->slug,
            'domain' => $request->domain ?? null,
            'email' => $request->email ?? null,
            'phone' => $request->phone ?? null,
            'location' => $request->location ?? null,
            'currency' => $request->currency ?? 'BDT',
            'logo' => $request->logo ?? null,
            "theme_id" => $theme_id,
            'dark_logo' => $request->dark_logo ?? null,
            'status' => $request->status ?? 1,
            'settings' => $request->settings ?? null,
            'description' => $request->description ?? null,
            'store_type_id' => $request->store_type_id ? $request->store_type_id : StoreType::first()->id,
        ]);

        if ($store->theme && $store->theme->widgets) {
            $store->widgets()->delete();
            foreach ($store->theme->widgets as $widget) {
                $store->widgets()->create([
                    'widget_type_id' => $widget->widget_type_id,
                    'name' => $widget->name,
                    'label' => $widget->label,
                    'inputs' => $widget->inputs,
                    'is_editable' => $widget->is_editable,
                    'thumbnail' => $widget->thumbnail,
                ]);
            }
        }

        if ($request->social_media) {
            foreach ($request->social_media as $social_media) {

                // Ensure required fields are present in each social media item
                if (isset($social_media['name'], $social_media['username'], $social_media['url'])) {
                    StoreSocialMedia::firstOrCreate(
                        [
                            'store_id' => $store->id,
                            'name' => $social_media['name'],
                        ],
                        [
                            'username' => $social_media['username'],
                            'url' => $social_media['url'],
                            'label' => $social_media['label'],
                        ]
                    );
                }
            }
        }

        // update store session
        $this->updateStoreSession($request, $store);

        // Return success response
        return response()->json([
            'status' => 200,
            'message' => 'Store created successfully.',
            'data' => [
                'store' => StoreResource::make($store),
            ]
        ], 200);
    }

    public function update(Request $request, $id)
    {
        // Find the store by ID
        $store = Store::storeOwner()->find($id);

        if (!$store) {
            return response()->json([
                'status' => 404,
                'message' => 'Store not found',
            ], 404);
        }

        // Validate the incoming request data
        $request->validate([
            'name' => 'nullable|string|max:255',
            'domain' => 'nullable|string|max:25|regex:/^[a-zA-Z0-9\-]+$/|unique:stores,domain,' . $store->id,
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'location' => 'nullable|string|max:255',
            'currency' => 'nullable|string|max:255',
            'logo' => 'nullable|string|max:255',
            'dark_logo' => 'nullable|string|max:255',
            'primary_color' => 'nullable|string|max:255',
            'secondary_color' => 'nullable|string|max:255',
            'settings' => 'nullable|array|max:1000000',
            "theme_id" => "nullable",
            'type' => 'nullable|string',
            'description' => 'nullable|string',
            'store_type_id' => 'nullable|exists:store_types,id',
            'social_media' => 'nullable|array',
            'social_media.*.name' => 'required_with:social_media|string',
            'social_media.*.username' => 'required_with:social_media|string',
            'social_media.*.url' => 'required_with:social_media|string',
            'social_media.*.label' => 'required_with:social_media|string',
        ]);

        $theme_id = $store->theme_id;
        if ($request->theme_id) {
            $theme = Theme::where("id", $request->theme_id)->first();

            if ($theme = Theme::where("id", $request->theme_id)->first()) {
                $theme_id = $theme->id;
            } else {
                $theme_id = null;
            }
        }

        // Update the store record
        $store->update([
            'name' => $request->name ?? $store->name,
            'domain' => $request->domain ?? $store->domain,
            'email' => $request->email ?? $store->email,
            'phone' => $request->phone ?? $store->phone,
            'location' => $request->location ?? $store->location,
            'currency' => $request->currency ?? $store->currency,
            'status' => $request->status ?? $store->status,
            'logo' => $request->logo ?? $store->logo,
            'dark_logo' => $request->dark_logo ?? $store->dark_logo,
            'primary_color' => $request->primary_color ?? $store->primary_color,
            'secondary_color' => $request->secondary_color ?? $store->secondary_color,
            'theme_id' => $theme_id,
            'settings' => $request->settings ? $request->settings : $store->settings,
            'store_type_id' => $request->store_type_id ? $request->store_type_id : $store->store_type_id,
            'description' => $request->description ?? $store->description,
        ]);

        if ($request->social_media) {
            $store->socialMedia()->delete();

            foreach ($request->social_media as $social_media) {
                if (isset($social_media['name'], $social_media['username'], $social_media['url'])) {
                    StoreSocialMedia::firstOrCreate(
                        [
                            'store_id' => $store->id,
                            'name' => $social_media['name'],
                        ],
                        [
                            'username' => $social_media['username'],
                            'url' => $social_media['url'],
                            'label' => $social_media['label']
                        ]
                    );
                }
            }
        }

        return response()->json([
            'status' => 200,
            'message' => 'Store updated successfully.',
            'data' => [
                'store' => new StoreResource($store),
            ]
        ], 200);
    }

    public function switchTheme(Request $request, $id)
    {
        $store = Store::storeOwner()->findOrFail($id);
        $store = Store::where(["id" => $store->id])->with("layouts","partials", "pages", "widgets")->first();

        $request->validate([
            'theme_id' => 'nullable|exists:themes,id',
            "import_demo" => "nullable|boolean"
        ]);

        if ($request->theme_id && Theme::where(["id" => $request->theme_id])->first()) {
            if ($request->import_demo) {
                // delete old data
                foreach ($store->pages as $page) {
                    Widget::where(["ref_type" => StorePage::class, "ref_id" => $page->id])->delete();
                    $page->delete();
                }
                Widget::where(["ref_type" => Store::class, "ref_id" => $store->id])->delete();

                $theme = Theme::where(["id" => $request->theme_id])->with(["widgets", "layouts", "partials", "pages"])->first();

                foreach ($theme->layouts as $widget) {
                    Widget::create([
                        "ref_type" => Store::class,
                        "ref_id" => $store->id,
                        'type_id' => $widget->type_id,
                        'name' => $widget->name,
                        'label' => $widget->label,
                        'inputs' => $widget->inputs,
                        'is_editable' => $widget->is_editable,
                        'thumbnail' => $widget->thumbnail,
                    ]);
                }

                foreach ($theme->partials as $widget) {
                    Widget::create([
                        "ref_type" => Store::class,
                        "ref_id" => $store->id,
                        'type_id' => $widget->type_id,
                        'name' => $widget->name,
                        'label' => $widget->label,
                        'inputs' => $widget->inputs,
                        'is_editable' => $widget->is_editable,
                        'thumbnail' => $widget->thumbnail,
                    ]);
                }

                foreach ($theme->pages as $page) {
                    $theme_layout = Widget::where(["id" => $page->layout_id])->first();
                    $page_layout = Widget::where(["ref_type" => Store::class, "ref_id" => $store->id, "type_id" => 1, "name" => $theme_layout->name])->first();

                    $created_page = StorePage::create([
                        'store_id' => $store->id,
                        'name' => $page->name,
                        'slug' => $page->slug,
                        'type' => $page->type,
                        'title' => $page->title,
                        'layout_id' => $page_layout->id,
                        'is_active' => true,
                    ]);

                    $page = ThemePage::where(["id" => $page->id])->with("widgets")->with("layout")->first();

                    foreach ($page->widgets as $widget) {
                        $created_widget = Widget::create([
                            "ref_type" => StorePage::class,
                            "ref_id" => $created_page->id,
                            'type_id' => $widget->type_id,
                            'name' => $widget->name,
                            'label' => $widget->label,
                            'inputs' => $widget->inputs,
                            'is_editable' => $widget->is_editable,
                            'thumbnail' => $widget->thumbnail,
                        ]);

                        $inputs = WidgetInput::where(["widget_id" => $widget->id, "parent_id" => null])->with("child")->get();

                        foreach ($inputs as $input) {
                            $created_input = WidgetInput::create([
                                'name' => $input->name,
                                'widget_id' => $created_widget->id,
                                'label' => $input->label,
                                'placeholder' => $input->placeholder,
                                'value' => $input->value,
                                'options' => $input->options,
                                'required' => $input->required,
                                'type_id' => $input->type_id,
                                'parent_id' => $input->parent_id,
                            ]);

                            if($input->child){
                                foreach ($input->child as $childInput) {
                                    $created_child_input = WidgetInput::create([
                                        'name' => $childInput->name,
                                        'widget_id' => $created_widget->id,
                                        'label' => $childInput->label,
                                        'placeholder' => $childInput->placeholder,
                                        'value' => $childInput->value,
                                        'options' => $childInput->options,
                                        'required' => $childInput->required,
                                        'type_id' => $childInput->type_id,
                                        'parent_id' => $created_input->id,
                                    ]);
                                }
                            }
                        }
                    }
                }
            }
            $store->update(["theme_id" => $request->theme_id]);

            return response()->json([
                'status' => 200,
                'message' => "Store theme has been activated",
            ], 200);

        } else {
            $store->update(["theme_id" => null]);

            return response()->json([
                'status' => 200,
                'message' => 'Store theme has been deactived.',
            ], 200);
        }
    }

    public function destroy($id)
    {
        $store = Store::storeOwner()->active()->find($id);

        if (!$store) {
            return response()->json([
                'status' => 404,
                'message' => 'Store not found',
            ], 404);
        }

        $store->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Store deleted successfully.',
        ], 200);
    }

    public function switchStore(Request $request)
    {
        $request->validate([
            'store_id' => 'required|int|exists:stores,id',
        ]);

        $store = Store::storeOwner()->active()->find($request->store_id);

        if (!$store) {
            return response()->json([
                'status' => 404,
                'message' => 'Store not found',
            ], 404);
        }

        StoreSession::updateOrCreate([
            'user_id' => auth()->user()->id,
        ], [
            'store_id' => $store->id,
        ]);

        if ($request->hasSession()) {
            $request->session()->forget('store_id');
        }
        if (session()->isStarted() && session()->has('store_id')) {
            session()->forget('store_id');
        }

        if (session()->isStarted()) {
            session(['store_id' => $store->id]);
        }
        $request->attributes->set('store_id', $store->id);

        return response()->json([
            'status' => 200,
            'message' => 'Store switched successfully.',
            'data' => [
                'store' => new StoreResource($store),
            ]
        ], 200);
    }

    public function currentStore(Request $request)
    {
        $user = auth()->user();
        $store = Store::where('id', $user->storeSession->store_id)->first();

        if (!$store) {
            return response()->json([
                'status' => 404,
                'message' => 'store not found'
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => [
                'store' => new StoreResource($store)
            ]
        ], 200);
    }

    public function updateByPost(Request $request, $id)
    {
        return $this->update($request, $id);
    }

    public function updateStoreSession(Request $request, $store): void
    {
        // // update store_id in store_session table
        $storeSession = StoreSession::updateOrCreate([
            'user_id' => auth()->user()->id,
        ], [
            'store_id' => $store->id,
        ]);

        // Check if a store_id exists in the session and remove it
        if (session()->isStarted() && session()->has('store_id')) {
            session()->forget('store_id');
        }

        // Store the new `store_id` in the session - check if session is available
        if (session()->isStarted()) {
            session(['store_id' => $store->id]);
        }

        // Also set it in the request attributes
        $request->attributes->set('store_id', $store->id);
    }
}