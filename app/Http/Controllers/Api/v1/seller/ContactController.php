<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{

    public function index(Request $request){

        $contacts = Contact::authorized()->get();
        
        return response()->json([
            'status' => 200,
            'data' => [
                'contacts' => $contacts
            ],
        ]);

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
                'contact' => $contact
            ],
        ]);

    }

    /**
     * View a specific contact.
     */
    public function show(Request $request, $id)
    {
        $contact = Contact::authorized()->find($id);

        if(!$contact){
            return response()->json([
                'status' => 404,
                'message' => 'Contact not found'
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => [
                'contact' => $contact
            ],
        ]);
    }

    /**
     * Delete a contact.
     */
    public function destroy(Request $request, $id)
    {
        $contact = Contact::authorized()->find($id);

        if(!$contact){
            return response()->json([
                'status' => 404,
                'message' => 'Contact not found'
            ], 404);
        }
        
        $contact->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Contact deleted successfully',
        ]);

    }
}
