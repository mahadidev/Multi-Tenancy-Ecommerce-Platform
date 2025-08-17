<?php

namespace App\Modules\UserManagement\Services;

use App\Modules\UserManagement\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class UserService
{
    /**
     * Get paginated users for a store
     */
    public function getUsersForStore(int $storeId, Request $request): LengthAwarePaginator
    {
        $query = User::query()
            ->where(function ($q) use ($storeId) {
                $q->whereJsonContains('store_id', $storeId)
                  ->orWhere('owner_id', $storeId);
            })
            ->with(['roles', 'permissions']);

        // Apply filters
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->has('role')) {
            $query->role($request->get('role'));
        }

        if ($request->has('status')) {
            $status = $request->get('status');
            if ($status === 'verified') {
                $query->whereNotNull('email_verified_at');
            } elseif ($status === 'unverified') {
                $query->whereNull('email_verified_at');
            }
        }

        return $query->paginate($request->get('per_page', 15));
    }

    /**
     * Create a new user
     */
    public function createUser(array $data): User
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'store_id' => $data['store_id'] ?? null,
            'email_verified_at' => $data['verify_immediately'] ?? false ? now() : null,
        ]);

        if (isset($data['role'])) {
            $user->assignRole($data['role']);
        }

        return $user;
    }

    /**
     * Update user information
     */
    public function updateUser(User $user, array $data): User
    {
        $updateData = [];

        if (isset($data['name'])) {
            $updateData['name'] = $data['name'];
        }

        if (isset($data['email'])) {
            $updateData['email'] = $data['email'];
        }

        if (isset($data['password'])) {
            $updateData['password'] = Hash::make($data['password']);
        }

        if (isset($data['store_id'])) {
            $updateData['store_id'] = $data['store_id'];
        }

        $user->update($updateData);

        if (isset($data['role'])) {
            $user->syncRoles([$data['role']]);
        }

        return $user->fresh();
    }

    /**
     * Delete a user
     */
    public function deleteUser(User $user): bool
    {
        return $user->delete();
    }

    /**
     * Get user profile information
     */
    public function getUserProfile(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'email_verified_at' => $user->email_verified_at,
            'roles' => $user->getRoleNames(),
            'permissions' => $user->getAllPermissions()->pluck('name'),
            'stores' => $user->ownedStores()->get(['id', 'name', 'domain']),
            'associated_stores' => $user->associatedStores()->get(['id', 'name', 'domain']),
            'primary_store' => $user->getPrimaryStore(),
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ];
    }

    /**
     * Update user profile
     */
    public function updateProfile(User $user, array $data): User
    {
        $allowedFields = ['name', 'email'];
        $updateData = array_intersect_key($data, array_flip($allowedFields));

        if (isset($data['current_password']) && isset($data['new_password'])) {
            if (!Hash::check($data['current_password'], $user->password)) {
                throw new \Exception('Current password is incorrect');
            }
            $updateData['password'] = Hash::make($data['new_password']);
        }

        $user->update($updateData);
        return $user->fresh();
    }

    /**
     * Add user to store
     */
    public function addUserToStore(User $user, int $storeId, string $role = 'user'): bool
    {
        $storeIds = $user->store_id ?? [];
        
        if (!in_array($storeId, $storeIds)) {
            $storeIds[] = $storeId;
            $user->update(['store_id' => $storeIds]);
        }

        if (!$user->hasRole($role)) {
            $user->assignRole($role);
        }

        return true;
    }

    /**
     * Remove user from store
     */
    public function removeUserFromStore(User $user, int $storeId): bool
    {
        $storeIds = $user->store_id ?? [];
        
        if (in_array($storeId, $storeIds)) {
            $storeIds = array_diff($storeIds, [$storeId]);
            $user->update(['store_id' => array_values($storeIds)]);
            return true;
        }

        return false;
    }

    /**
     * Get users by role
     */
    public function getUsersByRole(string $role, int $storeId = null): Collection
    {
        $query = User::role($role);

        if ($storeId) {
            $query->where(function ($q) use ($storeId) {
                $q->whereJsonContains('store_id', $storeId)
                  ->orWhereHas('ownedStores', function ($sq) use ($storeId) {
                      $sq->where('id', $storeId);
                  });
            });
        }

        return $query->get();
    }

    /**
     * Verify user email
     */
    public function verifyEmail(User $user): bool
    {
        return $user->update([
            'email_verified_at' => now(),
            'verification_code' => null,
        ]);
    }

    /**
     * Get user statistics
     */
    public function getUserStats(int $storeId = null): array
    {
        $query = User::query();

        if ($storeId) {
            $query->where(function ($q) use ($storeId) {
                $q->whereJsonContains('store_id', $storeId)
                  ->orWhereHas('ownedStores', function ($sq) use ($storeId) {
                      $sq->where('id', $storeId);
                  });
            });
        }

        return [
            'total_users' => $query->count(),
            'verified_users' => $query->whereNotNull('email_verified_at')->count(),
            'unverified_users' => $query->whereNull('email_verified_at')->count(),
            'sellers' => $query->role('seller')->count(),
            'customers' => $query->role('user')->count(),
            'admins' => $query->role(['admin', 'store_admin'])->count(),
        ];
    }
}