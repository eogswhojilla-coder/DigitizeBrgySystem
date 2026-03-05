# Announcement Notification System - Implementation Guide

## Overview
When administrators create announcements, all approved residents now automatically receive notifications in their accounts. This allows residents to stay informed about barangay announcements without checking manually.

---

## What Was Implemented

### 1. **Notification Class** 
**File:** [app/Notifications/AnnouncementCreatedNotification.php](app/Notifications/AnnouncementCreatedNotification.php)

- Sends database notifications (visible in resident accounts)
- Contains announcement details: id, title, description, dates
- Can also send email notifications if needed (currently disabled)
- Uses Laravel's notification infrastructure

**Notification Data Structure:**
```json
{
  "type": "announcement",
  "announcement_id": 123,
  "title": "Community Event",
  "message": "New announcement: Community Event",
  "description": "Join us for...",
  "start_at": "2024-03-01",
  "end_at": "2024-03-05",
  "created_at": "2024-02-25 10:00:00",
  "url": "/resident/announcements"
}
```

### 2. **Announcement Controller Updated**
**File:** [app/Http/Controllers/AnnouncementController.php](app/Http/Controllers/AnnouncementController.php)

**Changes made:**
- Added `User` model import for querying residents
- Added `Notification` facade for sending notifications
- Added `AnnouncementCreatedNotification` import
- Added notification sending logic after announcement creation

**How it works:**
```php
// After announcement is created, send to all approved residents
$residents = User::where('user_type', 'resident')
    ->where('status', 'approved')
    ->get();

Notification::send($residents, new AnnouncementCreatedNotification($announcement));
```

**Error Handling:**
- Wrapped in try-catch to prevent announcement creation from failing if notification fails
- Logs successful notification sends and any errors
- Announcement is still created even if notification fails

### 3. **Notification API Controller**
**File:** [app/Http/Controllers/NotificationController.php](app/Http/Controllers/NotificationController.php)

