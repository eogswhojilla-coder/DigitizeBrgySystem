import { usePage } from '@inertiajs/react';

/**
 * Custom hook for checking user permissions in admin components.
 * 
 * ⚠️ IMPORTANT: This should only be used in ADMIN components, NOT in resident portal.
 * Resident portal does not use RBAC permissions.
 * 
 * @returns {Object} Permission checker functions
 */
export function usePermissions() {
    const { auth } = usePage().props;
    const permissions = auth?.permissions || [];
    const roles = auth?.roles || [];

    /**
     * Check if user has a specific permission
     * @param {string} permission - Permission name (e.g., 'certificates.approve')
     * @returns {boolean}
     */
    const hasPermission = (permission) => {
        return permissions.includes(permission);
    };

    /**
     * Check if user has ANY of the specified permissions
     * @param {string[]} permissionArray - Array of permission names
     * @returns {boolean}
     */
    const hasAnyPermission = (permissionArray) => {
        return permissionArray.some(p => permissions.includes(p));
    };

    /**
     * Check if user has ALL of the specified permissions
     * @param {string[]} permissionArray - Array of permission names
     * @returns {boolean}
     */
    const hasAllPermissions = (permissionArray) => {
        return permissionArray.every(p => permissions.includes(p));
    };

    /**
     * Check if user has a specific role
     * @param {string} role - Role name (e.g., 'Super Admin')
     * @returns {boolean}
     */
    const hasRole = (role) => {
        return roles.includes(role);
    };

    /**
     * Check if user has ANY of the specified roles
     * @param {string[]} roleArray - Array of role names
     * @returns {boolean}
     */
    const hasAnyRole = (roleArray) => {
        return roleArray.some(r => roles.includes(r));
    };

    /**
     * Check if user is Super Admin
     * @returns {boolean}
     */
    const isSuperAdmin = () => {
        return roles.includes('Super Admin');
    };

    return {
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole,
        hasAnyRole,
        isSuperAdmin,
        permissions,
        roles,
    };
}

/**
 * Component wrapper that only renders children if user has required permission
 * 
 * @example
 * <Can permission="certificates.approve">
 *   <ApproveButton />
 * </Can>
 */
export function Can({ permission, anyPermission, allPermissions, children }) {
    const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

    if (permission && !hasPermission(permission)) {
        return null;
    }

    if (anyPermission && !hasAnyPermission(anyPermission)) {
        return null;
    }

    if (allPermissions && !hasAllPermissions(allPermissions)) {
        return null;
    }

    return <>{children}</>;
}

/**
 * Component wrapper that only renders children if user DOES NOT have permission
 * 
 * @example
 * <Cannot permission="certificates.approve">
 *   <RequestApprovalMessage />
 * </Cannot>
 */
export function Cannot({ permission, children }) {
    const { hasPermission } = usePermissions();

    if (hasPermission(permission)) {
        return null;
    }

    return <>{children}</>;
}

/**
 * Component wrapper that only renders children if user has required role
 * 
 * @example
 * <HasRole role="Super Admin">
 *   <RoleManagementSection />
 * </HasRole>
 */
export function HasRole({ role, anyRole, children }) {
    const { hasRole, hasAnyRole } = usePermissions();

    if (role && !hasRole(role)) {
        return null;
    }

    if (anyRole && !hasAnyRole(anyRole)) {
        return null;
    }

    return <>{children}</>;
}

/**
 * Higher-order component that injects permission props
 * 
 * @example
 * const MyComponent = withPermissions(({ hasPermission, permissions }) => {
 *   return <div>{hasPermission('certificates.view') ? 'Yes' : 'No'}</div>;
 * });
 */
export function withPermissions(Component) {
    return function WrappedComponent(props) {
        const permissionProps = usePermissions();
        return <Component {...props} {...permissionProps} />;
    };
}

export default usePermissions;
