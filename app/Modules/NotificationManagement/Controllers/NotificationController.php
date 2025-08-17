<?php

namespace App\Modules\NotificationManagement\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\NotificationResource;
use App\Modules\NotificationManagement\Models\Notification;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = auth()->user()
                        ->notifications()
                        ->latest()
                        ->get();
                        // ->paginate(10);

        return response()->json([
            'status' => 200,
            'data' =>  [
                'notifications' => NotificationResource::collection($notifications),
            ],
        ], 200);
    }

    public function view(Request $request, $id)
    {
        $notification = Notification::where('id', $id)->first();

        if(!$notification) {
            return response()->json([
                'status' => 404,
                'message' => 'Notification not found',
            ], 404);
        }

        $notification->update(['read_at' => now()]);

        return response()->json([
            'status' => 200,
            'data' => [
                'notification' => new NotificationResource($notification),
            ],
        ], 200);
    }

    public function markAllAsRead(Request $request)
    {
        $request->user()
        ->notifications()
        ->whereNull('read_at')
        ->update(['read_at' => now()]);

        return response()->json([
            'status' => 200,
            'message' => 'All notifications marked as read',
        ], 200);
    }
}