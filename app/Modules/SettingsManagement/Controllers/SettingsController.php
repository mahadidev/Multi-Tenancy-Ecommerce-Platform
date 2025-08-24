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
                'site_name' => $store->name,
                'admin_email' => $store->email,
                'site_description' => $store->description,
                'default_currency' => $store->currency ?? 'USD',
                'site_logo' => $store->logo,
                'dark_logo' => $store->dark_logo,
                'site_favicon' => $store->settings['favicon'] ?? null,
                'default_timezone' => $store->settings['timezone'] ?? 'UTC',
                'date_format' => $store->settings['date_format'] ?? 'Y-m-d',
                'time_format' => $store->settings['time_format'] ?? 'H:i:s',
                'maintenance_mode' => $store->settings['maintenance_mode'] ?? false,
                'allow_registration' => $store->settings['allow_registration'] ?? true,
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
                'site_name' => 'required|string|max:255',
                'admin_email' => 'required|email|max:255',
                'site_description' => 'nullable|string',
                'default_currency' => 'required|string|max:3',
                'default_timezone' => 'nullable|string|max:50',
                'date_format' => 'nullable|string|max:10',
                'time_format' => 'nullable|string|max:10',
                'maintenance_mode' => 'nullable|boolean',
                'allow_registration' => 'nullable|boolean',
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
                'name' => $request->site_name,
                'email' => $request->admin_email,
                'description' => $request->site_description,
                'currency' => $request->default_currency,
            ]);

            // Update settings JSON field
            $settings = $store->settings ?? [];
            $settings['timezone'] = $request->default_timezone;
            $settings['date_format'] = $request->date_format;
            $settings['time_format'] = $request->time_format;
            $settings['maintenance_mode'] = $request->maintenance_mode ?? false;
            $settings['allow_registration'] = $request->allow_registration ?? true;
            
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

            // Split name into first and last name for frontend compatibility
            $userName = $user->name ?? '';
            $nameParts = !empty($userName) ? explode(' ', trim($userName), 2) : ['', ''];
            
            $settings = [
                'first_name' => !empty($nameParts[0]) ? $nameParts[0] : '',
                'last_name' => isset($nameParts[1]) ? $nameParts[1] : '',
                'email' => $user->email,
                'phone' => $user->phone,
                'avatar' => $user->avatar,
                'bio' => $user->bio,
                'address' => $user->address ?? '',
                'city' => $user->settings['city'] ?? '',
                'state' => $user->settings['state'] ?? '',
                'country' => $user->settings['country'] ?? '',
                'postal_code' => $user->settings['postal_code'] ?? '',
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
                'first_name' => 'nullable|string|max:255',
                'last_name' => 'nullable|string|max:255',
                'email' => 'required|email|max:255|unique:users,email,' . Auth::id(),
                'phone' => 'nullable|string|max:20',
                'bio' => 'nullable|string|max:500',
                'address' => 'nullable|string|max:500',
                'city' => 'nullable|string|max:100',
                'state' => 'nullable|string|max:100',
                'country' => 'nullable|string|max:100',
                'postal_code' => 'nullable|string|max:20',
            ]);

            $user = Auth::user();
            
            // Combine first and last name
            $firstName = trim($request->first_name ?? '');
            $lastName = trim($request->last_name ?? '');
            $fullName = trim($firstName . ' ' . $lastName);
            
            // Ensure we have at least some name
            if (empty($fullName)) {
                $fullName = $firstName ?: $lastName ?: $user->name ?: 'User';
            }
            
            $user->update([
                'name' => $fullName,
                'email' => $request->email,
                'phone' => $request->phone,
                'bio' => $request->bio,
                'address' => $request->address,
            ]);
            
            // Update settings JSON for additional fields
            $settings = $user->settings ?? [];
            $settings['city'] = $request->city;
            $settings['state'] = $request->state;
            $settings['country'] = $request->country;
            $settings['postal_code'] = $request->postal_code;
            
            $user->update(['settings' => $settings]);

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
                'facebook_url' => $settings['social_media']['facebook_url'] ?? '',
                'twitter_url' => $settings['social_media']['twitter_url'] ?? '',
                'instagram_url' => $settings['social_media']['instagram_url'] ?? '',
                'linkedin_url' => $settings['social_media']['linkedin_url'] ?? '',
                'youtube_url' => $settings['social_media']['youtube_url'] ?? '',
                'tiktok_url' => $settings['social_media']['tiktok_url'] ?? '',
                'pinterest_url' => $settings['social_media']['pinterest_url'] ?? '',
                'whatsapp_number' => $settings['social_media']['whatsapp_number'] ?? '',
                'telegram_username' => $settings['social_media']['telegram_username'] ?? '',
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
                'facebook_url' => 'nullable|url',
                'twitter_url' => 'nullable|url',
                'instagram_url' => 'nullable|url',
                'linkedin_url' => 'nullable|url',
                'youtube_url' => 'nullable|url',
                'tiktok_url' => 'nullable|url',
                'pinterest_url' => 'nullable|url',
                'whatsapp_number' => 'nullable|string|max:20',
                'telegram_username' => 'nullable|string|max:100',
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
                'facebook_url', 'twitter_url', 'instagram_url', 'linkedin_url', 
                'youtube_url', 'tiktok_url', 'pinterest_url', 'whatsapp_number', 'telegram_username'
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