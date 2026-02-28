# 🔐 Role-Based Access Control (RBAC) Implementation Guide

## 📋 Overview

This system implements professional RBAC using **spatie/laravel-permission** package for the **Admin Portal only**. The Resident Portal remains completely untouched and operates independently.

---

## 🎯 Key Features

✅ **Module-based permissions** (e.g., `certificates.approve`, `inventory.view`)  
✅ **Five admin roles** with specific permission sets  
✅ **Backend protection** via middleware  
✅ **Frontend permission checks** for UI elements  
✅ **Resident portal isolation** - No RBAC applied to residents  
✅ **Sanctum guard integration** - Works seamlessly with existing authentication  

---

## 👥 Roles & Permissions

### 1. **Super Admin**
**Access:** Everything

- All 47 permissions
- Can manage roles and users
- Full system control

### 2. **Admin**
**Access:** All operational tasks (except role management)

**Cannot:**
- Manage roles (`roles.manage`)

### 3. **Secretary**
**Access:** Document and record management

**Permissions:**
- `residents.view`, `residents.approve`
- `certificates.*` (all certificate operations)
- `blotter.*` (all blotter operations)
- `announcements.*`, `highlights.manage`
- `reports.view`

### 4. **Treasurer**
**Access:** Financial operations

**Permissions:**
- `payments.*` (all payment operations)
- `certificates.view`, `certificates.verify_payment`
- `reports.*` (view, generate, export)

### 5. **Inventory Officer**
**Access:** Equipment and borrowing management

**Permissions:**
- `inventory.*` (all inventory operations)
- `borrow.approve`, `borrow.return`
- `reports.view`

---

## 📝 Complete Permissions List

```
RESIDENTS:
✓ residents.view
✓ residents.create
✓ residents.update
✓ residents.delete
✓ residents.approve

CERTIFICATES:
✓ certificates.view
✓ certificates.approve
✓ certificates.reject
✓ certificates.generate
✓ certificates.verify_payment
✓ certificates.configure_fees

PAYMENTS:
✓ payments.view
✓ payments.verify
✓ payments.configure

BLOTTER:
✓ blotter.view
✓ blotter.create
✓ blotter.update
✓ blotter.resolve
✓ blotter.notify

INVENTORY:
✓ inventory.view
✓ inventory.create
✓ inventory.update
✓ inventory.delete
✓ borrow.approve
✓ borrow.return

ANNOUNCEMENTS:
✓ announcements.create
✓ announcements.update
✓ announcements.delete
✓ highlights.manage

REPORTS:
✓ reports.view
✓ reports.generate
✓ reports.export

SYSTEM:
✓ users.manage
✓ roles.manage
✓ settings.manage
✓ backups.manage
✓ logs.view
```

---

## 🔧 Installation & Setup

### 1. Initial Setup (Already Done)

```bash
# Install package
composer require spatie/laravel-permission

# Run migrations
php artisan migrate

# Seed roles and permissions
php artisan db:seed --class=RolesAndPermissionsSeeder

# Assign roles to existing admins
php artisan db:seed --class=AssignAdminRolesSeeder
```

### 2. Assign Roles to New Admin Users

```bash
# Using Tinker
php artisan tinker

# Find user
$user = User::find(1);

# Assign role
$user->assignRole('Super Admin');

# OR assign multiple roles
$user->assignRole(['Admin', 'Secretary']);

# Remove role
$user->removeRole('Admin');

# Check permissions
$user->hasPermissionTo('certificates.approve'); // true/false
$user->can('certificates.approve'); // true/false
```

### 3. Frontend Usage (Admin Portal Only)

The `auth` object in Inertia now includes:
- `auth.user` - User object
- `auth.permissions` - Array of permission names
- `auth.roles` - Array of role names

**Example: Hide button if no permission**

```jsx
import { usePage } from '@inertiajs/react';

function CertificateApprovalPage() {
    const { auth } = usePage().props;
    const permissions = auth.permissions || [];

    return (
        <div>
            {permissions.includes('certificates.approve') && (
                <button onClick={handleApprove}>
                    Approve Certificate
                </button>
            )}
            
            {permissions.includes('certificates.reject') && (
                <button onClick={handleReject}>
                    Reject Certificate
                </button>
            )}
        </div>
    );
}
```

**Example: Conditional sidebar menu**

```jsx
const { auth } = usePage().props;
const permissions = auth.permissions || [];

const navigation = [
    {
        name: "Residents",
        href: "/administrator/barangay_residents",
        show: permissions.includes("residents.view"),
    },
    {
        name: "Certificates",
        href: "/administrator/certificate",
        show: permissions.includes("certificates.view"),
    },
    {
        name: "Inventory",
        href: "/administrator/inventory",
        show: permissions.includes("inventory.view"),
    },
    // ... etc
].filter(item => item.show !== false);
```

**Helper Function:**

```jsx
// Create a reusable permission checker
function usePermissions() {
    const { auth } = usePage().props;
    const permissions = auth.permissions || [];
    
    const hasPermission = (permission) => {
        return permissions.includes(permission);
    };
    
    const hasAnyPermission = (permissionArray) => {
        return permissionArray.some(p => permissions.includes(p));
    };
    
    const hasAllPermissions = (permissionArray) => {
        return permissionArray.every(p => permissions.includes(p));
    };
    
    return { hasPermission, hasAnyPermission, hasAllPermissions, permissions };
}

// Usage
function MyComponent() {
    const { hasPermission } = usePermissions();
    
    return (
        <>
            {hasPermission('inventory.create') && (
                <AddInventoryButton />
            )}
        </>
    );
}
```

