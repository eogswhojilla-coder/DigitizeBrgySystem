# Inventory Reports System - Implementation Guide

## Overview
The inventory reports system provides comprehensive reporting and tracking of inventory items with 5 report types:
1. **Most Borrowed Items** - Items with highest borrow frequency
2. **Low Stock Items** - Items below minimum quantity threshold
3. **Overdue Returns** - Items past their return date 
4. **Damaged Items** - Items with damage records
5. **Borrow History** - Complete audit trail of returned items

## Automatic History Tracking
When an admin marks an item as returned, the system **automatically** tracks:
- Item name
- Borrower information (name, email, contact)
- Borrow date and return date
- Duration (in days)
- Condition after return (Good/Damaged)
- Late status (was_late, days_late)
- Who approved the return

**No manual entry required** - the markAsReturned() method updates the status to 'returned' and the getBorrowHistory() query includes it automatically.

## Backend API Implementation

### API Endpoint
```
GET /api/inventory-reports?type={report-type}
```

**Parameters:**
- `type` (required): Report type - `most-borrowed`, `low-stock`, `overdue`, `damaged`, `borrow-history`

**Authorization:** Requires `inventory.view` permission

### Report Types and Data Structure

#### 1. Most Borrowed Items
**Endpoint:** `/api/inventory-reports?type=most-borrowed`

**Returns:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "item_name": "Laptop",
      "category": "Electronics",
      "total_borrowed": 25,
      "currently_borrowed": 3,
      "available_quantity": 7,
      "location": "Storage A",
      "recent_requests": [
        {
          "id": 101,
          "borrower_name": "Juan Dela Cruz",
          "borrow_date": "2024-01-15",
          "status": "returned"
        }
      ]
    }
  ]
}
```

**Calculated Fields:**
- `total_borrowed`: Total times item was borrowed (using withCount)
- `currently_borrowed`: Items currently out on loan
- `available_quantity`: quantity - currently_borrowed

#### 2. Low Stock Items
**Endpoint:** `/api/inventory-reports?type=low-stock`

**Returns:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 2,
      "item_name": "Projector",
      "category": "Electronics",
      "current_quantity": 2,
      "minimum_quantity": 5,
      "shortage": 3,
      "available_quantity": 1,
      "alert_level": "critical"
    }
  ]
}
```

**Alert Levels:**
- `critical`: Current quantity < 50% of minimum quantity
- `warning`: Current quantity < minimum quantity but >= 50%

#### 3. Overdue Returns
**Endpoint:** `/api/inventory-reports?type=overdue`

**Returns:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 3,
      "item_name": "Camera",
      "borrower_name": "Maria Santos",
      "borrower_email": "maria@example.com",
      "borrower_contact": "09123456789",
      "borrow_date": "2024-01-01",
      "expected_return_date": "2024-01-10",
      "days_overdue": 5,
      "urgency": "high"
    }
  ]
}
```

**Urgency Levels:**
- `high`: More than 7 days overdue
- `medium`: 3-7 days overdue
- `low`: Less than 3 days overdue

#### 4. Damaged Items
**Endpoint:** `/api/inventory-reports?type=damaged`

**Returns:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 4,
      "item_name": "Chair",
      "category": "Furniture",
      "damaged_count": 2,
      "total_quantity": 10,
      "damage_percentage": 20.0,
      "location": "Storage B",
      "recent_incidents": [
        {
          "incident_date": "2024-01-12",
          "borrower_name": "Pedro Reyes",
          "condition_on_return": "Damaged",
          "remarks": "Broken leg"
        }
      ]
    }
  ]
}
```

**Calculated Fields:**
- `damage_percentage`: (damaged_count / total_quantity) * 100

#### 5. Borrow History
**Endpoint:** `/api/inventory-reports?type=borrow-history`

