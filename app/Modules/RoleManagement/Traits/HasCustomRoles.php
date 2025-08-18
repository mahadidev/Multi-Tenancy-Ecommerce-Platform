<?php

namespace App\Modules\RoleManagement\Traits;

use App\Modules\RoleManagement\Models\Role;
use App\Modules\RoleManagement\Models\UserRole;
use App\Modules\RoleManagement\Models\Permission;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

trait HasCustomRoles
{
    /**
     * Get all user role assignments
     */
    public function userRoles(): HasMany
    {
        return $this->hasMany(UserRole::class);
    }

    /**
     * Get roles through pivot table
     */
    public function customRoles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'user_roles')
                    ->withPivot('store_id', 'assigned_by', 'assigned_at')
                    ->withTimestamps();
    }

    /**
     * Check if user has a specific role (globally or for a specific store)
     */
    public function hasCustomRole(string $roleSlug, ?int $storeId = null): bool
    {
        return $this->userRoles()
            ->whereHas('role', function ($query) use ($roleSlug) {
                $query->where('slug', $roleSlug);
            })
            ->when($storeId, function ($query) use ($storeId) {
                $query->where('store_id', $storeId);
            })
            ->exists();
    }

    /**
     * Check if user has any of the given roles
     */
    public function hasAnyCustomRole(array $roleSlugs, ?int $storeId = null): bool
    {
        return $this->userRoles()
            ->whereHas('role', function ($query) use ($roleSlugs) {
                $query->whereIn('slug', $roleSlugs);
            })
            ->when($storeId, function ($query) use ($storeId) {
                $query->where('store_id', $storeId);
            })
            ->exists();
    }

    /**
     * Check if user has all of the given roles
     */
    public function hasAllCustomRoles(array $roleSlugs, ?int $storeId = null): bool
    {
        $userRoleCount = $this->userRoles()
            ->whereHas('role', function ($query) use ($roleSlugs) {
                $query->whereIn('slug', $roleSlugs);
            })
            ->when($storeId, function ($query) use ($storeId) {
                $query->where('store_id', $storeId);
            })
            ->count();

        return $userRoleCount === count($roleSlugs);
    }

    /**
     * Check if user has a specific permission (through roles)
     */
    public function hasCustomPermission(string $permissionSlug, ?int $storeId = null): bool
    {
        // Store owners have all permissions for their store
        if ($storeId) {
            $store = \App\Modules\StoreManagement\Models\Store::find($storeId);
            if ($store && $store->owner_id === $this->id) {
                return true; // Store owners have full access
            }
        }
        
        return $this->userRoles()
            ->whereHas('role.permissions', function ($query) use ($permissionSlug) {
                $query->where('slug', $permissionSlug);
            })
            ->when($storeId, function ($query) use ($storeId) {
                $query->where('store_id', $storeId);
            })
            ->exists();
    }

    /**
     * Check if user has any of the given permissions
     */
    public function hasAnyCustomPermission(array $permissionSlugs, ?int $storeId = null): bool
    {
        return $this->userRoles()
            ->whereHas('role.permissions', function ($query) use ($permissionSlugs) {
                $query->whereIn('slug', $permissionSlugs);
            })
            ->when($storeId, function ($query) use ($storeId) {
                $query->where('store_id', $storeId);
            })
            ->exists();
    }

    /**
     * Get all permissions for the user (through roles)
     */
    public function getAllCustomPermissions(?int $storeId = null)
    {
        $roleIds = $this->userRoles()
            ->when($storeId, function ($query) use ($storeId) {
                $query->where('store_id', $storeId);
            })
            ->pluck('role_id');

        return Permission::whereHas('roles', function ($query) use ($roleIds) {
            $query->whereIn('roles.id', $roleIds);
        })->get();
    }

    /**
     * Get user's roles for a specific store
     */
    public function getRolesForStore(int $storeId)
    {
        return $this->userRoles()
            ->with('role')
            ->where('store_id', $storeId)
            ->get()
            ->pluck('role');
    }

    /**
     * Assign a role to user for a specific store
     */
    public function assignCustomRole(string $roleSlug, ?int $storeId = null, ?int $assignedBy = null): bool
    {
        $role = Role::where('slug', $roleSlug)
            ->where(function ($query) use ($storeId) {
                $query->where('store_id', $storeId)
                      ->orWhereNull('store_id'); // Global roles
            })
            ->first();

        if (!$role) {
            return false;
        }

        // Check if already assigned
        $existingAssignment = $this->userRoles()
            ->where('role_id', $role->id)
            ->where('store_id', $storeId)
            ->first();

        if ($existingAssignment) {
            return true; // Already assigned
        }

        UserRole::create([
            'user_id' => $this->id,
            'role_id' => $role->id,
            'store_id' => $storeId,
            'assigned_by' => $assignedBy,
            'assigned_at' => now(),
        ]);

        return true;
    }

    /**
     * Assign a role to user for a specific store using role ID
     */
    public function assignCustomRoleById(int $roleId, ?int $storeId = null, ?int $assignedBy = null): bool
    {
        $role = Role::where('id', $roleId)
            ->where(function ($query) use ($storeId) {
                $query->where('store_id', $storeId)
                      ->orWhereNull('store_id'); // Global roles
            })
            ->first();

        if (!$role) {
            return false;
        }

        // Check if already assigned
        $existingAssignment = $this->userRoles()
            ->where('role_id', $role->id)
            ->where('store_id', $storeId)
            ->first();

        if ($existingAssignment) {
            return true; // Already assigned
        }

        UserRole::create([
            'user_id' => $this->id,
            'role_id' => $role->id,
            'store_id' => $storeId,
            'assigned_by' => $assignedBy,
            'assigned_at' => now(),
        ]);

        return true;
    }

    /**
     * Remove a role from user for a specific store
     */
    public function removeCustomRole(string $roleSlug, ?int $storeId = null): bool
    {
        $role = Role::where('slug', $roleSlug)->first();

        if (!$role) {
            return false;
        }

        $deleted = $this->userRoles()
            ->where('role_id', $role->id)
            ->when($storeId, function ($query) use ($storeId) {
                $query->where('store_id', $storeId);
            })
            ->delete();

        return $deleted > 0;
    }

    /**
     * Sync roles for a specific store
     */
    public function syncCustomRoles(array $roleSlugs, ?int $storeId = null, ?int $assignedBy = null): void
    {
        // Remove existing role assignments for this store
        $this->userRoles()
            ->when($storeId, function ($query) use ($storeId) {
                $query->where('store_id', $storeId);
            })
            ->delete();

        // Assign new roles
        foreach ($roleSlugs as $roleSlug) {
            $this->assignCustomRole($roleSlug, $storeId, $assignedBy);
        }
    }

    /**
     * Check if user has store role (for backward compatibility)
     */
    public function hasStoreRole(int $storeId, string $role): bool
    {
        return $this->hasCustomRole($role, $storeId) || $this->hasStoreAccess($storeId);
    }

    /**
     * Check if user is admin (for backward compatibility)
     */
    public function isAdmin(): bool
    {
        return $this->hasCustomRole('super-admin') || $this->hasCustomRole('admin');
    }

    /**
     * Check if user can access admin panel (for backward compatibility)
     */
    public function canAccessAdminPanel(): bool
    {
        return $this->hasCustomRole('super-admin') || $this->hasCustomRole('admin');
    }
}