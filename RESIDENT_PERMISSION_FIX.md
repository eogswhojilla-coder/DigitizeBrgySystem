# Resident Inventory Borrow - Permission Fix Summary

## Problem
Residents couldn't view available inventory items in the inventory-borrow page because they didn't have Spatie roles/permissions assigned, causing `UnauthorizedException`.

## Root Cause
- Users had `user_type = 'resident'` field set correctly
- But NO Spatie roles were assigned (Spatie `roles` table was empty for residents)
- System was checking Spatie permissions somewhere in the middleware chain
- Even though routes use custom `'role:resident'` middleware (checks `user_type`), Spatie's permission system was also being triggered

## Solution Applied

### 1. Created "Resident" Role in Spatie
- Added to `RolesAndPermissionsSeeder.php`
- Assigned basic permissions:
  - `certificates.request`
  - `borrow.request`
  - `profile.view`
  - `profile.update`
  - `notifications.view`

### 2. Fixed Existing Resident Users
- Ran `fix_resident_permissions.php` script
- Assigned "Resident" role to all users with `user_type = 'resident'`
- 3 resident users were updated

### 3. Updated Seeders for Future
- **DatabaseSeeder.php**: Changed order to run `RolesAndPermissionsSeeder` BEFORE `UserSeeder`
- **UserSeeder.php**: Now assigns "Resident" role when creating resident users
- This ensures all NEW residents will have proper Spatie roles from creation

## How It Works Now

### Dual Auth System
Residents now have BOTH:
1. **user_type field** = 'resident' (for custom middleware `'role:resident'`)
2. **Spatie Role** = 'Resident' (for Spatie permission checks)

### Route Protection
```php
// Uses custom middleware - checks user_type
Route::middleware(['auth:sanctum', 'role:resident'])->group(function () {
    Route::get('inventories/available', [ResidentController::class, 'getAvailableInventories']);
});
```

## Testing
1. Login as resident: `resident@gmail.com` / `password`
2. Go to Inventory Borrow page
3. Should see 5 inventory items (Folding Chairs, Tables, Sound System, Basketball, Tents)
4. No more permission errors!

## Files Modified
- `database/seeders/RolesAndPermissionsSeeder.php` - Added Resident role
- `database/seeders/UserSeeder.php` - Auto-assign Resident role
- `database/seeders/DatabaseSeeder.php` - Fixed seeder order
- Created `fix_resident_permissions.php` - One-time fix script
- Created `check_resident_permissions.php` - Verification script

## Admin Note
If you add new residents through registration or admin panel, make sure they get assigned the "Resident" Spatie role in addition to setting `user_type = 'resident'`.
