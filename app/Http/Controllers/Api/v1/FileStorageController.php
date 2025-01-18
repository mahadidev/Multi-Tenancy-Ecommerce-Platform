<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FileStorage;
use App\Http\Resources\FileStorageResource;
use Illuminate\Support\Facades\Storage;

class FileStorageController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'user_id' => 'nullable|exists:users,id', // Check if the user_id exists in the users table
        ]);
        if (!isset($request->user_id)) {
            $request->user_id = auth()->user()->id;
        }


        $fileStorage = FileStorage::where('user_id', $request->user_id)
            ->latest()
            ->get();
        return response()->json([
            'status' => 200,
            'data' => FileStorageResource::collection($fileStorage),
        ]);
    }

    public function show(Request $request, $id)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id', // Check if the user_id exists in the users table
        ]);

        $fileStorage = FileStorage::where(['id' => $id, 'user_id' => $request->user_id])->first();

        if (!$fileStorage) {
            return response()->json([
                'status' => 404,
                'message' => 'File not found.',
            ]);
        }

        return response()->json([
            'status' => 200,
            'data' => new FileStorageResource($fileStorage),
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $request->validate([
            'user_id' => 'nullable|exists:users,id', // Check if the user_id exists in the users table
        ]);

        if (!isset($request->user_id)) {
            $request->user_id = auth()->user()->id;
        }

        $fileStorage = FileStorage::where(['id' => $id, 'user_id' => $request->user_id])->first();
        if (!$fileStorage) {
            return response()->json([
                'status' => 404,
                'message' => 'File not found.',
            ]);
        }

        // Delete the file from storage
        if (Storage::exists($fileStorage->location)) {
            Storage::delete($fileStorage->location);
        }

        // Delete the record from the database
        $fileStorage->delete();

        return response()->json([
            'status' => 200,
            'message' => 'File deleted successfully.',
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpg,jpeg,png,webp,pdf|max:10048',
            'user_id' => 'nullable|exists:users,id',
            "name" => "nullable|string",
            "tags" => "nullable|string",
            "alternate_text" => "nullable|string"
        ]);

        if (!$request->user_id) {
            $request->user_id = auth()->user()->id;
        }

        $file = $request->file('file');
        $uniqueName = uniqid() . '_' . time(); // Generate a unique name
        $extension = $file->extension(); // Get the file extension
        $fileName = $uniqueName . '.' . $extension; // Concatenate the unique name and the file extension
        $filePath = $file->storeAs('file_storage', $fileName, 'public'); // Store file in the 'uploads' folder

        // Get dimensions if the file is an image
        $width = null;
        $height = null;
        if ($file->extension() !== 'pdf') {
            $imagePath = storage_path('app/public/' . $filePath); // Full path to the stored file
            [$width, $height] = getimagesize($imagePath); // Get width and height
        }

        // Save file details to the database
        $fileStorage = FileStorage::create([
            'user_id' => $request->user_id,
            'name' => $uniqueName,
            'type' => $file->extension() === 'pdf' ? 'pdf' : 'image',
            'location' => $filePath,
            'width' => $width, // Save width
            'height' => $height, // Save height
            'alternate_text' => $request->alternate_text ?? null,
            'tags' => $request->tags ?? null,
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'File uploaded successfully.',
            'data' => new FileStorageResource($fileStorage),
        ]);
    }

}
