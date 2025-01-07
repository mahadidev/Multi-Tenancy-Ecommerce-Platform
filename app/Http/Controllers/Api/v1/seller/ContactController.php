<?php

namespace App\Http\Controllers\Api\v1\Seller;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{

    public function index(Request $request){

        $contacts = Contact::authorized()->get();

        return apiResponse(function () use ($request, $contacts) {
            return response()->json([
                'status' => 200,
                'data' => [
                    'contacts' => $contacts
                ],
            ]);
        });

    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string',
        ]);

        $validatedData['store_id'] = authStore();

        $contact = Contact::create($validatedData);

        return apiResponse(function () use ($request, $contact) {
            return response()->json([
                'status' => 200,
                'message' => 'contact has been sumbitted',
                'data' => [
                    'contact' => $contact
                ],
            ]);
        });

    }

    /**
     * View a specific contact.
     */
    public function show(Request $request, $id)
    {
        return apiResponse(function () use ($request, $id) {
            
            $contact = Contact::authorized()->findorfail($id);

            return response()->json([
                'status' => 200,
                'data' => [
                    'contact' => $contact
                ],
            ]);
        });
    }

    /**
     * Delete a contact.
     */
    public function destroy(Request $request, $id)
    {
        return apiResponse(function () use ($request, $id) {
            $contact = Contact::authorized()->findorfail($id);
            $contact->delete();

            return response()->json([
                'status' => 200,
                'message' => 'Contact deleted successfully',
            ]);
        });

    }
}
