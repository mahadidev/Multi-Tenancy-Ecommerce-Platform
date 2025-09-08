<?php

namespace App\Modules\WebsiteBuilder\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\WebsiteBuilder\Services\HookService;
use App\Modules\WebsiteBuilder\Models\ThemeHook;
use App\Modules\WebsiteBuilder\Models\SellerHookSetting;
use App\Modules\WebsiteBuilder\Models\HookExecution;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class HookController extends Controller
{
    protected HookService $hookService;

    public function __construct(HookService $hookService)
    {
        $this->hookService = $hookService;
    }

    /**
     * Get available hooks
     */
    public function index(Request $request): JsonResponse
    {
        $query = ThemeHook::active();

        if ($request->has('type')) {
            $query->byType($request->type);
        }

        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        $hooks = $query->get();

        // Get seller settings
        $sellerId = auth()->user()->seller_id;
        $sellerSettings = SellerHookSetting::where('seller_id', $sellerId)
            ->pluck('is_enabled', 'hook_id');

        return response()->json([
            'success' => true,
            'data' => $hooks->map(function ($hook) use ($sellerSettings) {
                return [
                    'id' => $hook->id,
                    'name' => $hook->name,
                    'type' => $hook->type,
                    'category' => $hook->category,
                    'description' => $hook->description,
                    'parameters' => $hook->parameters,
                    'response_schema' => $hook->response_schema,
                    'is_core' => $hook->is_core,
                    'is_enabled' => $sellerSettings[$hook->id] ?? true
                ];
            })
        ]);
    }

    /**
     * Get hook details
     */
    public function show(int $hookId): JsonResponse
    {
        $hook = ThemeHook::findOrFail($hookId);
        $sellerId = auth()->user()->seller_id;
        
        $setting = SellerHookSetting::where('seller_id', $sellerId)
            ->where('hook_id', $hookId)
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'hook' => $hook,
                'setting' => $setting,
                'recent_executions' => HookExecution::where('seller_id', $sellerId)
                    ->where('hook_id', $hookId)
                    ->latest()
                    ->limit(10)
                    ->get()
            ]
        ]);
    }

    /**
     * Update hook settings
     */
    public function updateSettings(Request $request, int $hookId): JsonResponse
    {
        $request->validate([
            'is_enabled' => 'boolean',
            'custom_handler' => 'nullable|url',
            'settings' => 'nullable|array',
            'priority' => 'nullable|integer|min:1|max:100'
        ]);

        $sellerId = auth()->user()->seller_id;

        $setting = SellerHookSetting::updateOrCreate(
            [
                'seller_id' => $sellerId,
                'hook_id' => $hookId
            ],
            [
                'is_enabled' => $request->is_enabled ?? true,
                'custom_handler' => $request->custom_handler,
                'settings' => $request->settings,
                'priority' => $request->priority ?? 10
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Hook settings updated successfully',
            'data' => $setting
        ]);
    }

    /**
     * Execute a hook (for testing) - requires authentication
     */
    public function execute(Request $request): JsonResponse
    {
        $request->validate([
            'hook_name' => 'required|string',
            'params' => 'required|array'
        ]);

        $sellerId = auth()->user()->seller_id;
        $userId = auth()->id();

        try {
            $result = $this->hookService->execute(
                $request->hook_name,
                $request->params,
                [
                    'seller_id' => $sellerId,
                    'user_id' => $userId,
                    'request' => $request->all()
                ]
            );

            return response()->json([
                'success' => true,
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Execute a hook publicly (from website)
     */
    public function executePublic(Request $request): JsonResponse
    {
        $request->validate([
            'hook' => 'required|string|max:100|regex:/^[a-zA-Z0-9_-]+$/',
            'params' => 'array',
            'params.product_id' => 'sometimes|integer|min:1',
            'params.quantity' => 'sometimes|integer|min:1|max:999',
            'params.variant_id' => 'sometimes|integer|min:1',
            'context' => 'array',
            'context.subdomain' => 'sometimes|string|max:50|regex:/^[a-zA-Z0-9-]+$/'
        ]);

        // Get subdomain from header or context
        $subdomain = $request->header('X-Website-Subdomain') ?: 
                     $request->header('X-Subdomain') ?: 
                     $request->input('context.subdomain');
        
        if (!$subdomain) {
            return response()->json([
                'success' => false,
                'message' => 'Subdomain is required'
            ], 400);
        }

        // For testing purposes, create a mock seller
        // In production, you would find the actual seller by subdomain
        $seller = (object) [
            'id' => 1,
            'subdomain' => $subdomain,
            'name' => 'Test Store'
        ];

        try {
            $context = $request->input('context', []);
            $context['seller_id'] = $seller->id;
            $context['subdomain'] = $subdomain;
            $context['ip_address'] = $context['ip_address'] ?? $request->ip();
            $context['user_agent'] = $context['user_agent'] ?? $request->userAgent();

            $result = $this->hookService->execute(
                $request->input('hook'),
                $request->input('params', []),
                $context
            );

            return response()->json([
                'success' => true,
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Get hook executions
     */
    public function getExecutions(Request $request): JsonResponse
    {
        $sellerId = auth()->user()->seller_id;
        
        $query = HookExecution::where('seller_id', $sellerId);

        if ($request->has('hook_id')) {
            $query->where('hook_id', $request->hook_id);
        }

        if ($request->has('success')) {
            $query->where('success', $request->boolean('success'));
        }

        if ($request->has('from_date')) {
            $query->where('created_at', '>=', $request->from_date);
        }

        if ($request->has('to_date')) {
            $query->where('created_at', '<=', $request->to_date);
        }

        $executions = $query->with('hook')
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 50);

        return response()->json([
            'success' => true,
            'data' => $executions
        ]);
    }

    /**
     * Get hook statistics
     */
    public function statistics(Request $request): JsonResponse
    {
        $sellerId = auth()->user()->seller_id;
        
        $stats = [
            'total_executions' => HookExecution::where('seller_id', $sellerId)->count(),
            'successful_executions' => HookExecution::where('seller_id', $sellerId)->where('success', true)->count(),
            'failed_executions' => HookExecution::where('seller_id', $sellerId)->where('success', false)->count(),
            'average_execution_time' => HookExecution::where('seller_id', $sellerId)->avg('execution_time'),
            'hooks_by_type' => ThemeHook::active()
                ->select('type', \DB::raw('count(*) as count'))
                ->groupBy('type')
                ->get(),
            'most_used_hooks' => HookExecution::where('seller_id', $sellerId)
                ->select('hook_id', \DB::raw('count(*) as execution_count'))
                ->with('hook:id,name,type')
                ->groupBy('hook_id')
                ->orderBy('execution_count', 'desc')
                ->limit(10)
                ->get()
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}