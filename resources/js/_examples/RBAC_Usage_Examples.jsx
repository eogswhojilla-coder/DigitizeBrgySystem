/**
 * ========================================
 * RBAC Permission Usage Examples
 * ========================================
 * 
 * This file demonstrates how to use the permission system
 * in admin components. DO NOT copy this file to production,
 * it's just for reference.
 */

import { usePermissions, Can, Cannot, HasRole } from '@/hooks/usePermissions';
import { usePage } from '@inertiajs/react';

// ============================================
// EXAMPLE 1: Basic Permission Check
// ============================================
function CertificateApprovalButton() {
    const { hasPermission } = usePermissions();

    return (
        <>
            {hasPermission('certificates.approve') && (
                <button className="btn-approve">
                    Approve Certificate
                </button>
            )}
            
            {hasPermission('certificates.reject') && (
                <button className="btn-reject">
                    Reject Certificate
                </button>
            )}
        </>
    );
}

// ============================================
// EXAMPLE 2: Using <Can> Component
// ============================================
function InventoryActions() {
    return (
        <div className="actions">
            <Can permission="inventory.create">
                <button>Add New Item</button>
            </Can>
            
            <Can permission="inventory.update">
                <button>Edit Item</button>
            </Can>
            
            <Can permission="inventory.delete">
                <button className="btn-danger">Delete Item</button>
            </Can>
        </div>
    );
}

// ============================================
// EXAMPLE 3: Multiple Permissions (Any)
// ============================================
function PaymentVerificationSection() {
    const { hasAnyPermission } = usePermissions();

    // Show if user has ANY of these permissions
    if (!hasAnyPermission(['payments.verify', 'certificates.verify_payment'])) {
        return <div>You don't have access to payment verification.</div>;
    }

    return (
        <div>
            <Can anyPermission={['payments.verify', 'certificates.verify_payment']}>
                <button>Verify Payment</button>
            </Can>
            
            <Can permission="payments.configure">
                <button>Configure Payment Settings</button>
            </Can>
        </div>
    );
}

// ============================================
// EXAMPLE 4: All Permissions Required
// ============================================
function SystemConfigurationPage() {
    const { hasAllPermissions } = usePermissions();

    // User must have ALL these permissions
    const requiredPermissions = ['settings.manage', 'backups.manage'];

    if (!hasAllPermissions(requiredPermissions)) {
        return (
            <div className="error">
                You need full system administration permissions to access this page.
            </div>
        );
    }

    return (
        <div>
            <h1>System Configuration</h1>
            <Can allPermissions={['settings.manage', 'backups.manage']}>
                <DangerZone />
            </Can>
        </div>
    );
}

// ============================================
// EXAMPLE 5: Role-Based Rendering
// ============================================
function RoleManagementSection() {
    const { isSuperAdmin, hasRole } = usePermissions();

    if (!isSuperAdmin()) {
        return <div>Only Super Admin can manage roles.</div>;
    }

    return (
        <div>
            <h2>Role Management</h2>
            <HasRole role="Super Admin">
                <button>Add New Role</button>
                <button>Edit Permissions</button>
            </HasRole>
        </div>
    );
}

// ============================================
// EXAMPLE 6: Conditional Sidebar Navigation
// ============================================
function AdminSidebar() {
    const { hasPermission } = usePermissions();

    const navigationItems = [
        {
            name: "Dashboard",
            href: "/administrator/dashboard",
            icon: "dashboard",
            show: true, // Always show dashboard
        },
        {
            name: "Residents",
            href: "/administrator/barangay_residents",
            icon: "people",
            show: hasPermission("residents.view"),
        },
        {
            name: "Certificates",
            href: "/administrator/certificate",
            icon: "certificate",
            show: hasPermission("certificates.view"),
        },
        {
            name: "Blotter Records",
            href: "/administrator/blotter_record",
            icon: "report",
            show: hasPermission("blotter.view"),
        },
        {
            name: "Inventory",
            href: "/administrator/inventory",
            icon: "inventory",
            show: hasPermission("inventory.view"),
        },
        {
            name: "Announcements",
            href: "/administrator/announcement",
            icon: "announcement",
            show: hasPermission("announcements.create"),
        },
        {
            name: "Reports",
            href: "/administrator/reports",
            icon: "chart",
            show: hasPermission("reports.view"),
        },
        {
            name: "System Settings",
            href: "/administrator/settings",
            icon: "settings",
            show: hasPermission("settings.manage"),
        },
        {
            name: "User Management",
            href: "/administrator/users",
            icon: "user",
            show: hasPermission("users.manage"),
        },
    ].filter(item => item.show);

    return (
        <nav>
            {navigationItems.map(item => (
                <a key={item.href} href={item.href}>
                    {item.icon} {item.name}
                </a>
            ))}
        </nav>
    );
}