Provides REST API endpoints for managing notifications:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/notifications` | GET | Get all notifications (paginated) |
| `/api/notifications/unread` | GET | Get only unread notifications |
| `/api/notifications/{id}/read` | POST | Mark specific notification as read |
| `/api/notifications/mark-all-read` | POST | Mark all notifications as read |
| `/api/notifications/{id}` | DELETE | Delete a specific notification |

**Features:**
- Pagination support (15 per page)
- Returns unread count
- Requires authentication
- User can only access their own notifications

### 4. **API Routes Added**
**File:** [routes/api.php](routes/api.php)

Added routes in the resident portal section:
```php
Route::middleware(['role:resident'])->group(function () {
    // Notification routes
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::get('notifications/unread', [NotificationController::class, 'unread']);
    Route::post('notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
    Route::delete('notifications/{id}', [NotificationController::class, 'destroy']);
});
```

### 5. **Frontend Service**
**File:** [resources/js/app/services/notification-service.js](resources/js/app/services/notification-service.js)

JavaScript service for calling notification APIs from React components:

```javascript
import notificationService from '@/services/notification-service';

// Get all notifications
const { notifications, unread_count } = await notificationService.getAllNotifications();

// Get only unread
const { notifications } = await notificationService.getUnreadNotifications();

// Mark as read
await notificationService.markAsRead(notificationId);

// Mark all as read
await notificationService.markAllAsRead();

// Delete notification
await notificationService.deleteNotification(notificationId);
```

---

## How It Works

### Flow Diagram
```
Administrator creates announcement
            ↓
Announcement saved to database
            ↓
System finds all approved residents
            ↓
Notification sent to each resident
            ↓
Resident logs in and sees notification
            ↓
Resident clicks notification → redirected to announcements page
```

### Database Tables Used

1. **announcements** - Stores announcement data
2. **notifications** - Stores notification records
   - Each notification linked to a user (morphable)
   - Contains announcement data in JSON format
   - Has `read_at` timestamp for tracking read status

---

## Testing the System

### As Administrator:

1. **Create an announcement:**
   - Go to Announcements page
   - Click "Create Announcement"
   - Fill in title, description, dates
   - Upload images (optional)
   - Click Save

2. **Check the logs:**
   - Check `storage/logs/laravel.log`
   - Should see: `Announcement notification sent to X residents`

### As Resident:

1. **View notifications:**
   - Log in as a resident account
   - Check notification bell/icon
   - Should see new announcement notification

2. **Using the API:**
```javascript
// In browser console or React component
const response = await axios.get('/api/notifications/unread');
console.log(response.data);
// Should show announcement notification
```

---

## Frontend Integration (Next Steps)

You'll need to create UI components to display notifications:

### 1. **Notification Bell Component**
```jsx
// Example: NotificationBell.jsx
import { useState, useEffect } from 'react';
import notificationService from '@/services/notification-service';

export default function NotificationBell() {
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        loadNotifications();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(loadNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadNotifications = async () => {
        try {
            const data = await notificationService.getUnreadNotifications();
            setNotifications(data.notifications);
            setUnreadCount(data.unread_count);
        } catch (error) {
            console.error('Failed to load notifications:', error);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            loadNotifications(); // Refresh
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    return (
        <div className="relative">
            {/* Bell icon with badge */}
            <button onClick={() => setIsOpen(!isOpen)} className="relative">
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg">
                    <div className="p-4">
                        <h3 className="font-semibold mb-2">Notifications</h3>
                        {notifications.length === 0 ? (
                            <p className="text-gray-500 text-sm">No new notifications</p>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className="p-2 border-b hover:bg-gray-50 cursor-pointer"
                                    onClick={() => handleMarkAsRead(notif.id)}
                                >
                                    <p className="font-medium text-sm">{notif.data.title}</p>
                                    <p className="text-xs text-gray-600">{notif.data.message}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(notif.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
```

### 2. **Where to Add the Notification Bell**
Add to resident layout/header:
- [resources/js/app/pages/resident/_layout.jsx](resources/js/app/pages/resident/_layout.jsx)
- Place in the header/navbar section
- Visible on all resident pages

---

## Configuration Options

### Enable Email Notifications
If you want residents to also receive emails:

**Edit:** [app/Notifications/AnnouncementCreatedNotification.php](app/Notifications/AnnouncementCreatedNotification.php)

**Change line 26:**
```php
// From:
return ['database'];

// To:
return ['database', 'mail'];
```

The `toMail()` method is already implemented and will send formatted emails automatically.

### Customize Notification Message
**Edit:** [app/Notifications/AnnouncementCreatedNotification.php](app/Notifications/AnnouncementCreatedNotification.php)

**Modify the `toArray()` method** to change notification data structure.

### Filter Which Residents Receive Notifications
**Edit:** [app/Http/Controllers/AnnouncementController.php](app/Http/Controllers/AnnouncementController.php)

**Change lines 99-101:**
```php
// Current: All approved residents
$residents = User::where('user_type', 'resident')
    ->where('status', 'approved')
    ->get();

// Example: Only residents from specific barangay
$residents = User::where('user_type', 'resident')
    ->where('status', 'approved')
    ->where('barangay_id', $announcement->barangay_id) // if announcement has barangay
    ->get();
```

---

## Troubleshooting

### Notifications Not Appearing

**Check 1: Database**
```sql
SELECT * FROM notifications WHERE type LIKE '%AnnouncementCreatedNotification%' ORDER BY created_at DESC LIMIT 10;
```

**Check 2: Logs**
```bash
tail -f storage/logs/laravel.log
```
Look for: "Announcement notification sent to X residents" or error messages

**Check 3: User Status**
Make sure resident accounts are `status = 'approved'`:
```sql
SELECT id, first_name, last_name, user_type, status FROM users WHERE user_type = 'resident';
```

### Frontend Not Showing Notifications

**Check 1: API Response**
```javascript
// In browser console
axios.get('/api/notifications/unread').then(console.log).catch(console.error);
```

**Check 2: Authentication**
Make sure user is logged in and has `role:resident`

**Check 3: CSRF Token**
Notification service uses axios which should have CSRF token configured in bootstrap.js

---

## Database Schema

### Notifications Table Structure
```sql
CREATE TABLE notifications (
    id CHAR(36) PRIMARY KEY,           -- UUID
    type VARCHAR(255),                 -- Notification class name
    notifiable_type VARCHAR(255),      -- 'App\Models\User'
    notifiable_id BIGINT,              -- User ID
    data TEXT,                         -- JSON data
    read_at TIMESTAMP NULL,            -- When notification was read
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    INDEX(notifiable_type, notifiable_id)
);
```

---

## Summary

✅ **Backend Complete:**
- Notification class created
- Controller updated to send notifications
- API endpoints available
- Routes configured
- Service file created

⚠️ **Frontend Needs:**
- Notification bell component
- Notification list/dropdown
- Integration in resident layout
- Real-time updates (polling or websockets)

🎯 **Current Status:**
When an admin creates an announcement, all approved residents receive a notification stored in the database. Residents can access these via the API, but UI components need to be built to display them.

---

## Next Development Steps

1. **Create NotificationBell component** (high priority)
2. **Add to resident layout** (high priority)
3. **Create notification page** (medium priority)
   - Full list of all notifications
   - Filter by type, read/unread
   - Bulk actions
4. **Add real-time updates** (optional)
   - Laravel Echo + Pusher
   - Or polling every 30 seconds
5. **Add notification preferences** (optional)
   - Let residents choose which notifications to receive
   - Email vs database preferences

---

## Related Files

- [app/Notifications/AnnouncementCreatedNotification.php](app/Notifications/AnnouncementCreatedNotification.php)
- [app/Http/Controllers/AnnouncementController.php](app/Http/Controllers/AnnouncementController.php)
- [app/Http/Controllers/NotificationController.php](app/Http/Controllers/NotificationController.php)
- [routes/api.php](routes/api.php)
- [resources/js/app/services/notification-service.js](resources/js/app/services/notification-service.js)
- [app/Models/User.php](app/Models/User.php) (uses Notifiable trait)
- [database/migrations/2026_02_25_181452_create_notifications_table.php](database/migrations/2026_02_25_181452_create_notifications_table.php)

---

**System Ready:** ✅ Residents will receive notifications when announcements are created  
**Frontend Needed:** ⚠️ UI components to display notifications to residents