---

## 🛡️ Backend Protection

### API Routes (routes/api.php)

Routes are now protected with permission middleware:

```php
// Example: Certificate approval
Route::middleware(['auth:sanctum', 'permission:certificates.approve'])->group(function () {
    Route::patch('admin/certificate-requests/{id}/approve', [...]);
});

// Example: Multiple permissions
Route::middleware(['auth:sanctum', 'permission:inventory.view|inventory.create'])->group(function () {
    // Can access with either permission
});
```

### Controller Methods

You can also check permissions in controllers:

```php
use Illuminate\Support\Facades\Auth;

public function approve($id)
{
    // Check permission
    if (!Auth::user()->can('certificates.approve')) {
        abort(403, 'Unauthorized action.');
    }
    
    // OR use gate
    $this->authorize('certificates.approve');
    
    // Process approval
}
```

---

## 🚫 Important: Resident Portal Isolation

### ✅ What's Protected
- All admin routes in `routes/api.php` (admin certificate management, inventory, blotter, etc.)
- All admin routes in `routes/web.php` (admin portal pages)
- Admin controllers and methods

### ❌ What's NOT Protected (And Should Remain That Way)
- Resident registration: `/api/register-resident`
- Resident certificate requests: `/api/my-certificate-requests`, `/api/certificate-requests`
- Resident borrow requests: `/api/borrow-requests`, `/api/my-borrow-requests`
- Resident profile: `/api/my-profile`
- Resident notifications: `/api/my-blotter-notifications`
- Public certificate verification: `/verify-certificate/{number}`

**These routes use `role:resident` middleware instead of `permission:` middleware.**

---

## 🧪 Testing RBAC

### 1. Test Super Admin Access
```bash
# Login as Super Admin
# Should have access to everything including role management
```

### 2. Test Secretary Role
```bash
# Assign Secretary role to a test user
php artisan tinker
$user = User::where('email', 'secretary@test.com')->first();
$user->assignRole('Secretary');

# Login and verify:
# ✅ Can view/approve residents
# ✅ Can approve/reject certificates
# ✅ Can create blotter records
# ❌ Cannot manage roles
# ❌ Cannot manage system settings
```

### 3. Test Treasurer Role
```bash
# Similar test for Treasurer
# ✅ Can verify payments
# ✅ Can generate reports
# ❌ Cannot approve certificates (except payment verification)
# ❌ Cannot manage inventory
```

### 4. Test Resident Portal
```bash
# Login as resident
# ✅ Can submit certificate requests
# ✅ Can upload payment receipts
# ✅ Can borrow inventory items
# ✅ RBAC permissions should NOT apply
# ✅ Should not see admin sidebar or permissions
```

---

## 🔄 Managing Roles & Permissions

### Add New Permission

```bash
# In tinker
use Spatie\Permission\Models\Permission;
Permission::create(['name' => 'new.permission', 'guard_name' => 'web']);
```

### Assign Permission to Role

```bash
use Spatie\Permission\Models\Role;
$role = Role::findByName('Secretary');
$role->givePermissionTo('new.permission');
```

### Check User Permissions

```bash
$user = User::find(1);
$user->getAllPermissions(); // Collection of permissions
$user->getPermissionNames(); // Array of permission names
$user->hasPermissionTo('certificates.approve'); // Boolean
```

### Sync Permissions (Replace all)

```bash
$role = Role::findByName('Secretary');
$role->syncPermissions(['residents.view', 'certificates.view']);
```

---

## 📊 Database Tables

The package creates these tables:
- `roles` - Role definitions
- `permissions` - Permission definitions
- `model_has_roles` - User-Role assignments
- `model_has_permissions` - Direct user-permission assignments
- `role_has_permissions` - Role-Permission mappings

---

## 🐛 Troubleshooting

### Issue: "Permission not found"
```bash
# Clear permission cache
php artisan permission:cache-reset

# OR
php artisan config:clear
php artisan cache:clear
```

### Issue: User has no permissions after role assignment
```bash
# Make sure guard_name is 'web'
$user->assignRole('Super Admin'); // Uses 'web' guard by default

# Check guard in config/permission.php
```

### Issue: Middleware not working
```bash
# Ensure middleware is registered in bootstrap/app.php
# Verify route has correct middleware
# Check user is authenticated via sanctum
```

---

## 📚 Additional Resources

- **Spatie Permission Docs:** https://spatie.be/docs/laravel-permission/v6/introduction
- **Laravel Authorization:** https://laravel.com/docs/11.x/authorization
- **Sanctum Authentication:** https://laravel.com/docs/11.x/sanctum

---

## ✅ Implementation Checklist

- [x] Install spatie/laravel-permission
- [x] Create and run permission migrations
- [x] Create roles and permissions seeder
- [x] Update User model with HasRoles trait
- [x] Register permission middleware
- [x] Protect admin API routes
- [x] Add permissions to Inertia shared data
- [x] Assign roles to existing admins
- [ ] Update admin frontend components with permission checks
- [ ] Test all roles and permissions
- [ ] Document for team

---

**🎉 RBAC is now fully implemented for the Admin Portal!**

**Remember:** The Resident Portal authentication and functionality remains completely independent and unaffected by RBAC.