**Returns:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 5,
      "item_name": "Microphone",
      "borrower_name": "Ana Lopez",
      "borrower_email": "ana@example.com",
      "borrow_date": "2024-01-05",
      "expected_return_date": "2024-01-08",
      "return_date": "2024-01-09",
      "duration_days": 4,
      "was_late": true,
      "days_late": 1,
      "condition_after_return": "Good",
      "approved_by_name": "Admin User"
    }
  ]
}
```

**Calculated Fields:**
- `duration_days`: Days between borrow_date and return_date
- `was_late`: Boolean - returned after expected_return_date
- `days_late`: Days past expected_return_date (0 if on time)

## Frontend Implementation

### Components Structure
```
resources/js/app/pages/administrator/inventory/view_inventory_report/
├── sections/
│   ├── inventory-tabs-section.jsx       # Main container with API calls
│   ├── inventory-table-section.jsx      # Displays report tables
│   ├── inventory-cards-section.jsx      # Statistics cards
│   ├── inventory-excel-section.jsx      # Excel export (pending)
│   └── inventory-pdf-section.jsx        # PDF export (pending)
```

### Key Features

#### 1. Auto-Refresh on Tab Change
When you click a report tab, it automatically fetches fresh data from the API.

#### 2. Loading States
Shows loading spinner while fetching data to provide user feedback.

#### 3. Error Handling
Displays error messages if API requests fail.

#### 4. Real-time Data
All reports show live data from the database - no mock data or calculations on frontend.

## Usage Flow

### For Administrators

1. **Navigate to Inventory Reports:**
   - Go to Inventory section
   - Click "View Inventory Report"

2. **Select Report Type:**
   - Click one of the 5 report tabs
   - Data automatically loads

3. **View Reports:**
   - See detailed tables with all relevant information
   - Statistics cards show quick overview (for Most Borrowed report)

4. **Track Returns:**
   - Mark items as returned in the Borrow Requests section
   - Item automatically appears in Borrow History with complete details
   - No additional steps needed!

### For Testing

1. **Create Borrow Requests:**
   ```bash
   # As resident or admin, create borrow requests
   ```

2. **Approve Requests:**
   ```bash
   # Admin approves requests
   # Items now show in "Most Borrowed" and appear in borrower's list
   ```

3. **Mark as Returned:**
   ```bash
   # Admin marks items as returned
   # Automatically recorded in Borrow History
   ```

4. **View History:**
   ```bash
   # Navigate to Borrow History tab
   # See complete audit trail with:
   # - Who borrowed
   # - When borrowed/returned
   # - Condition after return
   # - Late status
   ```

## Database Relationships

### Models Involved:
- **Inventories**: Items available for borrowing
- **BorrowRequest**: Borrow transactions
- **User**: Residents who borrow items
- **Administrator**: Admins who approve/return items

### Key Relationships:
```php
// Inventories Model
public function borrowRequests() {
    return $this->hasMany(BorrowRequest::class, 'inventory_id');
}

// BorrowRequest Model
public function user() {
    return $this->belongsTo(User::class);
}

public function inventory() {
    return $this->belongsTo(Inventories::class, 'inventory_id');
}

public function approvedBy() {
    return $this->belongsTo(User::class, 'approved_by');
}

public function rejectedBy() {
    return $this->belongsTo(User::class, 'rejected_by');
}
```

## Controller Methods

### InventoriesController.php

All report methods are located in `app/Http/Controllers/InventoriesController.php`:

- `getInventoryReports()` - Routes to appropriate report type
- `getMostBorrowedItems()` - Query and format most borrowed data
- `getLowStockItems()` - Find items below minimum quantity
- `getOverdueReturns()` - Filter overdue borrow requests
- `getDamagedItems()` - Show items with damage records
- `getBorrowHistory()` - Complete audit trail of returns
- `markAsReturned()` - Updates status and creates history record

## Permission Requirements

Users must have `inventory.view` permission to access reports.

Assign permissions via:
```php
// In database seeder or admin panel
$user->givePermissionTo('inventory.view');
```

## Future Enhancements (Pending)

1. **Excel Export:**
   - Download reports as Excel spreadsheets
   - Located in `inventory-excel-section.jsx`

2. **PDF Export:**
   - Generate PDF reports for printing
   - Located in `inventory-pdf-section.jsx`

3. **Date Range Filters:**
   - Filter reports by custom date ranges
   - Add to `inventory-tabs-section.jsx`

4. **Email Notifications:**
   - Auto-email borrowers when items are overdue
   - Send low stock alerts to admins

## Troubleshooting

### Problem: Report shows "No data available"
**Solutions:**
1. Check if inventory items exist in database
2. Verify borrow requests have been created
3. Ensure user has `inventory.view` permission
4. Check browser console for API errors

### Problem: Borrow history is empty after marking as returned
**Solutions:**
1. Verify `markAsReturned()` sets status to 'returned'
2. Check `actual_return_date` is being set
3. Confirm query filters for `status = 'returned'`
4. Check database directly: `SELECT * FROM borrow_requests WHERE status = 'returned'`

### Problem: "Failed to load report data"
**Solutions:**
1. Check API route is registered: `php artisan route:list | grep inventory-reports`
2. Verify middleware allows access
3. Check Laravel logs: `storage/logs/laravel.log`
4. Test API directly: `GET /api/inventory-reports?type=most-borrowed`

## Testing Checklist

- [ ] Most Borrowed report shows items with highest borrow counts
- [ ] Low Stock report displays items below minimum quantity
- [ ] Overdue report shows items past return date with urgency levels
- [ ] Damaged report lists items with damage records
- [ ] Borrow History automatically updates when items are returned
- [ ] Loading spinner appears during API calls
- [ ] Error messages display when API fails
- [ ] Tab switching triggers data refresh
- [ ] Statistics cards show correct counts
- [ ] All fields display proper formatting (dates, percentages, etc.)

## Security Notes

- All routes protected by Sanctum authentication
- Permission-based authorization (inventory.view)
- Input validation on all API endpoints
- SQL injection prevention via Eloquent ORM
- XSS protection on rendered data

## Performance Optimization

- Uses Eloquent eager loading (with()) to prevent N+1 queries
- WithCount for efficient aggregate queries
- Indexed foreign keys for faster joins
- Limit on recent_requests to 5 items
- Pagination recommended if report data exceeds 100 items

---

**Implementation Date:** January 2024
**Last Updated:** January 2024
**Status:** ✅ Complete and Functional
