<?php

namespace App\Http\Middleware;

use App\Models\Store;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TrackStoreVisitor
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        // Extract store slug from the URL
        // Domain ex:  http://192.168.68.112:8080/sites/goody-bro/
        $domain = $request->segment(2); // "mystore1.com" or "mystore2.com"
        $store = Store::where('domain', $domain)->first();

        if ($store) {
            $ipAddress = $request->ip();
            $userAgent = $request->header('User-Agent');

            // // Check if the visitor is unique (per day, for example)
            // $existingVisitor = DB::table('store_visitors')
            //     ->where('store_id', $store->id)
            //     ->where('ip_address', $ipAddress)
            //     ->whereDate('visited_at', Carbon::today())
            //     ->exists();

            DB::table('store_visitors')->insert([
                'store_id'    => $store->id,
                'ip_address'  => $ipAddress,
                'user_agent'  => $userAgent,
                'visited_at'  => now(),
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);
        }

        return $next($request);
    }
}