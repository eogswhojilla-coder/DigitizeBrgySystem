# 🚀 RBAC Quick Start Guide

## ✅ What Was Installed

Your system now has a **professional Role-Based Access Control (RBAC)** system for the **Admin Portal only**. The Resident Portal is completely untouched.

---

## 📦 Files Created/Modified

### Backend
- ✅ `config/permission.php` - Permission configuration
- ✅ `database/migrations/2026_03_01_000001_create_permission_tables.php` - Permission tables
- ✅ `database/seeders/RolesAndPermissionsSeeder.php` - Creates 5 roles & 47 permissions
- ✅ `database/seeders/AssignAdminRolesSeeder.php` - Assigns roles to existing admins
- ✅ `app/Models/User.php` - Added `HasRoles` trait
- ✅ `app/Http/Middleware/HandleInertiaRequests.php` - Shares permissions with frontend
- ✅ `bootstrap/app.php` - Registered permission middleware
- ✅ `bootstrap/providers.php` - Registered Spatie service provider
- ✅ `routes/api.php` - Protected admin routes with permissions

### Frontend
- ✅ `resources/js/hooks/usePermissions.jsx` - Permission checking hooks
- ✅ `resources/js/_examples/RBAC_Usage_Examples.jsx` - Usage examples (reference only)

### Documentation
- ✅ `RBAC_IMPLEMENTATION_GUIDE.md` - Complete implementation guide
- ✅ `RBAC_QUICK_START.md` - This file

---

## 👥 Roles Created

| Role | Description | Permission Count |
|------|-------------|------------------|
| **Super Admin** | Full system access | All 47 permissions |
| **Admin** | All operations except role management | 46 permissions |
| **Secretary** | Documents & records | 17 permissions |
| **Treasurer** | Payments & reports | 8 permissions |
| **Inventory Officer** | Equipment & borrowing | 7 permissions |

---

## 🎯 Current Admin Assignments

Your existing admin users have been assigned roles:

```
✅ Barangay Admin (admin@gmail.com) → Super Admin
✅ Test Admin (test.admin@brgy.gov.ph) → Admin
✅ Wakin - Admin (wakin.admin@gmail.com) → Admin
```

---

## 🔧 How to Use

### 1. Assign Roles to New Admins

```bash
php artisan tinker

# Find user
$user = User::where('email', 'newadmin@gmail.com')->first();

# Assign role
$user->assignRole('Secretary');

# OR assign multiple roles
$user->assignRole(['Admin', 'Treasurer']);

# Check what role they have
$user->getRoleNames(); // ['Secretary']

# Check permissions
$user->hasPermissionTo('certificates.approve'); // true/false
```

### 2. Frontend Usage (Admin Components Only)

**Import the hook:**
```jsx
import { usePermissions, Can } from '@/hooks/usePermissions';
```

**Check permissions:**
```jsx
function MyAdminComponent() {
    const { hasPermission } = usePermissions();
    
    return (
        <>
            {hasPermission('certificates.approve') && (
                <button>Approve Certificate</button>
            )}
            
            {/* OR use the Can component */}
            <Can permission="certificates.approve">
                <button>Approve Certificate</button>
            </Can>
        </>
    );
}
```

**Conditional sidebar menu:**
```jsx
const { hasPermission } = usePermissions();

const menuItems = [
    { name: 'Residents', show: hasPermission('residents.view') },
    { name: 'Certificates', show: hasPermission('certificates.view') },
    { name: 'Inventory', show: hasPermission('inventory.view') },
].filter(item => item.show);
```

### 3. Backend Protection (Already Done)

All admin API routes are now protected:

```php
// Example: Only users with 'certificates.approve' can access
Route::middleware(['auth:sanctum', 'permission:certificates.approve'])
    ->patch('/admin/certificate-requests/{id}/approve', [...]);
```

---

## 🧪 Testing the System

### Test 1: Login as Super Admin
```
Email: admin@gmail.com
Password: [your password]

✅ Should have access to ALL admin features
✅ Should see all sidebar items
✅ Should be able to manage roles
```

### Test 2: Create a Test Secretary
```bash
php artisan tinker

$user = User::where('email', 'secretary@test.com')->first();
$user->assignRole('Secretary');
```

Then login and verify:
- ✅ Can view/approve residents
- ✅ Can approve/reject certificates
- ✅ Can create blotter records
- ❌ Cannot see "System Settings" in sidebar
- ❌ Cannot manage roles

