<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\NotificationResource;
use App\Models\Notification;
use Mockery\Matcher\Not;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = $request->user()->notifications()->paginate(10);

        return response()->json([
            'status' => 200,
            'data' =>  [
                NotificationResource::collection($notifications),
            ],
            'meta' => [
                'current_page' => $notifications->currentPage(),
                'first_page_url' => $notifications->url(1),
                'last_page' => $notifications->lastPage(),
                'last_page_url' => $notifications->url($notifications->lastPage()),
                'next_page_url' => $notifications->nextPageUrl(),
                'prev_page_url' => $notifications->previousPageUrl(),
                'total' => $notifications->total(),
                'per_page' => $notifications->perPage(),
            ],
        ], 200);
    }

    public function view(Request $request, $id)
    {
        $notification = Notification::find('id', $id);

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
        $request->user()->unreadNotifications()->update(['read_at' => now()]);

        return response()->json([
            'status' => 200,
            'message' => 'All notifications marked as read',
        ], 200);
    }
}
