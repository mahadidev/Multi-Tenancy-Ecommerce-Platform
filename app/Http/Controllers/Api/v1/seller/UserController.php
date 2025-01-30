<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Resources\UserResource;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(Request $request)
    {
        // Retrieve query parameters
        $sort = $request->input('sort'); // Sort order, default is 'desc'
        $perPage = $request->input('per_page'); // Items per page, optional
        // Start the query
        $query = User::query();

        // Check if a 'role' query parameter is present in the request
        if ($request->has('role')) {
            $query->role($request->input('role'));
        }

        // Fetch the users
        $users = $query
            ->when($request->has('search'), function ($query) use ($request) {
                $search = $request->input('search');
                $query->where('name', 'like', '%' . $search . '%')
                    ->orWhere('email', 'like', '%' . $search . '%');
            })
            ->when($sort, fn($query) => $query->orderBy('created_at', $sort), fn($query) => $query->latest());

        // Paginate or get all results based on the presence of `per_page`
        $paginated = $perPage ? $users->paginate($perPage) : $users->get();

        // Prepare the response
        $response = [
            'status' => 200,
            'data' => [
                'users' => UserResource::collection($paginated),
            ],
        ];

        // Add pagination meta data if `per_page` is provided
        if ($perPage) {
            $response['meta'] = [
                'current_page' => $paginated->currentPage(),
                'first_page_url' => $paginated->url(1),
                'last_page' => $paginated->lastPage(),
                'last_page_url' => $paginated->url($paginated->lastPage()),
                'next_page_url' => $paginated->nextPageUrl(),
                'prev_page_url' => $paginated->previousPageUrl(),
                'total' => $paginated->total(),
                'per_page' => $paginated->perPage(),
            ];
        }

        return response()->json($response, 200);
    }


    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|string|email|unique:users,email',
            'phone' => 'nullable',
            'password' => 'required|string',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' =>  Hash::make($request->password)
        ]);

        // Assign role to the user
        $roleName = $request->input('role', 'user'); // Default to 'user' if no role is provided
        $role = Role::firstOrCreate(['name' => $roleName]);
        $user->assignRole($role->name);

        return response()->json([
            'status' => 200,
            'message' => 'User created successfully!',
            'data' => [
                'user' => new UserResource($user)
            ]
        ]);
    }


    public function show($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'User not found'
            ]);
        }
        return response()->json([
            'status' => 200,
            'data' => [
                'user' => new UserResource($user)
            ]
        ]);
    }


    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'User not found'
            ]);
        }

        $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email|unique:users,email,' . $user->id,  // Ensure email is unique, excluding the current user's email
            'password' => 'nullable|string',  // Password is optional during update
        ]);

        // Update user attributes
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password ? Hash::make($request->password) : $user->password,  // Only hash the password if it is provided
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'User updated successfully!',
            'data' => [
                'user' => new UserResource($user)
            ]
        ]);
    }


    public function destroy(string $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'User not found'
            ]);
        }

        $user->delete();

        return response()->json([
            'status' => 200,
            'message' => 'User deleted successfully!'
        ]);
    }
}
