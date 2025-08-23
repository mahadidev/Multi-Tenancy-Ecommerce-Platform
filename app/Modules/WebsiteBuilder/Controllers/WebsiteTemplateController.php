<?php

namespace App\Modules\WebsiteBuilder\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\WebsiteBuilder\Models\WebsiteTemplate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WebsiteTemplateController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = WebsiteTemplate::query()
            ->active()
            ->with(['pages.sections.components.componentType']);

        // Filter by category
        if ($request->has('category') && $request->category !== 'all') {
            $query->byCategory($request->category);
        }

        // Filter by type (free/premium)
        if ($request->has('type')) {
            if ($request->type === 'free') {
                $query->free();
            } elseif ($request->type === 'premium') {
                $query->premium();
            }
        }

        $templates = $query->orderBy('sort_order')->get();

        return response()->json([
            'status' => 200,
            'message' => 'Templates retrieved successfully',
            'data' => $templates
        ]);
    }

    public function show($id): JsonResponse
    {
        $template = WebsiteTemplate::with([
            'pages.sections.components.componentType.category'
        ])->findOrFail($id);

        return response()->json([
            'status' => 200,
            'message' => 'Template retrieved successfully',
            'data' => $template
        ]);
    }

    public function preview($id): JsonResponse
    {
        $template = WebsiteTemplate::with([
            'pages.sections.components.componentType'
        ])->findOrFail($id);

        // Generate preview data - this would render the template
        $previewData = [
            'template' => $template,
            'rendered_pages' => $this->renderTemplatePages($template),
        ];

        return response()->json([
            'status' => 200,
            'message' => 'Template preview generated successfully',
            'data' => $previewData
        ]);
    }

    private function renderTemplatePages(WebsiteTemplate $template): array
    {
        $renderedPages = [];

        foreach ($template->pages as $page) {
            $renderedSections = [];

            foreach ($page->sections as $section) {
                $renderedComponents = [];

                foreach ($section->components as $component) {
                    $renderedComponents[] = [
                        'id' => $component->id,
                        'type' => $component->componentType->slug,
                        'name' => $component->name,
                        'props' => $component->props,
                        'styles' => $component->styles,
                        'template' => $component->componentType->template,
                    ];
                }

                $renderedSections[] = [
                    'id' => $section->id,
                    'name' => $section->name,
                    'type' => $section->type,
                    'styles' => $section->container_styles,
                    'components' => $renderedComponents,
                ];
            }

            $renderedPages[] = [
                'id' => $page->id,
                'title' => $page->title,
                'slug' => $page->slug,
                'type' => $page->type,
                'is_homepage' => $page->is_homepage,
                'sections' => $renderedSections,
            ];
        }

        return $renderedPages;
    }
}