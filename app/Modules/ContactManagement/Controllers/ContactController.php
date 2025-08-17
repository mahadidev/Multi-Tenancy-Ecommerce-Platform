<?php

namespace App\Modules\ContactManagement\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\ContactManagement\Models\Contact;
use Illuminate\Http\Request;
use App\Http\Resources\ContactResource;

class ContactController extends Controller
{

    public function index(Request $request)
    {
        // Retrieve query parameters
        $search = $request->input('search'); // Search keyword
        $sort = $request->input('sort'); // Sort order
        $perPage = $request->input('per_page'); // Items per page

        // Fetch contacts with optional search and sorting, paginated
        $contacts = Contact::authorized()
            ->when($search, function ($query, $search) {
                $query
                    ->where('name', 'like', '%' . $search . '%')
                    ->orWhere('email', 'like', '%' . $search . '%');
            })
            ->when($sort, fn($query) => $query->orderBy('created_at', $sort), fn($query) => $query->latest());

        // Paginate or get all results based on the presence of `per_page`
        $paginated = $perPage ? $contacts->paginate($perPage) : $contacts->get();

        // Prepare the response
        $response = [
            'status' => 200,
            'data' => [
                'contacts' => ContactResource::collection($paginated),
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
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string',
            'phone' => 'nullable|string|max:255',
        ]);

        $validatedData['store_id'] = authStore();

        $contact = Contact::create($validatedData);

        return response()->json([
            'status' => 200,
            'message' => 'contact has been sumbitted',
            'data' => [
                'contact' => new ContactResource($contact),
            ],
        ], 200);
    }

    /**
     * View a specific contact.
     */
    public function show(Request $request, $id)
    {
        $contact = Contact::authorized()->find($id);

        if (!$contact) {
            return response()->json([
                'status' => 404,
                'message' => 'Contact not found'
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => [
                'contact' => new ContactResource($contact),
            ],
        ], 200);
    }

    /**
     * Delete a contact.
     */
    public function destroy(Request $request, $id)
    {
        $contact = Contact::authorized()->find($id);

        if (!$contact) {
            return response()->json([
                'status' => 404,
                'message' => 'Contact not found'
            ], 404);
        }

        $contact->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Contact deleted successfully',
        ], 200);
    }
}