// ============================================
// EXAMPLE 7: Table Actions with Permissions
// ============================================
function CertificateRequestTable({ requests }) {
    const { hasPermission } = usePermissions();

    return (
        <table>
            <thead>
                <tr>
                    <th>Request #</th>
                    <th>Resident</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {requests.map(request => (
                    <tr key={request.id}>
                        <td>{request.id}</td>
                        <td>{request.resident_name}</td>
                        <td>{request.certificate_type}</td>
                        <td>{request.status}</td>
                        <td>
                            <Can permission="certificates.view">
                                <button>View Details</button>
                            </Can>
                            
                            <Can permission="certificates.verify_payment">
                                {request.status === 'pending_payment' && (
                                    <button>Verify Payment</button>
                                )}
                            </Can>
                            
                            <Can permission="certificates.approve">
                                {request.status === 'verified' && (
                                    <button className="btn-success">Approve</button>
                                )}
                            </Can>
                            
                            <Can permission="certificates.reject">
                                <button className="btn-danger">Reject</button>
                            </Can>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

// ============================================
// EXAMPLE 8: Conditional Form Fields
// ============================================
function InventoryForm() {
    const { hasPermission } = usePermissions();

    return (
        <form>
            <input name="name" placeholder="Item Name" required />
            <input name="quantity" type="number" placeholder="Quantity" required />
            
            <Can permission="inventory.update">
                <select name="status">
                    <option value="available">Available</option>
                    <option value="maintenance">Under Maintenance</option>
                    <option value="retired">Retired</option>
                </select>
            </Can>
            
            <Can permission="payments.configure">
                <input name="rental_fee" type="number" placeholder="Rental Fee" />
                <label>
                    <input type="checkbox" name="has_fee" />
                    Charge rental fee
                </label>
            </Can>
            
            <button type="submit">
                {hasPermission('inventory.create') ? 'Create Item' : 'Request Creation'}
            </button>
        </form>
    );
}

// ============================================
// EXAMPLE 9: Using Cannot Component
// ============================================
function RestrictedFeature() {
    return (
        <>
            <Can permission="reports.export">
                <button className="btn-primary">
                    Export Report to PDF
                </button>
            </Can>
            
            <Cannot permission="reports.export">
                <div className="alert alert-warning">
                    You don't have permission to export reports.
                    Please contact your administrator.
                </div>
            </Cannot>
        </>
    );
}

// ============================================
// EXAMPLE 10: Permission Status Display
// ============================================
function UserPermissionBadge() {
    const { permissions, roles } = usePermissions();

    return (
        <div className="user-info">
            <div className="roles">
                {roles.map(role => (
                    <span key={role} className="badge badge-primary">
                        {role}
                    </span>
                ))}
            </div>
            
            <details className="permissions-details">
                <summary>View Permissions ({permissions.length})</summary>
                <ul>
                    {permissions.map(perm => (
                        <li key={perm}>{perm}</li>
                    ))}
                </ul>
            </details>
        </div>
    );
}

// ============================================
// EXAMPLE 11: Disable Button Instead of Hide
// ============================================
function ApprovalButtons({ requestId }) {
    const { hasPermission } = usePermissions();
    const canApprove = hasPermission('certificates.approve');
    const canReject = hasPermission('certificates.reject');

    return (
        <div className="button-group">
            <button
                onClick={() => approve(requestId)}
                disabled={!canApprove}
                title={!canApprove ? "You don't have permission to approve" : ""}
                className={!canApprove ? 'btn-disabled' : 'btn-success'}
            >
                Approve
            </button>
            
            <button
                onClick={() => reject(requestId)}
                disabled={!canReject}
                title={!canReject ? "You don't have permission to reject" : ""}
                className={!canReject ? 'btn-disabled' : 'btn-danger'}
            >
                Reject
            </button>
        </div>
    );
}

// ============================================
// EXAMPLE 12: Permission-Based Tabs
// ============================================
function AdminTabs() {
    const { hasPermission } = usePermissions();

    const tabs = [
        { id: 'overview', label: 'Overview', show: true },
        { id: 'residents', label: 'Residents', show: hasPermission('residents.view') },
        { id: 'payments', label: 'Payments', show: hasPermission('payments.view') },
        { id: 'reports', label: 'Reports', show: hasPermission('reports.view') },
        { id: 'settings', label: 'Settings', show: hasPermission('settings.manage') },
    ].filter(tab => tab.show);

    return (
        <div className="tabs">
            {tabs.map(tab => (
                <button key={tab.id} className="tab">
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

// ============================================
// NOTES:
// ============================================
/**
 * 1. Always use permission checks for ADMIN components only
 * 2. NEVER use in Resident Portal components
 * 3. Frontend checks are for UX only - backend middleware enforces security
 * 4. Use descriptive permission names following module.action format
 * 5. Prefer <Can> component for cleaner JSX
 * 6. Use hasAnyPermission when multiple permissions can grant access
 * 7. Use hasAllPermissions when user needs multiple permissions
 * 8. Consider disabling vs hiding elements based on UX requirements
 */
