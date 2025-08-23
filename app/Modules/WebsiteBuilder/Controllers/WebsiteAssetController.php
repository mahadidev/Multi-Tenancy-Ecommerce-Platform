<?php

namespace App\Modules\WebsiteBuilder\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\WebsiteBuilder\Models\StoreWebsite;
use App\Modules\WebsiteBuilder\Models\WebsiteAsset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class WebsiteAssetController extends Controller
{
    public function index($websiteId): JsonResponse
    {
        $storeId = authStore();
        
        $website = StoreWebsite::byStore($storeId)->findOrFail($websiteId);
        
        $assets = $website->assets()->orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => 200,
            'message' => 'Assets retrieved successfully',
            'data' => $assets
        ]);
    }

    public function upload($websiteId, Request $request): JsonResponse
    {
        try {
            $request->validate([
                'file' => 'required|file|max:10240', // 10MB max
                'alt_text' => 'nullable|string|max:255',
            ]);

            $storeId = authStore();
            $website = StoreWebsite::byStore($storeId)->findOrFail($websiteId);

            $file = $request->file('file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs("websites/{$website->id}/assets", $fileName, 'public');

            // Determine file type
            $mimeType = $file->getMimeType();
            $fileType = $this->determineFileType($mimeType);

            // Get file dimensions for images
            $dimensions = null;
            if ($fileType === 'image') {
                $imageInfo = getimagesize($file->getPathname());
                if ($imageInfo) {
                    $dimensions = [
                        'width' => $imageInfo[0],
                        'height' => $imageInfo[1],
                    ];
                }
            }

            $asset = WebsiteAsset::create([
                'website_id' => $website->id,
                'name' => $file->getClientOriginalName(),
                'file_path' => Storage::url($filePath),
                'file_type' => $fileType,
                'mime_type' => $mimeType,
                'file_size' => $file->getSize(),
                'dimensions' => $dimensions,
                'alt_text' => $request->alt_text,
            ]);

            return response()->json([
                'status' => 201,
                'message' => 'Asset uploaded successfully',
                'data' => $asset
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to upload asset: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($websiteId, $assetId): JsonResponse
    {
        try {
            $storeId = authStore();
            $website = StoreWebsite::byStore($storeId)->findOrFail($websiteId);
            
            $asset = $website->assets()->findOrFail($assetId);
            
            // Delete file from storage
            if (Storage::disk('public')->exists(str_replace('/storage/', '', $asset->file_path))) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $asset->file_path));
            }
            
            $asset->delete();

            return response()->json([
                'status' => 200,
                'message' => 'Asset deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to delete asset: ' . $e->getMessage()
            ], 500);
        }
    }

    private function determineFileType(string $mimeType): string
    {
        if (str_starts_with($mimeType, 'image/')) {
            return 'image';
        } elseif (str_starts_with($mimeType, 'video/')) {
            return 'video';
        } elseif (str_starts_with($mimeType, 'audio/')) {
            return 'audio';
        } elseif (in_array($mimeType, [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ])) {
            return 'document';
        } else {
            return 'other';
        }
    }
}