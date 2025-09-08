<?php

namespace App\Modules\WebsiteBuilder\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\WebsiteBuilder\Services\ThemeService;
use App\Modules\WebsiteBuilder\Services\ThemeLoader;
use App\Modules\WebsiteBuilder\Models\Theme;
use App\Modules\WebsiteBuilder\Models\ThemeCustomization;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ThemeController extends Controller
{
    protected ThemeService $themeService;
    protected ThemeLoader $themeLoader;

    public function __construct(ThemeService $themeService, ThemeLoader $themeLoader)
    {
        $this->themeService = $themeService;
        $this->themeLoader = $themeLoader;
    }

    /**
     * Get available themes
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['category', 'price', 'featured']);
        $themes = $this->themeService->getAvailableThemes($filters);

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
                    'features' => $theme->features,
                    'installations' => 0,
                    'is_featured' => false
                ];
            })
        ]);
    }

    /**
     * Get theme details
     */
    public function show(int $themeId): JsonResponse
    {
        $theme = Theme::with(['versions' => function ($query) {
            $query->orderBy('created_at', 'desc')->limit(5);
        }])->findOrFail($themeId);

        try {
            $manifest = $this->themeLoader->getThemeManifest($theme->slug);
        } catch (\Exception $e) {
            $manifest = null;
        }

        return response()->json([
            'success' => true,
            'data' => [
                'theme' => $theme,
                'manifest' => $manifest
            ]
        ]);
    }

    /**
     * Install theme for seller
     */
    public function install(Request $request, int $themeId): JsonResponse
    {
        $request->validate([
            'license_key' => 'nullable|string'
        ]);

        // Use store_id if seller_id doesn't exist
        $user = auth()->user();
        $sellerId = $user->seller_id ?? ($user->store_id[0] ?? $user->id);
        
        try {
            $licenseData = $request->license_key ? ['key' => $request->license_key] : null;
            $installation = $this->themeService->installTheme($sellerId, $themeId, $licenseData);

            return response()->json([
                'success' => true,
                'message' => 'Theme installed successfully',
                'data' => $installation
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Activate theme for seller
     */
    public function activate(int $themeId): JsonResponse
    {
        // Use store_id if seller_id doesn't exist
        $user = auth()->user();
        $sellerId = $user->seller_id ?? ($user->store_id[0] ?? $user->id);

        try {
            $this->themeService->activateTheme($sellerId, $themeId);

            return response()->json([
                'success' => true,
                'message' => 'Theme activated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Get seller's installed themes
     */
    public function installedThemes(): JsonResponse
    {
        try {
            // For now, return all installed themes for any website since we don't have proper auth context
            $themes = Theme::whereHas('sellerThemes')->with('sellerThemes')->get();

            return response()->json([
                'success' => true,
                'data' => $themes->map(function ($theme) {
                    $sellerTheme = $theme->sellerThemes->first();
                    return [
                        'id' => $theme->id,
                        'name' => $theme->name,
                        'slug' => $theme->slug,
                        'description' => $theme->description,
                        'thumbnail' => $theme->thumbnail,
                        'preview_url' => $theme->preview_url,
                        'category' => $theme->category,
                        'price' => $theme->price,
                        'is_free' => $theme->price == 0,
                        'features' => $theme->features,
                        'is_active' => $sellerTheme->is_active,
                        'activated_at' => $sellerTheme->activated_at,
                        'has_valid_license' => $sellerTheme->hasValidLicense(),
                        'installations_count' => $theme->installations_count
                    ];
                })
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve installed themes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get theme customizations
     */
    public function customizations(int $themeId): JsonResponse
    {
        $sellerId = auth()->user()->seller_id;
        
        $customizations = ThemeCustomization::where('seller_id', $sellerId)
            ->where('theme_id', $themeId)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $customizations
        ]);
    }

    /**
     * Get active customization
     */
    public function activeCustomization(int $themeId): JsonResponse
    {
        $sellerId = auth()->user()->seller_id;
        
        $customization = $this->themeService->getActiveCustomization($sellerId, $themeId);

        if (!$customization) {
            return response()->json([
                'success' => false,
                'message' => 'No active customization found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'customization' => $customization,
                'merged_config' => $customization->getMergedConfig(),
                'css_variables' => $customization->generateCssVariables(),
                'tailwind_config' => $customization->getTailwindConfig()
            ]
        ]);
    }

    /**
     * Create new customization
     */
    public function createCustomization(Request $request, int $themeId): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'colors' => 'nullable|array',
            'fonts' => 'nullable|array',
            'spacing' => 'nullable|array',
            'settings' => 'nullable|array',
            'custom_css' => 'nullable|string',
            'tailwind_config' => 'nullable|array'
        ]);

        $sellerId = auth()->user()->seller_id;

        $customization = ThemeCustomization::create([
            'seller_id' => $sellerId,
            'theme_id' => $themeId,
            'name' => $request->name,
            'colors' => $request->colors ?? [],
            'fonts' => $request->fonts ?? [],
            'spacing' => $request->spacing ?? [],
            'settings' => $request->settings ?? [],
            'custom_css' => $request->custom_css,
            'tailwind_config' => $request->tailwind_config ?? []
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Customization created successfully',
            'data' => $customization
        ]);
    }

    /**
     * Update customization
     */
    public function updateCustomization(Request $request, int $customizationId): JsonResponse
    {
        $request->validate([
            'name' => 'nullable|string|max:255',
            'colors' => 'nullable|array',
            'fonts' => 'nullable|array',
            'spacing' => 'nullable|array',
            'settings' => 'nullable|array',
            'custom_css' => 'nullable|string',
            'tailwind_config' => 'nullable|array'
        ]);

        $customization = $this->themeService->updateCustomization($customizationId, $request->all());

        return response()->json([
            'success' => true,
            'message' => 'Customization updated successfully',
            'data' => $customization
        ]);
    }

    /**
     * Duplicate customization
     */
    public function duplicateCustomization(Request $request, int $customizationId): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255'
        ]);

        $newCustomization = $this->themeService->duplicateCustomization($customizationId, $request->name);

        return response()->json([
            'success' => true,
            'message' => 'Customization duplicated successfully',
            'data' => $newCustomization
        ]);
    }

    /**
     * Activate customization
     */
    public function activateCustomization(int $customizationId): JsonResponse
    {
        $sellerId = auth()->user()->seller_id;
        
        $this->themeService->switchCustomization($sellerId, $customizationId);

        return response()->json([
            'success' => true,
            'message' => 'Customization activated successfully'
        ]);
    }

    /**
     * Update component styles
     */
    public function updateComponentStyles(Request $request, int $customizationId): JsonResponse
    {
        $request->validate([
            'component_path' => 'required|string',
            'tailwind_classes' => 'nullable|string',
            'custom_css' => 'nullable|string',
            'responsive_classes' => 'nullable|array'
        ]);

        $customization = ThemeCustomization::findOrFail($customizationId);

        // Ensure seller owns this customization
        if ($customization->seller_id !== auth()->user()->seller_id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $componentStyle = $customization->componentStyles()
            ->updateOrCreate(
                ['component_path' => $request->component_path],
                [
                    'tailwind_classes' => $request->tailwind_classes,
                    'custom_css' => $request->custom_css,
                    'responsive_classes' => $request->responsive_classes
                ]
            );

        return response()->json([
            'success' => true,
            'message' => 'Component styles updated successfully',
            'data' => $componentStyle
        ]);
    }

    /**
     * Preview theme with customization
     */
    public function preview(Request $request, int $themeId): JsonResponse
    {
        $sellerId = auth()->user()->seller_id;
        $customizationId = $request->input('customization_id');

        // Get theme config with customization
        $config = $this->themeService->getThemeConfig($sellerId);

        // Generate preview URL
        $previewUrl = config('app.website_renderer_url') . '/preview?' . http_build_query([
            'theme_id' => $themeId,
            'customization_id' => $customizationId,
            'seller_id' => $sellerId,
            'token' => encrypt(['seller_id' => $sellerId, 'expires' => now()->addHour()])
        ]);

        return response()->json([
            'success' => true,
            'data' => [
                'preview_url' => $previewUrl,
                'config' => $config
            ]
        ]);
    }

    /**
     * Get theme configuration for renderer
     */
    public function getThemeConfig(): JsonResponse
    {
        $sellerId = auth()->user()->seller_id;
        $config = $this->themeService->getThemeConfig($sellerId);

        return response()->json([
            'success' => true,
            'data' => $config
        ]);
    }
}