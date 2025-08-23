<?php

namespace App\Modules\WebsiteBuilder\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\WebsiteBuilder\Models\ComponentCategory;
use App\Modules\WebsiteBuilder\Models\ComponentType;
use App\Modules\WebsiteBuilder\Models\PageComponent;
use App\Modules\WebsiteBuilder\Models\PageSection;
use App\Modules\WebsiteBuilder\Requests\CreateComponentRequest;
use App\Modules\WebsiteBuilder\Requests\UpdateComponentRequest;
use App\Modules\WebsiteBuilder\Services\ComponentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ComponentController extends Controller
{
    protected $componentService;

    public function __construct(ComponentService $componentService)
    {
        $this->componentService = $componentService;
    }

    public function getCategories(): JsonResponse
    {
        $categories = ComponentCategory::active()
            ->ordered()
            ->with(['componentTypes' => function($query) {
                $query->active()->ordered();
            }])
            ->get();

        return response()->json([
            'status' => 200,
            'message' => 'Component categories retrieved successfully',
            'data' => $categories
        ]);
    }

    public function getComponentTypes(): JsonResponse
    {
        $componentTypes = ComponentType::active()
            ->with('category')
            ->ordered()
            ->get();

        return response()->json([
            'status' => 200,
            'message' => 'Component types retrieved successfully',
            'data' => $componentTypes
        ]);
    }

    public function getComponentType($id): JsonResponse
    {
        $componentType = ComponentType::with('category')->findOrFail($id);

        return response()->json([
            'status' => 200,
            'message' => 'Component type retrieved successfully',
            'data' => $componentType
        ]);
    }

    public function addComponent(CreateComponentRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $component = $this->componentService->addComponent($data);

            return response()->json([
                'status' => 201,
                'message' => 'Component added successfully',
                'data' => $component
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to add component: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateComponent($id, UpdateComponentRequest $request): JsonResponse
    {
        try {
            // Verify ownership through the component's section's page's website's store
            $component = PageComponent::with('section.page.website')
                ->findOrFail($id);
            
            $storeId = authStore();
            if ($component->section->page->website->store_id !== $storeId) {
                return response()->json([
                    'status' => 403,
                    'message' => 'Unauthorized'
                ], 403);
            }

            $component = $this->componentService->updateComponent($component, $request->validated());

            return response()->json([
                'status' => 200,
                'message' => 'Component updated successfully',
                'data' => $component
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to update component: ' . $e->getMessage()
            ], 500);
        }
    }

    public function deleteComponent($id): JsonResponse
    {
        try {
            // Verify ownership through the component's section's page's website's store
            $component = PageComponent::with('section.page.website')
                ->findOrFail($id);
            
            $storeId = authStore();
            if ($component->section->page->website->store_id !== $storeId) {
                return response()->json([
                    'status' => 403,
                    'message' => 'Unauthorized'
                ], 403);
            }

            $component->delete();

            return response()->json([
                'status' => 200,
                'message' => 'Component deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to delete component: ' . $e->getMessage()
            ], 500);
        }
    }

    public function duplicateComponent($id): JsonResponse
    {
        try {
            $component = PageComponent::with('section.page.website')
                ->findOrFail($id);
            
            $storeId = authStore();
            if ($component->section->page->website->store_id !== $storeId) {
                return response()->json([
                    'status' => 403,
                    'message' => 'Unauthorized'
                ], 403);
            }

            $duplicateComponent = $this->componentService->duplicateComponent($component);

            return response()->json([
                'status' => 201,
                'message' => 'Component duplicated successfully',
                'data' => $duplicateComponent
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to duplicate component: ' . $e->getMessage()
            ], 500);
        }
    }

    public function reorderComponents(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'section_id' => 'required|exists:page_sections,id',
                'components' => 'required|array',
                'components.*.id' => 'required|exists:page_components,id',
                'components.*.sort_order' => 'required|integer|min:0',
            ]);

            $section = PageSection::with('page.website')
                ->findOrFail($request->section_id);
            
            $storeId = authStore();
            if ($section->page->website->store_id !== $storeId) {
                return response()->json([
                    'status' => 403,
                    'message' => 'Unauthorized'
                ], 403);
            }

            $this->componentService->reorderComponents($section, $request->components);

            return response()->json([
                'status' => 200,
                'message' => 'Components reordered successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to reorder components: ' . $e->getMessage()
            ], 500);
        }
    }

    public function moveComponent(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'component_id' => 'required|exists:page_components,id',
                'target_section_id' => 'required|exists:page_sections,id',
                'target_position' => 'required|integer|min:0',
            ]);

            $component = PageComponent::with('section.page.website')
                ->findOrFail($request->component_id);
            
            $targetSection = PageSection::with('page.website')
                ->findOrFail($request->target_section_id);
            
            $storeId = authStore();
            if ($component->section->page->website->store_id !== $storeId || 
                $targetSection->page->website->store_id !== $storeId) {
                return response()->json([
                    'status' => 403,
                    'message' => 'Unauthorized'
                ], 403);
            }

            $this->componentService->moveComponent($component, $targetSection, $request->target_position);

            return response()->json([
                'status' => 200,
                'message' => 'Component moved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to move component: ' . $e->getMessage()
            ], 500);
        }
    }
}