### Test 3: Resident Portal (Should Not Be Affected)
```
Login as any resident user

✅ Can submit certificate requests
✅ Can upload payment receipts
✅ Can borrow equipment
✅ No admin permissions apply
✅ No RBAC restrictions
```

---

## 📊 Permission Categories

### Residents Management
- `residents.view` - View resident list
- `residents.create` - Add new residents
- `residents.update` - Edit resident info
- `residents.delete` - Archive residents
- `residents.approve` - Approve resident accounts

### Certificates
- `certificates.view` - View certificate requests
- `certificates.approve` - Approve certificates
- `certificates.reject` - Reject certificates
- `certificates.generate` - Generate certificate PDFs
- `certificates.verify_payment` - Verify payment receipts
- `certificates.configure_fees` - Set certificate fees

### Payments
- `payments.view` - View payments
- `payments.verify` - Verify payments
- `payments.configure` - Configure payment settings

### Blotter
- `blotter.view` - View blotter records
- `blotter.create` - Create blotter records
- `blotter.update` - Update blotter records
- `blotter.resolve` - Resolve cases
- `blotter.notify` - Send blotter notifications

### Inventory
- `inventory.view` - View inventory
- `inventory.create` - Add inventory items
- `inventory.update` - Edit inventory
- `inventory.delete` - Remove items
- `borrow.approve` - Approve borrow requests
- `borrow.return` - Mark as returned

### Announcements
- `announcements.create` - Create announcements
- `announcements.update` - Edit announcements
- `announcements.delete` - Delete announcements
- `highlights.manage` - Manage barangay highlights

### Reports
- `reports.view` - View reports
- `reports.generate` - Generate new reports
- `reports.export` - Export to PDF/Excel

### System
- `users.manage` - Manage user accounts
- `roles.manage` - Manage roles (Super Admin only)
- `settings.manage` - System settings
- `backups.manage` - Database backups
- `logs.view` - View system logs

---

## 🔄 Common Tasks

### Change User's Role
```bash
php artisan tinker

$user = User::find(5);
$user->removeRole('Admin');
$user->assignRole('Treasurer');
```

### Give User a Direct Permission
```bash
$user = User::find(5);
$user->givePermissionTo('reports.view');
```

### Create a New Permission
```bash
use Spatie\Permission\Models\Permission;
Permission::create(['name' => 'new.feature', 'guard_name' => 'web']);
```

### Assign Permission to Role
```bash
use Spatie\Permission\Models\Role;
$role = Role::findByName('Secretary');
$role->givePermissionTo('new.feature');
```

### Clear Permission Cache
```bash
php artisan permission:cache-reset
```

---

## ⚠️ Important Notes

1. **Resident Portal is NOT affected** - Residents don't use RBAC
2. **Frontend checks are for UX** - Backend middleware enforces security
3. **Always use `permission:` middleware** on admin routes
4. **Check permissions in components** before showing admin actions
5. **Test thoroughly** after assigning new roles

---

## 🆘 Troubleshooting

### Issue: Permission not working
```bash
php artisan permission:cache-reset
php artisan config:clear
php artisan cache:clear
```

### Issue: User has no permissions after role assignment
```bash
# In tinker
$user = User::find(1);
$user->getAllPermissions(); // Should show permissions
$user->getRoleNames(); // Should show roles

# If empty, reassign role
$user->assignRole('Super Admin');
```

### Issue: Frontend not showing permissions
Check in browser console:
```javascript
// In React DevTools or console
window.props.auth.permissions // Should show array
```

### Issue: API returns 403 Forbidden
- Check if user is authenticated (`auth:sanctum` middleware)
- Check if user has the required permission
- Check if route has correct middleware
- Clear cache

---

## 📚 Next Steps

1. **Update Admin Components** - Add permission checks to your admin UI
2. **Test All Roles** - Login as different roles and verify access
3. **Customize Permissions** - Add/remove permissions as needed
4. **Train Your Team** - Share this guide with your team
5. **Monitor Usage** - Check admin logs for unauthorized access attempts

---

## 📖 Full Documentation

For detailed examples and advanced usage, see:
- `RBAC_IMPLEMENTATION_GUIDE.md` - Complete guide
- `resources/js/_examples/RBAC_Usage_Examples.jsx` - Code examples
- [Spatie Permission Docs](https://spatie.be/docs/laravel-permission/v6/introduction)

---

## ✅ You're All Set!

Your RBAC system is fully implemented and ready to use. Start by:
1. Testing with your Super Admin account
2. Creating test users with different roles
3. Updating your admin components with permission checks

**Need help?** Check the full documentation or the usage examples!

🎉 **Happy coding!**
