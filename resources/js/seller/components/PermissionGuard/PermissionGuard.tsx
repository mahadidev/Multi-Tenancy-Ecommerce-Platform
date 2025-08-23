import usePermissions from '@seller/_hooks/usePermissions';
import { ReactNode } from 'react';

interface PermissionGuardProps {
    /**
     * Children to render if permission check passes
     */
    children: ReactNode;

    /**
     * Single permission required (OR with permissions array)
     */
    permission?: string;

    /**
     * Array of permissions - user needs ANY of these (OR logic)
     */
    permissions?: string[];

    /**
     * Array of permissions - user needs ALL of these (AND logic)
     */
    requireAll?: string[];

    /**
     * Component to render if permission check fails
     */
    fallback?: ReactNode;

    /**
     * Custom permission check function
     */
    condition?: () => boolean;

    /**
     * Invert the permission check (useful for hiding things from admins)
     */
    not?: boolean;
}

/**
 * PermissionGuard component for conditional rendering based on user permissions
 *
 * @example
 * // Show component only if user can create products
 * <PermissionGuard permission="products.create">
 *   <CreateProductButton />
 * </PermissionGuard>
 *
 * @example
 * // Show component if user has any product permission
 * <PermissionGuard permissions={['products.view', 'products.create', 'products.edit']}>
 *   <ProductList />
 * </PermissionGuard>
 *
 * @example
 * // Show component if user has all required permissions
 * <PermissionGuard requireAll={['products.create', 'categories.manage']}>
 *   <AdvancedProductForm />
 * </PermissionGuard>
 *
 * @example
 * // Custom condition with fallback
 * <PermissionGuard
 *   condition={() => user.role === 'admin'}
 *   fallback={<div>Access Denied</div>}
 * >
 *   <AdminPanel />
 * </PermissionGuard>
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
    children,
    permission,
    permissions = [],
    requireAll = [],
    fallback = null,
    condition,
    not = false,
}) => {
    const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

    let hasAccess = false;

    // Custom condition takes precedence
    if (condition) {
        hasAccess = condition();
    }
    // Check single permission
    else if (permission) {
        hasAccess = hasPermission(permission);
    }
    // Check if user has all required permissions (AND logic)
    else if (requireAll.length > 0) {
        hasAccess = hasAllPermissions(requireAll);
    }
    // Check if user has any of the permissions (OR logic)
    else if (permissions.length > 0) {
        hasAccess = hasAnyPermission(permissions);
    }
    // Default to true if no conditions specified
    else {
        hasAccess = true;
    }

    // Invert the check if 'not' prop is true
    if (not) {
        hasAccess = !hasAccess;
    }

    return hasAccess ? <>{children}</> : <>{fallback}</>;
};

export default PermissionGuard;
