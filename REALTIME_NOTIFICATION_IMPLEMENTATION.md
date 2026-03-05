# Real-Time Announcement Notification System

## Overview
When administrators or secretaries create announcements, residents now receive **real-time notifications** in their portal. The system automatically updates every 30 seconds without requiring page refresh.

---

## ✅ What's Implemented

### 1. **Notification Bell Component**
**File:** [resources/js/app/_sections/notification-section.jsx](resources/js/app/_sections/notification-section.jsx)

**Features:**
- ✅ Real bell icon with unread count badge
- ✅ Auto-polling every 30 seconds for new notifications
- ✅ Dropdown showing recent unread notifications
- ✅ Click notification → marks as read + redirects to announcements page
- ✅ "Mark all as read" button
- ✅ Relative timestamps (e.g., "5m ago", "2h ago")
- ✅ Auto-closes when clicking outside
- ✅ Displays notification type, title, message, and date

**Polling Mechanism:**
```javascript
// Loads notifications every 30 seconds automatically
useEffect(() => {
    loadNotifications();
    const interval = setInterval(() => {
        loadNotifications();
    }, 30000); // 30 seconds
    return () => clearInterval(interval);
}, []);
```

**Visual Features:**
- Red badge with unread count (shows "9+" if more than 9)
- Dropdown with max height and scrolling
- Hover effects on notification items
- Icon indicators for announcement type
- "View all announcements" link in footer

---

### 2. **Resident Portal Header Update**
**File:** [resources/js/app/pages/resident/_sections/resident-topbar-section.jsx](resources/js/app/pages/resident/_sections/resident-topbar-section.jsx)

**Changes:**
- Added notification bell to the resident portal header
- Positioned between "Resident Portal" title and user menu
- Visible on all resident pages (dashboard, announcements, certificates, etc.)

**Layout:**
```
[Menu Icon] | Resident Portal | [Notification Bell 🔔] [User Menu]
```

---

### 3. **Auto-Refreshing Announcements Page**
**File:** [resources/js/app/pages/resident/announcements/page.jsx](resources/js/app/pages/resident/announcements/page.jsx)

**Changes:**
- Added automatic refresh every 30 seconds
- Fetches new announcements without page reload
- Applies to both List View and Calendar View

**Implementation:**
```javascript
useEffect(() => {
    // Initial load
    dispatch(get_announcement_thunk());
    dispatch(get_announcement_calendar_thunk());
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
        dispatch(get_announcement_thunk());
        dispatch(get_announcement_calendar_thunk());
    }, 30000);
    
    return () => clearInterval(interval);
}, [dispatch]);
```

**Result:**
- Residents see new announcements appear automatically
- No manual refresh needed
- Search functionality still works during auto-refresh

---

### 4. **Auto-Refreshing Dashboard**
**File:** [resources/js/app/pages/resident/dashboard/page.jsx](resources/js/app/pages/resident/dashboard/page.jsx)

**Changes:**
- Dashboard shows "Recent Announcements" section
- Auto-refreshes every 30 seconds
- Also refreshes inventory data

**Benefits:**
- Residents see latest 3 announcements on dashboard
- Real-time updates even when not on announcements page
- Keeps "Total Announcements" count current

---

## 🎯 How It Works End-to-End

### Flow Diagram:
```
Admin/Secretary creates announcement
            ↓
Backend sends notification to all approved residents
            ↓
Notification stored in database (notifications table)
            ↓
Resident's notification bell polls API every 30 seconds
            ↓
New notification appears in bell dropdown (badge shows count)
            ↓
Resident clicks notification → marks as read → goes to announcements
            ↓
Announcements page shows new announcement (also auto-refreshing)
```

### Timeline Example:
```
10:00 AM - Admin creates "Community Clean-up Drive" announcement
10:00 AM - Backend sends notification to 50 residents (stored in database)
10:00 AM - System logs: "Announcement notification sent to 50 residents"

10:00:30 AM - Resident's bell polls API (first check after creation)
10:00:30 AM - Bell badge shows "1" (1 unread notification)
10:00:30 AM - Dropdown shows: "New announcement: Community Clean-up Drive"

10:01:00 AM - Announcements page auto-refreshes
10:01:00 AM - New announcement appears in list view

10:02 AM - Resident clicks notification in bell dropdown
10:02 AM - Notification marked as read (badge disappears)
10:02 AM - Resident redirected to /resident/announcements
10:02 AM - Sees full announcement details
```

---

## 📱 User Experience

### For Residents:

