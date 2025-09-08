<?php

namespace App\Modules\WebsiteBuilder\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\WebsiteBuilder\Models\StoreWebsite;
use App\Modules\WebsiteBuilder\Models\WebsitePage;
use App\Modules\WebsiteBuilder\Models\WebsiteForm;
use App\Modules\WebsiteBuilder\Models\FormSubmission;
use App\Modules\WebsiteBuilder\Models\WebsitePageView;
use App\Modules\WebsiteBuilder\Services\DataIntegrationService;
use App\Modules\WebsiteBuilder\Services\WebsiteRenderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class WebsiteRenderController extends Controller
{
    protected $dataIntegrationService;
    protected $renderService;

    public function __construct(
        DataIntegrationService $dataIntegrationService,
        WebsiteRenderService $renderService
    ) {
        $this->dataIntegrationService = $dataIntegrationService;
        $this->renderService = $renderService;
    }

    /**
     * Add cache control headers to response when caching is disabled
     */
    private function addCacheHeaders(JsonResponse $response): JsonResponse
    {
        $disableCache = request()->header('X-Disable-Cache') === '1' 
            || request()->has('_t') 
            || request()->has('_r')
            || env('DISABLE_CACHE', false);

        if ($disableCache) {
            $response->headers->add([
                'Cache-Control' => 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
                'Pragma' => 'no-cache',
                'Expires' => '0',
                'X-Cache-Status' => 'DISABLED',
                'X-Timestamp' => time(),
            ]);
        }

        return $response;
    }

    public function renderHomepage(string $subdomain): JsonResponse
    {
        try {
            $website = $this->getWebsiteBySubdomain($subdomain);
            
            if (!$website) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Website not found'
                ], 404);
            }

            if (!$website->is_published) {
                return response()->json([
                    'status' => 503,
                    'message' => 'Website is not published',
                    'maintenance_message' => $website->maintenance_message
                ], 503);
            }

            if ($website->is_maintenance_mode) {
                return response()->json([
                    'status' => 503,
                    'message' => 'Website is under maintenance',
                    'maintenance_message' => $website->maintenance_message
                ], 503);
            }

            $homepage = $website->homepage();
            
            if (!$homepage) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Homepage not found'
                ], 404);
            }

            $renderedPage = $this->renderService->renderPage($homepage);
            
            // Track page view
            $this->trackPageView($website, $homepage, request());

            $response = response()->json([
                'status' => 200,
                'data' => [
                    'website' => $this->getWebsiteData($website),
                    'page' => $renderedPage,
                ]
            ]);

            return $this->addCacheHeaders($response);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error rendering website: ' . $e->getMessage()
            ], 500);
        }
    }

    public function renderPage(string $subdomain, string $slug): JsonResponse
    {
        try {
            $website = $this->getWebsiteBySubdomain($subdomain);
            
            if (!$website || !$website->is_published) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Page not found'
                ], 404);
            }

            $page = $website->pages()
                ->where('slug', $slug)
                ->where('is_published', true)
                ->first();

            if (!$page) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Page not found'
                ], 404);
            }

            $renderedPage = $this->renderService->renderPage($page);
            
            // Track page view
            $this->trackPageView($website, $page, request());

            $response = response()->json([
                'status' => 200,
                'data' => [
                    'website' => $this->getWebsiteData($website),
                    'page' => $renderedPage,
                ]
            ]);

            return $this->addCacheHeaders($response);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error rendering page: ' . $e->getMessage()
            ], 500);
        }
    }

    public function submitForm(string $subdomain, int $formId, Request $request): JsonResponse
    {
        try {
            $website = $this->getWebsiteBySubdomain($subdomain);
            
            if (!$website || !$website->is_published) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Website not found'
                ], 404);
            }

            $form = $website->forms()->where('id', $formId)->where('is_active', true)->first();
            
            if (!$form) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Form not found'
                ], 404);
            }

            // Validate form data based on form fields
            $validatedData = $this->validateFormSubmission($form, $request);

            // Save form submission
            $submission = FormSubmission::create([
                'form_id' => $form->id,
                'data' => $validatedData,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            // Send notification email if configured
            $this->sendFormNotification($form, $submission);

            return response()->json([
                'status' => 200,
                'message' => 'Form submitted successfully',
                'data' => [
                    'submission_id' => $submission->id,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error submitting form: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getProducts(string $subdomain, Request $request): JsonResponse
    {
        try {
            $website = $this->getWebsiteBySubdomain($subdomain);
            
            if (!$website || !$website->is_published) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Website not found'
                ], 404);
            }

            $filters = [
                'filter' => $request->get('filter', 'all'),
                'category_id' => $request->get('category_id'),
                'brand_id' => $request->get('brand_id'),
                'limit' => $request->get('limit', 20),
            ];

            $products = $this->dataIntegrationService->getProducts($website->store, $filters);

            $response = response()->json([
                'status' => 200,
                'data' => $products
            ]);

            return $this->addCacheHeaders($response);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error fetching products: ' . $e->getMessage()
            ], 500);
        }
    }

    public function searchProducts(string $subdomain, Request $request): JsonResponse
    {
        try {
            $website = $this->getWebsiteBySubdomain($subdomain);
            
            if (!$website || !$website->is_published) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Website not found'
                ], 404);
            }

            $query = $request->get('q', '');
            if (empty($query)) {
                return response()->json([
                    'status' => 400,
                    'message' => 'Search query is required'
                ], 400);
            }

            $filters = [
                'category_id' => $request->get('category_id'),
                'brand_id' => $request->get('brand_id'),
                'min_price' => $request->get('min_price'),
                'max_price' => $request->get('max_price'),
                'limit' => $request->get('limit', 20),
            ];

            $products = $this->dataIntegrationService->searchProducts($website->store, $query, $filters);

            $response = response()->json([
                'status' => 200,
                'data' => $products
            ]);

            return $this->addCacheHeaders($response);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error searching products: ' . $e->getMessage()
            ], 500);
        }
    }

    private function getWebsiteBySubdomain(string $subdomain): ?StoreWebsite
    {
        // Check if cache should be disabled
        $disableCache = request()->header('X-Disable-Cache') === '1' 
            || request()->has('_t') 
            || request()->has('_r')
            || env('DISABLE_CACHE', false);

        if ($disableCache) {
            // Skip cache when disabled
            return StoreWebsite::with(['store', 'pages.sections.components.componentType', 'menus', 'forms'])
                ->where('subdomain', $subdomain)
                ->first();
        }

        $cacheKey = "website_subdomain_{$subdomain}";
        
        return Cache::remember($cacheKey, 300, function () use ($subdomain) {
            return StoreWebsite::with(['store', 'pages.sections.components.componentType', 'menus', 'forms'])
                ->where('subdomain', $subdomain)
                ->first();
        });
    }

    private function getWebsiteData(StoreWebsite $website): array
    {
        return [
            'id' => $website->id,
            'title' => $website->title,
            'description' => $website->description,
            'subdomain' => $website->subdomain,
            'domain' => $website->domain,
            'full_domain' => $website->full_domain,
            'favicon' => $website->favicon,
            'seo_meta' => $website->seo_meta,
            'global_styles' => $website->global_styles,
            'header_data' => $website->header_data,
            'footer_data' => $website->footer_data,
            'store' => $this->dataIntegrationService->getStoreInfo($website->store),
            'menus' => $website->menus->map(function ($menu) {
                return [
                    'id' => $menu->id,
                    'name' => $menu->name,
                    'location' => $menu->location,
                    'items' => $menu->items_tree,
                    'styles' => $menu->styles,
                ];
            })->toArray(),
        ];
    }

    private function trackPageView(StoreWebsite $website, WebsitePage $page, Request $request): void
    {
        WebsitePageView::create([
            'website_id' => $website->id,
            'page_id' => $page->id,
            'path' => $request->getPathInfo(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'referrer' => $request->headers->get('referer'),
            'viewed_at' => now(),
        ]);
    }

    private function validateFormSubmission(WebsiteForm $form, Request $request): array
    {
        $rules = [];
        $fields = $form->fields ?? [];

        foreach ($fields as $field) {
            $fieldName = $field['name'] ?? '';
            $fieldRules = [];

            if ($field['required'] ?? false) {
                $fieldRules[] = 'required';
            }

            switch ($field['type'] ?? 'text') {
                case 'email':
                    $fieldRules[] = 'email';
                    break;
                case 'number':
                    $fieldRules[] = 'numeric';
                    break;
                case 'tel':
                    $fieldRules[] = 'string|min:10|max:15';
                    break;
                default:
                    $fieldRules[] = 'string|max:1000';
                    break;
            }

            if ($fieldName) {
                $rules[$fieldName] = implode('|', $fieldRules);
            }
        }

        return $request->validate($rules);
    }

    private function sendFormNotification(WebsiteForm $form, FormSubmission $submission): void
    {
        // This would integrate with your email service
        // For now, we'll just log it
        \Log::info('Form submission received', [
            'form_id' => $form->id,
            'form_name' => $form->name,
            'submission_id' => $submission->id,
            'data' => $submission->data,
        ]);
    }
}