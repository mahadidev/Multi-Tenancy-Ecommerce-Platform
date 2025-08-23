<?php

namespace App\Modules\WebsiteBuilder\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\WebsiteBuilder\Models\StoreWebsite;
use App\Modules\StoreManagement\Models\StoreSocialMedia;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class WebsiteSettingsController extends Controller
{
    /**
     * Get comprehensive website settings
     */
    public function index(): JsonResponse
    {
        try {
            $storeId = authStore();
            
            $website = StoreWebsite::byStore($storeId)
                ->with(['store.socialMedia', 'menus'])
                ->first();

            if (!$website) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Website not found'
                ], 404);
            }

            $settings = [
                'website' => $website,
                'social_media' => $website->store->socialMedia,
                'menus' => $website->menus,
                'seo_settings' => $website->seo_meta,
                'analytics_settings' => $website->analytics_settings,
                'global_styles' => $website->global_styles,
            ];

            return response()->json([
                'status' => 200,
                'message' => 'Website settings retrieved successfully',
                'data' => $settings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to retrieve website settings: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update website basic settings
     */
    public function updateBasicSettings(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'description' => 'sometimes|nullable|string|max:1000',
                'favicon' => 'sometimes|nullable|file|mimes:ico,png|max:1024',
            ]);

            $storeId = authStore();
            $website = StoreWebsite::byStore($storeId)->firstOrFail();

            $updateData = $request->only(['title', 'description']);

            // Handle favicon upload
            if ($request->hasFile('favicon')) {
                // Delete old favicon
                if ($website->favicon) {
                    Storage::delete($website->favicon);
                }
                
                $faviconPath = $request->file('favicon')->store('website/favicons', 'public');
                $updateData['favicon'] = $faviconPath;
            }

            $website->update($updateData);

            return response()->json([
                'status' => 200,
                'message' => 'Basic settings updated successfully',
                'data' => $website
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to update basic settings: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update SEO settings
     */
    public function updateSeoSettings(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'seo_title' => 'sometimes|nullable|string|max:255',
                'seo_description' => 'sometimes|nullable|string|max:500',
                'seo_keywords' => 'sometimes|nullable|string|max:255',
                'og_title' => 'sometimes|nullable|string|max:255',
                'og_description' => 'sometimes|nullable|string|max:500',
                'og_image' => 'sometimes|nullable|file|mimes:jpg,jpeg,png|max:2048',
            ]);

            $storeId = authStore();
            $website = StoreWebsite::byStore($storeId)->firstOrFail();

            $seoMeta = $website->seo_meta ?? [];

            // Update SEO meta data
            if ($request->has('seo_title')) {
                $seoMeta['title'] = $request->seo_title;
            }
            if ($request->has('seo_description')) {
                $seoMeta['description'] = $request->seo_description;
            }
            if ($request->has('seo_keywords')) {
                $seoMeta['keywords'] = $request->seo_keywords;
            }
            if ($request->has('og_title')) {
                $seoMeta['og_title'] = $request->og_title;
            }
            if ($request->has('og_description')) {
                $seoMeta['og_description'] = $request->og_description;
            }

            // Handle OG image upload
            if ($request->hasFile('og_image')) {
                // Delete old OG image
                if (isset($seoMeta['og_image'])) {
                    Storage::delete($seoMeta['og_image']);
                }
                
                $ogImagePath = $request->file('og_image')->store('website/og-images', 'public');
                $seoMeta['og_image'] = $ogImagePath;
            }

            $website->update(['seo_meta' => $seoMeta]);

            return response()->json([
                'status' => 200,
                'message' => 'SEO settings updated successfully',
                'data' => $website
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to update SEO settings: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update analytics settings
     */
    public function updateAnalyticsSettings(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'google_analytics_id' => 'sometimes|nullable|string|max:50',
                'google_tag_manager_id' => 'sometimes|nullable|string|max:50',
                'facebook_pixel_id' => 'sometimes|nullable|string|max:50',
                'custom_head_code' => 'sometimes|nullable|string|max:5000',
                'custom_body_code' => 'sometimes|nullable|string|max:5000',
            ]);

            $storeId = authStore();
            $website = StoreWebsite::byStore($storeId)->firstOrFail();

            $analyticsSettings = $website->analytics_settings ?? [];

            $analyticsSettings = array_merge($analyticsSettings, $request->only([
                'google_analytics_id',
                'google_tag_manager_id', 
                'facebook_pixel_id',
                'custom_head_code',
                'custom_body_code'
            ]));

            $website->update(['analytics_settings' => $analyticsSettings]);

            return response()->json([
                'status' => 200,
                'message' => 'Analytics settings updated successfully',
                'data' => $website
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to update analytics settings: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update global styles
     */
    public function updateGlobalStyles(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'primary_color' => 'sometimes|nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
                'secondary_color' => 'sometimes|nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
                'accent_color' => 'sometimes|nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
                'background_color' => 'sometimes|nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
                'text_color' => 'sometimes|nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
                'font_family' => 'sometimes|nullable|string|max:100',
                'custom_css' => 'sometimes|nullable|string|max:10000',
            ]);

            $storeId = authStore();
            $website = StoreWebsite::byStore($storeId)->firstOrFail();

            $globalStyles = $website->global_styles ?? [];

            $globalStyles = array_merge($globalStyles, $request->only([
                'primary_color',
                'secondary_color',
                'accent_color',
                'background_color',
                'text_color',
                'font_family',
                'custom_css'
            ]));

            $website->update(['global_styles' => $globalStyles]);

            return response()->json([
                'status' => 200,
                'message' => 'Global styles updated successfully',
                'data' => $website
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to update global styles: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update social media settings
     */
    public function updateSocialMedia(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'social_media' => 'required|array',
                'social_media.*.platform' => 'required|string|in:facebook,twitter,instagram,linkedin,youtube,tiktok,pinterest',
                'social_media.*.url' => 'required|url',
                'social_media.*.is_active' => 'boolean',
            ]);

            $storeId = authStore();

            // Delete existing social media records
            StoreSocialMedia::where('store_id', $storeId)->delete();

            // Create new social media records
            foreach ($request->social_media as $socialMedia) {
                StoreSocialMedia::create([
                    'store_id' => $storeId,
                    'platform' => $socialMedia['platform'],
                    'url' => $socialMedia['url'],
                    'is_active' => $socialMedia['is_active'] ?? true,
                ]);
            }

            $socialMediaRecords = StoreSocialMedia::where('store_id', $storeId)->get();

            return response()->json([
                'status' => 200,
                'message' => 'Social media settings updated successfully',
                'data' => $socialMediaRecords
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to update social media settings: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Toggle maintenance mode
     */
    public function toggleMaintenanceMode(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'is_maintenance_mode' => 'required|boolean',
                'maintenance_message' => 'sometimes|nullable|string|max:500',
            ]);

            $storeId = authStore();
            $website = StoreWebsite::byStore($storeId)->firstOrFail();

            $website->update([
                'is_maintenance_mode' => $request->is_maintenance_mode,
                'maintenance_message' => $request->maintenance_message,
            ]);

            return response()->json([
                'status' => 200,
                'message' => 'Maintenance mode updated successfully',
                'data' => $website
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to update maintenance mode: ' . $e->getMessage()
            ], 500);
        }
    }
}