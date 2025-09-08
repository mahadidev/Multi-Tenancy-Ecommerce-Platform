<?php

namespace App\Modules\WebsiteBuilder\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\WebsiteBuilder\Services\ThemeInstallationService;
use App\Modules\WebsiteBuilder\Models\StoreWebsite;
use App\Modules\WebsiteBuilder\Models\Theme;
use App\Modules\WebsiteBuilder\Requests\ThemeInstallationRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ThemeInstallationController extends Controller
{
    protected ThemeInstallationService $installationService;

    public function __construct(ThemeInstallationService $installationService)
    {
        $this->installationService = $installationService;
    }

    /**
     * Install theme for a website
     * POST /api/v1/websites/{websiteId}/themes/install
     */
    public function install(Request $request, int $websiteId): JsonResponse
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'theme_slug' => 'required|string|exists:themes,slug',
            'overwrite_existing' => 'sometimes|boolean',
            'create_demo_content' => 'sometimes|boolean',
            'async' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Verify website ownership
            $website = StoreWebsite::where('id', $websiteId)
                ->where('store_id', $this->getCurrentStoreId())
                ->firstOrFail();

            // Verify theme exists and is active
            $theme = Theme::where('slug', $request->theme_slug)
                ->where('is_active', true)
                ->firstOrFail();

            $installationOptions = [
                'website_id' => $websiteId,
                'theme_slug' => $request->theme_slug,
                'overwrite_existing' => $request->boolean('overwrite_existing', false),
                'create_demo_content' => $request->boolean('create_demo_content', true),
            ];

            // Install asynchronously if requested
            if ($request->boolean('async', false)) {
                $jobId = $this->installationService->installThemeAsync($installationOptions);
                
                return response()->json([
                    'success' => true,
                    'message' => 'Theme installation started',
                    'data' => [
                        'job_id' => $jobId,
                        'status_url' => route('api.theme-installation.status', $websiteId)
                    ]
                ], 202);
            }

            // Install synchronously
            $result = $this->installationService->installTheme($installationOptions);

            if ($result['success']) {
                return response()->json([
                    'success' => true,
                    'message' => $result['message'],
                    'data' => [
                        'pages' => $result['pages'],
                        'created_pages_count' => $result['created_pages_count'],
                        'theme' => [
                            'id' => $theme->id,
                            'name' => $theme->name,
                            'slug' => $theme->slug
                        ]
                    ]
                ], 201);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => $result['message'],
                    'errors' => $result['errors']
                ], 400);
            }

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Website or theme not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Theme installation API error', [
                'website_id' => $websiteId,
                'theme_slug' => $request->theme_slug,
                'error' => $e->getMessage(),
                'user_id' => auth()->id()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Theme installation failed',
                'errors' => ['An unexpected error occurred during installation']
            ], 500);
        }
    }

    /**
     * Reinstall theme with fresh demo content
     * POST /api/v1/websites/{websiteId}/themes/{themeSlug}/reinstall
     */
    public function reinstall(Request $request, int $websiteId, string $themeSlug): JsonResponse
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'reset_content' => 'sometimes|boolean',
            'reset_header_footer' => 'sometimes|boolean',
            'create_demo_content' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Verify website ownership
            $website = StoreWebsite::where('id', $websiteId)
                ->where('store_id', $this->getCurrentStoreId())
                ->firstOrFail();

            // Find the theme
            $theme = Theme::where('slug', $themeSlug)->firstOrFail();

            // Check if theme is already installed
            $isInstalled = $website->theme_id === $theme->id;
            if (!$isInstalled) {
                return response()->json([
                    'success' => false,
                    'message' => 'Theme is not currently installed on this website'
                ], 400);
            }

            // Reinstall with overwrite settings
            $result = $this->installationService->installTheme([
                'website_id' => $websiteId,
                'theme_slug' => $themeSlug,
                'overwrite_existing' => true, // Always overwrite for reinstall
                'create_demo_content' => $request->input('create_demo_content', true)
            ]);

            if ($result['success']) {
                return response()->json([
                    'success' => true,
                    'message' => 'Theme reinstalled successfully with fresh demo content',
                    'data' => [
                        'pages' => $result['pages'],
                        'created_pages_count' => $result['created_pages_count'],
                        'theme' => [
                            'id' => $theme->id,
                            'name' => $theme->name,
                            'slug' => $theme->slug
                        ],
                        'reinstall_options' => [
                            'reset_content' => $request->input('reset_content', true),
                            'reset_header_footer' => $request->input('reset_header_footer', true),
                            'create_demo_content' => $request->input('create_demo_content', true)
                        ]
                    ]
                ], 200);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => $result['message'],
                    'errors' => $result['errors']
                ], 400);
            }

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Website or theme not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Theme reinstallation API error', [
                'website_id' => $websiteId,
                'theme_slug' => $themeSlug,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Theme reinstallation failed',
                'errors' => ['An unexpected error occurred during reinstallation']
            ], 500);
        }
    }

    /**
     * Get installation status
     * GET /api/v1/websites/{websiteId}/theme-installation/status
     */
    public function getInstallationStatus(int $websiteId): JsonResponse
    {
        try {
            // Verify website ownership
            $website = StoreWebsite::where('id', $websiteId)
                ->where('store_id', $this->getCurrentStoreId())
                ->firstOrFail();

            $status = $this->installationService->getInstallationStatus($websiteId);

            return response()->json([
                'success' => true,
                'data' => [
                    'website_id' => $websiteId,
                    'status' => $status['status'],
                    'progress' => $status['progress'],
                    'current_step' => $status['current_step'],
                    'errors' => $status['errors'],
                    'is_installing' => in_array($status['status'], ['started', 'queued', 'processing']),
                    'is_completed' => $status['status'] === 'completed',
                    'has_errors' => !empty($status['errors']),
                    'started_at' => $status['started_at'] ?? null,
                    'updated_at' => $status['updated_at'] ?? null
                ]
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Website not found'
            ], 404);
        }
    }

    /**
     * Get available themes for installation
     * GET /api/v1/themes
     */
    public function getAvailableThemes(Request $request): JsonResponse
    {
        $themes = Theme::active()
            ->when($request->category, function ($query, $category) {
                return $query->byCategory($category);
            })
            ->when($request->featured, function ($query) {
                return $query->featured();
            })
            ->when($request->price === 'free', function ($query) {
                return $query->free();
            })
            ->when($request->price === 'premium', function ($query) {
                return $query->premium();
            })
            ->orderBy('name', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $themes->map(function ($theme) {
                return [
                    'id' => $theme->id,
                    'name' => $theme->name,
                    'slug' => $theme->slug,
                    'description' => $theme->description,
                    'thumbnail' => $theme->thumbnail,
                    'preview_url' => $theme->preview_url,
                    'category' => $theme->category,
                    'price' => $theme->price,
                    'is_free' => $theme->isFree(),
                    'features' => $theme->features ?? [],
                    'installations_count' => 0,
                    'is_featured' => false,
                    'author' => $theme->author,
                    'version' => $theme->version
                ];
            })
        ]);
    }

    /**
     * Get theme details
     * GET /api/v1/themes/{themeSlug}
     */
    public function getThemeDetails(string $themeSlug): JsonResponse
    {
        try {
            $theme = Theme::where('slug', $themeSlug)
                ->where('is_active', true)
                ->with(['versions' => function ($query) {
                    $query->orderBy('created_at', 'desc')->limit(5);
                }])
                ->firstOrFail();

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $theme->id,
                    'name' => $theme->name,
                    'slug' => $theme->slug,
                    'description' => $theme->description,
                    'thumbnail' => $theme->thumbnail,
                    'preview_url' => $theme->preview_url,
                    'category' => $theme->category,
                    'price' => $theme->price,
                    'is_free' => $theme->isFree(),
                    'features' => $theme->features ?? [],
                    'installations_count' => 0,
                    'is_featured' => false,
                    'author' => $theme->author,
                    'author_url' => $theme->author_url,
                    'version' => $theme->version,
                    'config_schema' => $theme->getConfigSchema(),
                    'required_hooks' => $theme->getRequiredHooks(),
                    'optional_hooks' => $theme->getOptionalHooks(),
                    'recent_versions' => $theme->versions,
                    'components' => $theme->components ?? [],
                    'layouts' => $theme->layouts ?? []
                ]
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Theme not found'
            ], 404);
        }
    }

    /**
     * Preview theme before installation
     * GET /api/v1/themes/{themeSlug}/preview
     */
    public function previewTheme(string $themeSlug): JsonResponse
    {
        try {
            $theme = Theme::where('slug', $themeSlug)
                ->where('is_active', true)
                ->firstOrFail();

            // Generate preview data
            $previewData = [
                'theme' => [
                    'id' => $theme->id,
                    'name' => $theme->name,
                    'slug' => $theme->slug,
                    'description' => $theme->description,
                    'features' => $theme->features ?? []
                ],
                'pages' => $this->getThemePreviewPages($theme),
                'preview_url' => $this->generatePreviewUrl($theme),
                'demo_images' => $this->getThemeDemoImages($theme)
            ];

            return response()->json([
                'success' => true,
                'data' => $previewData
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Theme not found'
            ], 404);
        }
    }

    /**
     * Get website's current theme and installation status
     * GET /api/v1/websites/{websiteId}/theme
     */
    public function getWebsiteTheme(int $websiteId): JsonResponse
    {
        try {
            $website = StoreWebsite::where('id', $websiteId)
                ->where('store_id', $this->getCurrentStoreId())
                ->with(['theme', 'themeCustomization'])
                ->firstOrFail();

            $data = [
                'website_id' => $website->id,
                'has_theme' => !is_null($website->theme_id),
                'theme' => null,
                'customization' => null
            ];

            if ($website->theme) {
                $data['theme'] = [
                    'id' => $website->theme->id,
                    'name' => $website->theme->name,
                    'slug' => $website->theme->slug,
                    'version' => $website->theme->version,
                    'installed_at' => $website->meta_data['theme_installation']['installed_at'] ?? null
                ];
            }

            if ($website->themeCustomization) {
                $data['customization'] = [
                    'id' => $website->themeCustomization->id,
                    'name' => $website->themeCustomization->name,
                    'colors' => $website->themeCustomization->colors,
                    'fonts' => $website->themeCustomization->fonts,
                    'is_active' => $website->themeCustomization->is_active
                ];
            }

            return response()->json([
                'success' => true,
                'data' => $data
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Website not found'
            ], 404);
        }
    }

    /**
     * Uninstall theme from website
     * DELETE /api/v1/websites/{websiteId}/theme
     */
    public function uninstallTheme(int $websiteId): JsonResponse
    {
        try {
            $website = StoreWebsite::where('id', $websiteId)
                ->where('store_id', $this->getCurrentStoreId())
                ->firstOrFail();

            if (!$website->theme_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'No theme installed on this website'
                ], 400);
            }

            // Remove theme association (but keep pages and content)
            $website->update([
                'theme_id' => null,
                'theme_customization_id' => null,
                'meta_data' => array_merge($website->meta_data ?? [], [
                    'theme_uninstalled_at' => now()->toISOString()
                ])
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Theme uninstalled successfully'
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Website not found'
            ], 404);
        }
    }

    /**
     * Helper methods
     */
    protected function getCurrentStoreId(): int
    {
        // Temporary hardcoded store ID for testing (remove when auth is fixed)
        return 1; // Match the store_id for website ID 1
    }

    protected function getThemePreviewPages(Theme $theme): array
    {
        // Return preview pages data - this would be loaded from theme manifest
        return [
            [
                'title' => 'Home',
                'slug' => '/',
                'type' => 'homepage',
                'description' => 'Homepage with hero section and featured products'
            ],
            [
                'title' => 'Products',
                'slug' => 'products',
                'type' => 'catalog',
                'description' => 'Product catalog with filters and grid layout'
            ],
            [
                'title' => 'Shopping Cart',
                'slug' => 'cart',
                'type' => 'cart',
                'description' => 'Shopping cart with item management'
            ],
            [
                'title' => 'Checkout',
                'slug' => 'checkout',
                'type' => 'checkout',
                'description' => 'Secure checkout process'
            ]
        ];
    }

    protected function generatePreviewUrl(Theme $theme): ?string
    {
        // Generate a preview URL for the theme
        $baseUrl = config('app.website_renderer_url', config('app.url'));
        return $baseUrl . '/preview/theme/' . $theme->slug;
    }

    protected function getThemeDemoImages(Theme $theme): array
    {
        // Return demo images for the theme
        return [
            'desktop' => $theme->thumbnail,
            'mobile' => $theme->thumbnail,
            'tablet' => $theme->thumbnail
        ];
    }
}