**When logged in:**
1. See notification bell in top-right corner (all pages)
2. Red badge appears when new announcements are posted
3. Click bell → see dropdown with notification list
4. Click notification → automatically go to announcements page
5. Announcements page shows the new announcement

**Real-time updates:**
- Dashboard refreshes every 30 seconds → see latest announcements
- Announcements page refreshes every 30 seconds → see new posts
- Notification bell checks every 30 seconds → see badge update
- **No manual refresh needed!**

### For Admins/Secretaries:

**When creating announcement:**
1. Fill out announcement form (title, description, dates, images)
2. Click Save
3. System automatically:
   - Creates announcement
   - Sends notification to all approved residents
   - Logs success in `storage/logs/laravel.log`

**No additional steps required!** The notification system is fully automatic.

---

## 🔧 Technical Details

### API Endpoints Used:

| Endpoint | Purpose | Polling Frequency |
|----------|---------|-------------------|
| `GET /api/notifications/unread` | Get unread notifications for bell badge | Every 30 seconds |
| `POST /api/notifications/{id}/read` | Mark notification as read when clicked | On-demand |
| `POST /api/notifications/mark-all-read` | Mark all as read (button in dropdown) | On-demand |
| `GET /api/announcement` | Fetch announcements for list/dashboard | Every 30 seconds |
| `GET /api/announcement_calendar` | Fetch for calendar view | Every 30 seconds |

### Data Flow:

**Notification Data Structure:**
```json
{
  "id": "9d8f7a6b-5c4d-3e2f-1a0b-9c8d7e6f5g4h",
  "type": "App\\Notifications\\AnnouncementCreatedNotification",
  "notifiable_type": "App\\Models\\User",
  "notifiable_id": 123,
  "data": {
    "type": "announcement",
    "announcement_id": 45,
    "title": "Community Clean-up Drive",
    "message": "New announcement: Community Clean-up Drive",
    "description": "Join us this Saturday...",
    "start_at": "2026-03-08 08:00:00",
    "end_at": "2026-03-08 12:00:00",
    "url": "/resident/announcements",
    "created_at": "2026-03-05 10:00:00"
  },
  "read_at": null,
  "created_at": "2026-03-05T10:00:00.000000Z"
}
```

### Performance Considerations:

**Polling Strategy:**
- 30-second intervals balance real-time feel vs server load
- Only fetches unread notifications (smaller payload)
- Cleans up intervals on component unmount (prevents memory leaks)

**Database Queries:**
```sql
-- Notification bell query (every 30s per online resident)
SELECT * FROM notifications 
WHERE notifiable_id = ? 
  AND notifiable_type = 'App\Models\User' 
  AND read_at IS NULL 
ORDER BY created_at DESC;

-- Announcement query (every 30s per page load)
SELECT * FROM announcements 
ORDER BY id DESC 
LIMIT 10;
```

**Server Load Estimate:**
- 100 online residents × 2 polls/minute = 200 requests/minute = 3.3 requests/second
- Lightweight queries, should handle easily

---

## 🎨 UI Components

