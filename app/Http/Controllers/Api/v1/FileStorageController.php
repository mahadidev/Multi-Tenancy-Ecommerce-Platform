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
            'user_id' => 'required|exists:users,id', // Check if the user_id exists in the users table
        ]);

        $fileStorage = FileStorage::where('user_id', $request->user_id)->latest()->get();
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
            'user_id' => 'required|exists:users,id', // Check if the user_id exists in the users table
        ]);

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
            'file' => 'required|file|mimes:jpg,jpeg,png,pdf|max:10048',
            'user_id' => 'nullable|exists:users,id', // Check if the user_id exists in the users table
        ]);

        if (!$request->user_id) {
            $request->user_id = auth()->user()->id;
        }


        $file = $request->file('file');
        $uniqueName = uniqid() . '_' . time(); // Generate a unique name
        $filePath = $file->storeAs('file_storage', $uniqueName, 'public'); // Store file in the 'uploads' folder

        // Save file details to the database
        $fileStorage = FileStorage::create([
            'user_id' => $request->user_id,
            'name' => $uniqueName,
            'type' => $file->extension() === 'pdf' ? 'pdf' : 'image',
            'location' => $filePath,
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'File uploaded successfully.',
            'data' => new FileStorageResource($fileStorage),
        ]);
    }

}
