# GCash Payment Integration - Setup Instructions

## Overview
This implementation adds GCash QR payment support for certificate requests that require a fee. The system handles payment receipt uploads, verification, and business rule enforcement.

---

## Database Setup

### 1. Run Migrations
Execute the following migrations in order:

```bash
php artisan migrate
```

This will add the following columns to `certificate_requests`:
- `receipt_path` (string, nullable)
- `payment_status` (enum: UNPAID, FOR_VERIFICATION, VERIFIED, PAYMENT_REJECTED)
- `payment_verified_by` (foreign key to users)
- `payment_verified_at` (timestamp)
- `payment_method` (string, default: 'GCash')

And add `has_fee` (boolean) to `certificate_types`.

### 2. Configure Storage Link
Ensure the storage link is created for public file access:

```bash
php artisan storage:link
```

This creates a symbolic link from `public/storage` to `storage/app/public`.

---

## GCash QR Code Setup

### Upload Your GCash QR Code
1. Generate or obtain your GCash merchant QR code
2. Save it as `gcash-qr.png` (or `.jpg`)
3. Place it in: `public/images/gcash-qr.png`

**Path:** `public/images/gcash-qr.png`

If you don't have a QR code yet, the system will show a placeholder. The payment flow will still work with receipt uploads.

---

## Update Certificate Types

### Add Fee Information
For each certificate type that requires payment, update in the database or admin panel:

```sql
UPDATE certificate_types 
SET has_fee = 1, 
    fee = 50.00 
WHERE name = 'Barangay Clearance';
```

Example fees:
- Barangay Clearance: ₱50.00
- Certificate of Residency: ₱30.00
- Barangay Indigency: ₱0.00 (Free - set has_fee = 0)

---

## File Storage Structure

The system stores files in the following structure:

```
storage/app/public/
├── receipts/              # Payment receipts
│   └── [receipt-files]
├── certificate_ids/       # Valid IDs from residents
│   └── [id-files]
└── valid_ids/             # Valid IDs (alternative storage)
    └── [id-files]
```

**File Validation:**
- Allowed formats: JPG, JPEG, PNG, PDF
- Maximum size: 5MB
- Files are automatically validated during upload

---

## Workflow Summary

### Resident Side
1. Select certificate type
2. If `has_fee = true`:
   - GCash QR code appears
   - Payment instructions displayed
   - Receipt upload required (mandatory)
3. If `has_fee = false`:
   - No payment section shown
   - Direct submission allowed
4. Request submitted with status: `PENDING_VERIFICATION`

### Admin Side
1. View all certificate requests in admin panel
2. Click **View Details** to see:
   - Resident information
   - Certificate type and fee
   - Payment status
   - Uploaded receipt (image preview)
   - Valid ID
3. **Verify Payment** (if receipt uploaded):
   - Marks `payment_status = VERIFIED`
   - Records verifier and timestamp
4. **Approve Certificate Request**:
   - Only allowed if:
     - Request is VERIFIED
     - Payment is VERIFIED (for paid certificates)
     - OR certificate is free (has_fee = false)
5. **Reject Payment** (optional):
   - Marks `payment_status = PAYMENT_REJECTED`
   - Prevents request approval until resolved

---

## Business Rules Implemented

### ✅ Payment Verification Required
- Certificates with `has_fee = true` AND `fee > 0` cannot be approved until payment is verified
- Approval button is disabled in UI if payment not verified
- Backend validation prevents approval via API

### ✅ Status Flow
```
PENDING_VERIFICATION → VERIFIED → APPROVED → FOR_RELEASE → RELEASED
                            ↓
                        REJECTED
```

### ✅ Payment Status Flow
```
UNPAID → FOR_VERIFICATION → VERIFIED
                ↓
          PAYMENT_REJECTED
```

### ✅ Validation Rules
- Valid ID: Required, max 5MB, formats: JPG, PNG, PDF
- Payment Receipt: Required if has_fee = true, max 5MB, formats: JPG, PNG, PDF
- Purpose: Required, max 500 characters

---

## Testing Checklist

### Resident Portal
- [ ] Certificate types load correctly
- [ ] GCash QR displays for paid certificates
- [ ] Payment section hidden for free certificates
- [ ] Receipt upload validates file size and type
- [ ] Valid ID upload works
- [ ] Form submission succeeds with receipt
- [ ] Form shows error if receipt missing for paid cert
- [ ] Request appears in "My Requests" tab

### Admin Portal
- [ ] All requests display in table
- [ ] Payment status badges show correctly
- [ ] Fee amount displays properly
- [ ] Click "View Details" opens modal
- [ ] Receipt image displays in modal
- [ ] Valid ID displays in modal
- [ ] "Verify Payment" button works
- [ ] "Reject Payment" button works with remarks
- [ ] "Approve Request" disabled if payment not verified
- [ ] "Approve Request" works after payment verified
- [ ] Request status updates after actions

---

## API Endpoints

### Resident Endpoints
```
POST   /api/certificate-requests              Create request
GET    /api/my-certificate-requests           List my requests
GET    /api/certificate-types                 List certificate types
```

### Admin Endpoints
```
GET    /api/admin/certificate-requests        List all requests
GET    /api/admin/certificate-requests/{id}   View request details
PATCH  /api/admin/certificate-requests/{id}/verify            Verify request
PATCH  /api/admin/certificate-requests/{id}/approve           Approve request
PATCH  /api/admin/certificate-requests/{id}/reject            Reject request
PATCH  /api/admin/certificate-requests/{id}/verify-payment    Verify payment
PATCH  /api/admin/certificate-requests/{id}/reject-payment    Reject payment
```

---

## Common Issues & Solutions

### Files Not Displaying
**Issue:** Uploaded files return 404
**Solution:** Run `php artisan storage:link`

### QR Code Not Showing
**Issue:** Placeholder text appears instead of QR
**Solution:** Upload QR image to `public/images/gcash-qr.png`

### Approval Button Always Disabled
**Issue:** Cannot approve even after payment verified
**Solution:** Check `certificate_types` table - ensure `has_fee` is set correctly

### Payment Receipt Not Required
**Issue:** Can submit without receipt
**Solution:** Verify `has_fee` is true and `fee > 0` in certificate_types

---

## Security Notes

- All routes are protected with `auth:sanctum` middleware
- File uploads validated on server-side
- Payment verification requires admin authentication
- Files stored outside web root (storage/app/public)
- Database enums prevent invalid status values

---

## Future Enhancements (Optional)

- Email notifications for payment verification
- SMS notifications via Semaphore/Twilio
- Automatic payment matching via GCash API
- Receipt OCR for automatic amount detection
- Payment refund workflow
- Multiple payment method support (Maya, PayMongo, etc.)
- Payment receipt PDF download
- Audit log for all payment actions

---

## Support

For issues or questions:
1. Check error logs: `storage/logs/laravel.log`
2. Verify migrations ran successfully: `php artisan migrate:status`
3. Test file permissions: `storage/` should be writable
4. Check `.env` for correct database credentials

---

**Implementation Date:** February 25, 2026
**Version:** 1.0.0
**Status:** ✅ Ready for Testing