### Notification Bell:
```
┌─────────────────────────────────────────┐
│  🔔 [5]  ← Bell icon with badge         │
│   ↓                                     │
│   Dropdown appears:                     │
│  ┌───────────────────────────────────┐  │
│  │ Notifications    [Mark all read] │  │
│  ├───────────────────────────────────┤  │
│  │ 🔵 Community Clean-up Drive       │  │
│  │    New announcement: Community... │  │
│  │    5m ago                         │  │
│  ├───────────────────────────────────┤  │
│  │ 🔵 Barangay Meeting Tomorrow      │  │
│  │    New announcement: Barangay...  │  │
│  │    2h ago                         │  │
│  ├───────────────────────────────────┤  │
│  │     View all announcements  →     │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Notification Badge States:
- **No badge**: No unread notifications
- **"1-9"**: Shows exact number
- **"9+"**: More than 9 unread

### Timestamp Formatting:
- Just now (< 1 minute)
- 5m ago (< 1 hour)
- 2h ago (< 24 hours)
- 3d ago (< 7 days)
- Mar 5, 2026 (older dates)

---

## 🧪 Testing Guide

### Test 1: Create Announcement and Verify Notification

**As Admin:**
1. Login as admin/secretary
2. Go to Announcements → Create New
3. Fill in:
   - Title: "Test Announcement for Real-time Notifications"
   - Description: "This is a test to verify residents receive notifications"
   - Start Date: Today
   - End Date: Tomorrow
4. Click Save
5. Check logs: `tail -f storage/logs/laravel.log`
   - Should see: "Announcement notification sent to X residents"

**As Resident:**
1. Login as resident (in different browser/incognito)
2. Look at top-right corner
3. Within 30 seconds, bell icon should show red badge "1"
4. Click bell icon
5. Should see: "Test Announcement for Real-time Notifications"
6. Click the notification
7. Should:
   - Mark as read (badge disappears)
   - Redirect to announcements page
   - Show the announcement in the list

### Test 2: Multiple Notifications

**As Admin:**
1. Create 3 announcements quickly (within 1 minute)
2. Each with different titles

**As Resident:**
1. Bell badge should show "3" (within 30 seconds)
2. Click bell → see all 3 notifications
3. Click "Mark all as read" button
4. Badge should disappear
5. Dropdown should show "No new notifications"

### Test 3: Auto-refresh on Announcements Page

**Setup:**
1. Resident opens announcements page
2. Admin creates new announcement

**Expected:**
1. Within 30 seconds, new announcement appears in list
2. No page refresh needed
3. Search still works
4. Announcement appears at the top (most recent first)

### Test 4: Dashboard Auto-refresh

**Setup:**
1. Resident on dashboard page
2. Admin creates announcement

**Expected:**
1. "Total Announcements" count increases (within 30 seconds)
2. New announcement appears in "Recent Announcements" section
3. Shows latest 3 announcements

---

## 🛠️ Configuration & Customization

### Change Polling Frequency

**Notification Bell:**
Edit [resources/js/app/_sections/notification-section.jsx](resources/js/app/_sections/notification-section.jsx)

```javascript
// Line 19 - Change 30000 to desired milliseconds
const interval = setInterval(() => {
    loadNotifications();
}, 60000); // Change to 60 seconds (1 minute)
```

**Announcements Page:**
Edit [resources/js/app/pages/resident/announcements/page.jsx](resources/js/app/pages/resident/announcements/page.jsx)

```javascript
// Line 21 - Change polling interval
}, 60000); // 60 seconds instead of 30
```

**Recommended intervals:**
- 10 seconds: Very responsive (higher server load)
- 30 seconds: Balanced (recommended)
- 60 seconds: Lower load (still feels real-time)

### Change Notification Limit

**Show more notifications in dropdown:**
Edit [resources/js/app/services/notification-service.js](resources/js/app/services/notification-service.js)

Currently fetches all unread. To limit to 10 most recent, update backend:

[app/Http/Controllers/NotificationController.php](app/Http/Controllers/NotificationController.php)
```php
// Line 43
$notifications = $user->unreadNotifications()
    ->orderBy('created_at', 'desc')
    ->limit(10) // Add limit
    ->get();
```

### Disable Auto-refresh for Specific Page

**To disable on announcements page:**
Remove the interval setup from the useEffect:

```javascript
useEffect(() => {
    dispatch(get_announcement_thunk());
    dispatch(get_announcement_calendar_thunk());
    // Remove the interval code
}, [dispatch]);
```

---

## 📊 Monitoring

### Check Notification Activity

**Database queries:**
```sql
-- Count total notifications sent today
SELECT COUNT(*) 
FROM notifications 
WHERE DATE(created_at) = CURDATE();

-- Count unread notifications per resident
SELECT notifiable_id, COUNT(*) as unread_count
FROM notifications 
WHERE read_at IS NULL 
  AND notifiable_type = 'App\\Models\\User'
GROUP BY notifiable_id;

-- Recent announcement notifications
SELECT n.*, u.first_name, u.last_name
FROM notifications n
JOIN users u ON n.notifiable_id = u.id
WHERE n.type LIKE '%AnnouncementCreated%'
ORDER BY n.created_at DESC
LIMIT 20;
```

### Log Files

**Check notification sending:**
```bash
# See recent notification activity
tail -f storage/logs/laravel.log | grep "Announcement notification"

# Count notifications sent today
grep "Announcement notification sent" storage/logs/laravel-$(date +%Y-%m-%d).log | wc -l
```

**Expected log entries:**
```
[2026-03-05 10:00:00] local.INFO: Announcement notification sent to 50 residents
```

---

## 🚀 Performance Optimization (Future)

### Option 1: WebSockets (Pusher/Laravel Echo)

For true real-time updates without polling:

**Install Laravel Echo + Pusher:**
```bash
npm install --save-dev laravel-echo pusher-js
composer require pusher/pusher-php-server
```

**Update AnnouncementController:**
```php
use Illuminate\Support\Facades\Broadcast;

