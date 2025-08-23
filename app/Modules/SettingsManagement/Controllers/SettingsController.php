<?php

namespace App\Modules\SettingsManagement\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\StoreManagement\Models\Store;
use App\Modules\UserManagement\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class SettingsController extends Controller
{
    /**
     * Get general settings for the store
     */
    public function getGeneralSettings(): JsonResponse
    {
        try {
            $storeId = authStore();
            $store = Store::find($storeId);
            
            if (!$store) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Store not found'
                ], 404);
            }

            $settings = [
                'store_name' => $store->name,
                'store_email' => $store->email,
                'store_phone' => $store->phone,
                'store_address' => $store->location,
                'store_description' => $store->description,
                'currency' => $store->currency ?? 'USD',
                'primary_color' => $store->primary_color,
                'secondary_color' => $store->secondary_color,
                'logo' => $store->logo,
                'dark_logo' => $store->dark_logo,
                'favicon' => $store->settings['favicon'] ?? null,
                'timezone' => $store->settings['timezone'] ?? 'UTC',
                'language' => $store->settings['language'] ?? 'en',
                'date_format' => $store->settings['date_format'] ?? 'Y-m-d',
                'time_format' => $store->settings['time_format'] ?? 'H:i:s',
            ];

            return response()->json([
                'status' => 200,
                'data' => $settings,
                'message' => 'General settings retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to retrieve general settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update general settings for the store
     */
    public function updateGeneralSettings(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'store_name' => 'required|string|max:255',
                'store_email' => 'required|email|max:255',
                'store_phone' => 'nullable|string|max:20',
                'store_address' => 'nullable|string',
                'store_description' => 'nullable|string',
                'currency' => 'required|string|max:3',
                'primary_color' => 'nullable|string|max:7',
                'secondary_color' => 'nullable|string|max:7',
                'timezone' => 'nullable|string|max:50',
                'language' => 'nullable|string|max:5',
                'date_format' => 'nullable|string|max:10',
                'time_format' => 'nullable|string|max:10',
            ]);

            $storeId = authStore();
            $store = Store::find($storeId);
            
            if (!$store) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Store not found'
                ], 404);
            }

            // Update store fields
            $store->update([
                'name' => $request->store_name,
                'email' => $request->store_email,
                'phone' => $request->store_phone,
                'location' => $request->store_address,
                'description' => $request->store_description,
                'currency' => $request->currency,
                'primary_color' => $request->primary_color,
                'secondary_color' => $request->secondary_color,
            ]);

            // Update settings JSON field
            $settings = $store->settings ?? [];
            $settings['timezone'] = $request->timezone;
            $settings['language'] = $request->language;
            $settings['date_format'] = $request->date_format;
            $settings['time_format'] = $request->time_format;
            
            $store->update(['settings' => $settings]);

            return response()->json([
                'status' => 200,
                'message' => 'General settings updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to update general settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get profile settings for the current user
     */
    public function getProfileSettings(): JsonResponse
    {
        try {
            $user = Auth::user();

            $settings = [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'avatar' => $user->avatar,
                'bio' => $user->bio,
                'location' => $user->location,
                'website' => $user->website,
                'date_of_birth' => $user->date_of_birth,
                'gender' => $user->gender,
            ];

            return response()->json([
                'status' => 200,
                'data' => $settings,
                'message' => 'Profile settings retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to retrieve profile settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update profile settings for the current user
     */
    public function updateProfileSettings(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255|unique:users,email,' . Auth::id(),
                'phone' => 'nullable|string|max:20',
                'bio' => 'nullable|string|max:500',
                'location' => 'nullable|string|max:255',
                'website' => 'nullable|url|max:255',
                'date_of_birth' => 'nullable|date',
                'gender' => 'nullable|in:male,female,other',
            ]);

            $user = Auth::user();
            $user->update($request->only([
                'name', 'email', 'phone', 'bio', 'location', 
                'website', 'date_of_birth', 'gender'
            ]));

            return response()->json([
                'status' => 200,
                'message' => 'Profile settings updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to update profile settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get social media settings for the store
     */
    public function getSocialMediaSettings(): JsonResponse
    {
        try {
            $storeId = authStore();
            $store = Store::find($storeId);
            
            if (!$store) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Store not found'
                ], 404);
            }

            $settings = $store->settings ?? [];
            $socialMedia = [
                'facebook' => $settings['social_media']['facebook'] ?? '',
                'twitter' => $settings['social_media']['twitter'] ?? '',
                'instagram' => $settings['social_media']['instagram'] ?? '',
                'linkedin' => $settings['social_media']['linkedin'] ?? '',
                'youtube' => $settings['social_media']['youtube'] ?? '',
                'tiktok' => $settings['social_media']['tiktok'] ?? '',
            ];

            return response()->json([
                'status' => 200,
                'data' => $socialMedia,
                'message' => 'Social media settings retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to retrieve social media settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update social media settings for the store
     */
    public function updateSocialMediaSettings(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'facebook' => 'nullable|url',
                'twitter' => 'nullable|url',
                'instagram' => 'nullable|url',
                'linkedin' => 'nullable|url',
                'youtube' => 'nullable|url',
                'tiktok' => 'nullable|url',
            ]);

            $storeId = authStore();
            $store = Store::find($storeId);
            
            if (!$store) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Store not found'
                ], 404);
            }

            $settings = $store->settings ?? [];
            $settings['social_media'] = $request->only([
                'facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok'
            ]);
            
            $store->update(['settings' => $settings]);

            return response()->json([
                'status' => 200,
                'message' => 'Social media settings updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to update social media settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Change user password
     */
    public function changePassword(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'current_password' => 'required|string',
                'new_password' => 'required|string|min:8|confirmed',
            ]);

            $user = Auth::user();

            // Verify current password
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'status' => 422,
                    'message' => 'Current password is incorrect'
                ], 422);
            }

            // Update password
            $user->update([
                'password' => Hash::make($request->new_password)
            ]);

            return response()->json([
                'status' => 200,
                'message' => 'Password changed successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to change password',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload avatar
     */
    public function uploadAvatar(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            $user = Auth::user();
            
            // Delete old avatar if exists
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }

            // Store new avatar
            $path = $request->file('avatar')->store('avatars', 'public');
            
            $user->update(['avatar' => $path]);

            return response()->json([
                'status' => 200,
                'message' => 'Avatar uploaded successfully',
                'data' => ['avatar_url' => Storage::url($path)]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to upload avatar',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload logo or favicon
     */
    public function uploadLogo(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'file' => 'required|image|mimes:jpeg,png,jpg,gif,svg,ico|max:2048',
                'type' => 'required|in:logo,dark_logo,favicon',
            ]);

            $storeId = authStore();
            $store = Store::find($storeId);
            
            if (!$store) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Store not found'
                ], 404);
            }

            $type = $request->type;
            
            // Delete old file if exists
            if ($type === 'favicon') {
                $settings = $store->settings ?? [];
                if (isset($settings['favicon'])) {
                    Storage::disk('public')->delete($settings['favicon']);
                }
            } else {
                if ($store->$type) {
                    Storage::disk('public')->delete($store->$type);
                }
            }

            // Store new file
            $path = $request->file('file')->store('store/' . $type, 'public');
            
            if ($type === 'favicon') {
                $settings = $store->settings ?? [];
                $settings['favicon'] = $path;
                $store->update(['settings' => $settings]);
            } else {
                $store->update([$type => $path]);
            }

            return response()->json([
                'status' => 200,
                'message' => ucfirst($type) . ' uploaded successfully',
                'data' => ['file_url' => Storage::url($path)]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to upload ' . $request->type,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reset settings to default
     */
    public function resetSettings(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'type' => 'required|in:general,profile,social',
            ]);

            $type = $request->type;

            switch ($type) {
                case 'general':
                    $storeId = authStore();
                    $store = Store::find($storeId);
                    $store->update([
                        'primary_color' => '#3B82F6',
                        'secondary_color' => '#6B7280',
                        'currency' => 'USD',
                        'settings' => [
                            'timezone' => 'UTC',
                            'language' => 'en',
                            'date_format' => 'Y-m-d',
                            'time_format' => 'H:i:s',
                        ]
                    ]);
                    break;
                    
                case 'social':
                    $storeId = authStore();
                    $store = Store::find($storeId);
                    $settings = $store->settings ?? [];
                    $settings['social_media'] = [];
                    $store->update(['settings' => $settings]);
                    break;
                    
                case 'profile':
                    // Profile reset would only clear optional fields
                    $user = Auth::user();
                    $user->update([
                        'bio' => null,
                        'location' => null,
                        'website' => null,
                        'date_of_birth' => null,
                        'gender' => null,
                    ]);
                    break;
            }

            return response()->json([
                'status' => 200,
                'message' => ucfirst($type) . ' settings reset successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to reset settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}