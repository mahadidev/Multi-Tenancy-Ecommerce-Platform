<?php

namespace App\Modules\WebsiteBuilder\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\WebsiteBuilder\Models\StoreWebsite;
use App\Modules\WebsiteBuilder\Models\WebsiteForm;
use App\Modules\WebsiteBuilder\Models\FormSubmission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WebsiteFormController extends Controller
{
    public function index($websiteId): JsonResponse
    {
        $storeId = authStore();
        
        $website = StoreWebsite::byStore($storeId)->findOrFail($websiteId);
        
        $forms = $website->forms()->withCount(['submissions', 'submissions as unread_count' => function ($query) {
            $query->where('is_read', false);
        }])->get();

        return response()->json([
            'status' => 200,
            'message' => 'Forms retrieved successfully',
            'data' => $forms
        ]);
    }

    public function show($websiteId, $formId): JsonResponse
    {
        $storeId = authStore();
        
        $website = StoreWebsite::byStore($storeId)->findOrFail($websiteId);
        $form = $website->forms()->findOrFail($formId);

        return response()->json([
            'status' => 200,
            'message' => 'Form retrieved successfully',
            'data' => $form
        ]);
    }

    public function store($websiteId, Request $request): JsonResponse
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'type' => 'required|string|in:contact,newsletter,custom',
                'fields' => 'required|json',
                'settings' => 'nullable|json',
            ]);

            $storeId = authStore();
            $website = StoreWebsite::byStore($storeId)->findOrFail($websiteId);

            $form = WebsiteForm::create([
                'website_id' => $website->id,
                'name' => $request->name,
                'type' => $request->type,
                'fields' => json_decode($request->fields, true),
                'settings' => $request->settings ? json_decode($request->settings, true) : [],
                'is_active' => true,
            ]);

            return response()->json([
                'status' => 201,
                'message' => 'Form created successfully',
                'data' => $form
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to create form: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update($websiteId, $formId, Request $request): JsonResponse
    {
        try {
            $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'type' => 'sometimes|required|string|in:contact,newsletter,custom',
                'fields' => 'sometimes|required|json',
                'settings' => 'nullable|json',
                'is_active' => 'boolean',
            ]);

            $storeId = authStore();
            $website = StoreWebsite::byStore($storeId)->findOrFail($websiteId);
            $form = $website->forms()->findOrFail($formId);

            $updateData = $request->only(['name', 'type', 'is_active']);
            
            if ($request->has('fields')) {
                $updateData['fields'] = json_decode($request->fields, true);
            }
            
            if ($request->has('settings')) {
                $updateData['settings'] = $request->settings ? json_decode($request->settings, true) : [];
            }

            $form->update($updateData);

            return response()->json([
                'status' => 200,
                'message' => 'Form updated successfully',
                'data' => $form
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to update form: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($websiteId, $formId): JsonResponse
    {
        try {
            $storeId = authStore();
            $website = StoreWebsite::byStore($storeId)->findOrFail($websiteId);
            $form = $website->forms()->findOrFail($formId);

            // Delete all submissions first
            $form->submissions()->delete();
            $form->delete();

            return response()->json([
                'status' => 200,
                'message' => 'Form deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to delete form: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getSubmissions($websiteId, $formId): JsonResponse
    {
        $storeId = authStore();
        
        $website = StoreWebsite::byStore($storeId)->findOrFail($websiteId);
        $form = $website->forms()->findOrFail($formId);
        
        $submissions = $form->submissions()
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'status' => 200,
            'message' => 'Form submissions retrieved successfully',
            'data' => $submissions
        ]);
    }

    public function markSubmissionAsRead($websiteId, $formId, $submissionId): JsonResponse
    {
        try {
            $storeId = authStore();
            
            $website = StoreWebsite::byStore($storeId)->findOrFail($websiteId);
            $form = $website->forms()->findOrFail($formId);
            $submission = $form->submissions()->findOrFail($submissionId);

            $submission->markAsRead();

            return response()->json([
                'status' => 200,
                'message' => 'Submission marked as read'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to mark submission as read: ' . $e->getMessage()
            ], 500);
        }
    }
}