// After creating announcement
broadcast(new AnnouncementCreated($announcement))->toOthers();
```

**Frontend listens:**
```javascript
Echo.channel('announcements')
    .listen('AnnouncementCreated', (e) => {
        // Instantly show notification
        loadNotifications();
    });
```

**Benefits:**
- Instant notifications (no 30-second delay)
- Lower server load (no polling)
- More scalable

**Drawbacks:**
- Requires Pusher account or Redis
- More complex setup
- Additional costs

### Option 2: Server-Sent Events (SSE)

Free alternative to WebSockets:

**Create SSE endpoint:**
```php
Route::get('/notifications/stream', [NotificationController::class, 'stream']);

public function stream() {
    return response()->stream(function () {
        while (true) {
            echo "data: " . json_encode(['count' => Auth::user()->unreadNotifications->count()]) . "\n\n";
            ob_flush();
            flush();
            sleep(10);
        }
    }, 200, [
        'Content-Type' => 'text/event-stream',
        'Cache-Control' => 'no-cache',
    ]);
}
```

**Frontend connects:**
```javascript
const eventSource = new EventSource('/notifications/stream');
eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    setUnreadCount(data.count);
};
```

---

## 📝 Troubleshooting

### Notifications Not Appearing

**Check 1: Is polling working?**
```javascript
// Open browser console on resident page
// You should see network requests every 30 seconds to:
// /api/notifications/unread
```

**Check 2: Are notifications being created?**
```sql
SELECT * FROM notifications 
WHERE notifiable_id = [resident_user_id] 
ORDER BY created_at DESC 
LIMIT 5;
```

**Check 3: Is resident account approved?**
```sql
SELECT id, first_name, user_type, status 
FROM users 
WHERE id = [resident_user_id];
-- status should be 'approved'
```

### Badge Not Updating

**Check browser console for errors:**
```javascript
// Should see successful API calls
// If errors appear, check authentication and CSRF token
```

**Force refresh notifications:**
```javascript
// In browser console
axios.get('/api/notifications/unread').then(console.log);
```

### Auto-refresh Not Working

**Verify interval is set up:**
- Check browser console for errors
- Verify Redux thunks are dispatching
- Check network tab for API calls every 30 seconds

**Clear intervals:**
```javascript
// If multiple intervals are running, refresh the page
window.location.reload();
```

---

## 🎯 Summary

### What Residents Get:
✅ Notification bell in header (all pages)  
✅ Red badge showing unread count  
✅ Dropdown with notification list  
✅ Auto-updates every 30 seconds  
✅ Click → mark as read → go to announcement  
✅ Announcements page auto-refreshes  
✅ Dashboard auto-refreshes  
✅ No manual refresh needed!  

### What Admins/Secretaries Do:
✅ Create announcement normally (no changes needed)  
✅ System automatically notifies all residents  
✅ Notifications appear in resident accounts within 30 seconds  

### Technical Implementation:
✅ Backend notification system (database-driven)  
✅ Frontend polling (30-second intervals)  
✅ React components (bell dropdown)  
✅ Auto-refresh on announcements & dashboard  
✅ Proper cleanup (no memory leaks)  
✅ Mobile-responsive design  

---

## 📂 Files Modified/Created

**Frontend:**
- ✅ [resources/js/app/_sections/notification-section.jsx](resources/js/app/_sections/notification-section.jsx) - Notification bell component
- ✅ [resources/js/app/pages/resident/_sections/resident-topbar-section.jsx](resources/js/app/pages/resident/_sections/resident-topbar-section.jsx) - Added bell to header
- ✅ [resources/js/app/pages/resident/announcements/page.jsx](resources/js/app/pages/resident/announcements/page.jsx) - Auto-refresh
- ✅ [resources/js/app/pages/resident/dashboard/page.jsx](resources/js/app/pages/resident/dashboard/page.jsx) - Auto-refresh

**Backend (from previous work):**
- ✅ [app/Notifications/AnnouncementCreatedNotification.php](app/Notifications/AnnouncementCreatedNotification.php)
- ✅ [app/Http/Controllers/NotificationController.php](app/Http/Controllers/NotificationController.php)
- ✅ [app/Http/Controllers/AnnouncementController.php](app/Http/Controllers/AnnouncementController.php)
- ✅ [routes/api.php](routes/api.php)
- ✅ [resources/js/app/services/notification-service.js](resources/js/app/services/notification-service.js)

---

**System Status: ✅ FULLY OPERATIONAL**

Residents now receive real-time notifications when admins/secretaries create announcements!
