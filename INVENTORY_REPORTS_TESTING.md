# Quick Testing Guide - Inventory Reports

## Prerequisites
1. Build completed successfully ✅
2. Backend API endpoint registered ✅
3. Frontend components updated ✅
4. Database migrations run
5. At least one admin user with `inventory.view` permission

## Step-by-Step Testing

### 1. Test Most Borrowed Report

**Setup:**
```bash
# Login as admin
# Navigate to: Inventory > View Inventory Report
# Default tab: "Most Borrowed"
```

**What to verify:**
- [ ] Statistics cards show correct numbers (Total Items, Low Stock, Currently Borrowed, Damaged)
- [ ] Table displays items sorted by borrow frequency
- [ ] Columns: Item Name, Category, Total Borrowed, Currently Borrowed, Available
- [ ] Data loads from API (check Network tab in browser DevTools)
- [ ] Refresh button reloads data

**Expected API Call:**
```
GET /api/inventory-reports?type=most-borrowed
```

---

### 2. Test Low Stock Report

**Setup:**
```bash
# Click "Low Stock" tab
```

**What to verify:**
- [ ] Shows only items where current_quantity < minimum_quantity
- [ ] Alert levels displayed correctly:
  - Critical (red badge): quantity < 50% of minimum
  - Warning (yellow badge): quantity < minimum but >= 50%
- [ ] Shortage calculation is accurate
- [ ] Empty state if no low stock items

**Expected API Call:**
```
GET /api/inventory-reports?type=low-stock
```

---

### 3. Test Overdue Returns Report

**Setup:**
```bash
# First create a borrow request with past return date:
# 1. As resident, borrow an item
# 2. As admin, approve the request
# 3. Set return_date in database to past date manually (for testing):
UPDATE borrow_requests SET return_date = '2024-01-01' WHERE id = X;

# Then click "Overdue Returns" tab
```

**What to verify:**
- [ ] Shows only approved requests past return_date
- [ ] Borrower information displayed (name, email, contact)
- [ ] Days overdue calculated correctly
- [ ] Urgency levels:
  - High (red): > 7 days overdue
  - Medium (orange): 3-7 days overdue
  - Low (yellow): < 3 days overdue

**Expected API Call:**
```
GET /api/inventory-reports?type=overdue
```

---

### 4. Test Damaged Items Report

**Setup:**
```bash
# First create damaged inventory:
# In database:
UPDATE inventories SET damaged = 2 WHERE id = X;

# Then click "Damaged Items" tab
```

**What to verify:**
- [ ] Shows only items with damaged > 0
- [ ] Damage percentage calculated: (damaged / total) * 100
- [ ] Recent incidents displayed if available
- [ ] Empty state if no damaged items

**Expected API Call:**
```
GET /api/inventory-reports?type=damaged
```

---

### 5. Test Borrow History (Most Important!)

**Setup:**
```bash
# Complete borrow-return cycle:
# 1. Resident borrows item
# 2. Admin approves request
# 3. Admin marks as returned (this creates history automatically)

# Then click "Borrow History" tab
```

**What to verify:**
- [ ] **Automatically shows returned items** (no manual entry required!)
- [ ] All details present:
  - Item name
  - Borrower name and email
  - Borrow date
  - Return date (actual_return_date)
  - Duration in days
  - Condition after return (Good/Damaged)
- [ ] Late status:
  - Green badge "On Time" if returned before/on expected_return_date
  - Red badge "Late (Xd)" if returned after expected_return_date
- [ ] Approved by name displayed

**Expected API Call:**
```
GET /api/inventory-reports?type=borrow-history
```

**Manual SQL check:**
```sql
SELECT 
    br.id,
    i.item_name,
    u.first_name,
    br.borrow_date,
    br.actual_return_date,
    br.condition_after_return,
    br.status
FROM borrow_requests br
JOIN inventories i ON br.inventory_id = i.id
JOIN users u ON br.user_id = u.id
WHERE br.status = 'returned';
```

---

## Testing the Automatic History Feature

This is the core functionality - proving history updates automatically.

### Test Procedure:

1. **Before Marking as Returned:**
   ```bash
   # Go to Borrow History tab
   # Count current number of records
   # Note: Let's say you have 5 records
   ```

