# Inventory Viewing Fix - Like Announcements

## Problem
Residents couldn't view available inventory items because the route was restricted to `'role:resident'` middleware, but the custom middleware was blocking access.

## Solution - Made it Like Announcements
Moved inventory viewing endpoints OUT of the restrictive middleware and into the public authenticated section, just like announcements.

## Before (Broken)
```php
// Lines 175-184 in api.php
Route::middleware(['auth:sanctum', 'role:resident'])->group(function () {
    // Blocked by custom role middleware
    Route::get('inventories/available', [ResidentController::class, 'getAvailableInventories']);
    Route::get('my-borrow-requests', [ResidentController::class, 'getMyBorrowRequests']);
});
```

## After (Fixed - Like Announcements)
```php
// Lines 120-129 in api.php
Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    // Public viewing - ANY authenticated user (admin or resident)
    Route::get('announcement', [AnnouncementController::class, 'index']);
    Route::get('inventories/available', [ResidentController::class, 'getAvailableInventories']);
    Route::get('my-borrow-requests', [ResidentController::class, 'getMyBorrowRequests']);
    
    // Admin management - requires permissions
    Route::middleware(['permission:announcements.create'])->group(function () {
        Route::post('announcement', [AnnouncementController::class, 'store']);
    });
});
```

## Key Changes
1. **Viewing endpoints** (`GET inventories/available`) - Moved to `auth:sanctum` only (no role check)
2. **Submitting requests** (`POST borrow-requests`) - Kept in `role:resident` group
3. **Admin management** (`POST/PUT/DELETE inventories`) - Already protected by `permission:inventory.view`

## How It Works Now

### For Residents:
- ✅ Login as resident
- ✅ View all available inventory items (no role check)
- ✅ See their own borrow requests
- ✅ Submit new borrow requests

### For Admins:
- ✅ Can also view available items
- ✅ Can manage inventory (create/edit/delete) via admin panel
- ✅ Can approve/reject borrow requests

## Result
**Inventory items now work exactly like announcements:**
- Admin adds inventory → Automatically visible to ALL authenticated users
- No permission errors
- No role checking for viewing
- Simple and consistent with the rest of the system

## Files Modified
- `routes/api.php` - Moved inventory viewing routes to public authenticated section
