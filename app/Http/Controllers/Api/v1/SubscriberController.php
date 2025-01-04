<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Subscriber;

class SubscriberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        return apiResponse(function () use ($request) {
           
            $validated = $request->validate([
                'email' => 'required|email|max:255',
            ]);

            $validated['store_id'] = authStore();

            $subscriber = Subscriber::create([
                'email' => $validated['email'],
                'store_id' => $validated['store_id'],
            ]);

            return response()->json(
                [
                    'status' => 200,
                    'message' => 'Subscribed successfully',
                    'data' => [
                        'subscribers' => $subscriber
                    ]
                ]
            );
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