2. **Mark Item as Returned:**
   ```bash
   # Go to: Inventory > Approved Inventory Requests
   # Find an approved request with status "approved"
   # Click "Mark as Returned" button
   # Select condition: "Good" or "Damaged"
   # Confirm action
   ```

3. **Verify Automatic Update:**
   ```bash
   # Go back to: Inventory > View Inventory Report
   # Click "Borrow History" tab
   # You should now see 6 records (one more than before)
   # The new record should have:
   #   - Status: "returned"
   #   - Return date: Today's date
   #   - Condition: What you selected
   #   - Duration: Calculated automatically
   #   - Late status: Calculated automatically
   ```

4. **Success Criteria:**
   ✅ History record appears immediately **without any manual entry**
   ✅ All fields populated automatically from borrow request
   ✅ Duration calculated correctly
   ✅ Late status determined automatically
   ✅ "Refresh Data" button shows same data

---

## Browser Console Tests

Open browser DevTools (F12) and check:

### Network Tab:
```
✅ API calls to /api/inventory-reports?type=...
✅ Status 200 OK
✅ Response contains data array
✅ No 401 Unauthorized or 403 Forbidden errors
```

### Console Tab:
```
✅ No JavaScript errors
✅ No React warnings
✅ No missing dependency warnings
```

---

## Common Issues and Fixes

### Issue: "No data available for this report"
**Fix:** 
- Check if database has records
- Verify API returns data: Use Postman or browser to test directly
- Check Laravel logs: `tail -f storage/logs/laravel.log`

### Issue: "Failed to load report data"
**Fix:**
- Verify route exists: `php artisan route:list | grep inventory-reports`
- Check authentication: Make sure logged in
- Check permission: User needs `inventory.view`

### Issue: Borrow history doesn't show after marking as returned
**Fix:**
- Check `markAsReturned()` sets `status = 'returned'`
- Verify `actual_return_date` is set
- SQL check: `SELECT * FROM borrow_requests WHERE status = 'returned'`
- Check controller: `getBorrowHistory()` filters by `status = 'returned'`

### Issue: Frontend not updating
**Fix:**
- Clear browser cache (Ctrl+Shift+R)
- Rebuild frontend: `npm run build`
- Check if built files exist: `public/build/manifest.json`

---

## API Testing with Postman/Curl

### Test Most Borrowed:
```bash
curl -X GET "http://localhost:8000/api/inventory-reports?type=most-borrowed" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Borrow History:
```bash
curl -X GET "http://localhost:8000/api/inventory-reports?type=borrow-history" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response Format:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "item_name": "Sample Item",
      // ... other fields
    }
  ]
}
```

---

## Performance Testing

Test with larger datasets:

```sql
-- Create 100 borrow requests for testing
INSERT INTO borrow_requests (inventory_id, user_id, borrow_date, return_date, status, created_at, updated_at)
SELECT 
    (id % 10) + 1, -- inventory_id
    (id % 5) + 1,  -- user_id
    DATE_SUB(NOW(), INTERVAL id DAY),
    DATE_ADD(DATE_SUB(NOW(), INTERVAL id DAY), INTERVAL 7 DAY),
    'approved',
    NOW(),
    NOW()
FROM 
    (SELECT @row := @row + 1 as id FROM (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2) t1, (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2) t2, (SELECT @row:=0) t3) numbers
LIMIT 100;
```

**Verify:**
- [ ] Reports load in < 2 seconds
- [ ] No N+1 query issues (check Laravel debug bar)
- [ ] Memory usage acceptable

---

## Final Checklist

Before going live, verify:

- [ ] All 5 report types working
- [ ] Automatic history tracking confirmed
- [ ] Permission checks working
- [ ] Loading states appear
- [ ] Error handling works
- [ ] Data refreshes correctly
- [ ] Statistics cards accurate
- [ ] No console errors
- [ ] Mobile responsive (check on phone)
- [ ] API returns proper JSON format

---

## Success Indicators

✅ **Backend:** All API endpoints return 200 OK with proper data
✅ **Frontend:** All tabs load data without errors
✅ **Automatic History:** Items appear in history immediately after marking as returned
✅ **Calculations:** All derived fields (days overdue, damage %, etc.) are accurate
✅ **UX:** Loading states, error messages, and empty states work properly

---

**Ready for Production!** 🚀

Once all tests pass, the system is ready for live deployment.

For production deployment, see: `DEPLOYMENT_QUICK_REF.md`
