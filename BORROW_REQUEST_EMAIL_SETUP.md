# Borrow Request Email Notifications Setup

## Overview
Email notifications are now integrated into the borrow request system. When an admin approves or declines a borrow request, the resident who made the request will automatically receive an email notification.

## Features Implemented

### 1. Email Notifications
- ✅ **Approval Email**: Sent when admin approves a borrow request
  - Includes request details (item, quantity, dates)
  - Shows pickup location
  - Provides link to view request details
  
- ✅ **Decline Email**: Sent when admin declines a borrow request
  - Includes reason for decline (admin remarks)
  - Provides link to submit a new request

### 2. Database Notifications
- Notifications are also stored in the database for in-app viewing
- Can be extended to show notification bell/center in the resident portal

## Email Configuration

### For Development/Testing (Using Mailtrap or Gmail)

1. **Update your `.env` file** with your email configuration:

```env
# For Mailtrap (Recommended for testing)
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@barangay.local
MAIL_FROM_NAME="${APP_NAME}"

# OR for Gmail (Use App Password, not regular password)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your.email@gmail.com
MAIL_PASSWORD=your_16_character_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your.email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"
```

### For Production (Using Gmail)

1. **Enable 2-Step Verification** in your Gmail account
2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password
3. **Update `.env`** with the app password (no spaces)

## Testing the Email Notifications

### Step 1: Configure Email
1. Choose your email provider (Mailtrap for testing, Gmail for production)
2. Update `.env` file with correct credentials
3. Run: `php artisan config:clear`

### Step 2: Test Approval Email
1. Login as a resident
2. Go to "Inventory Borrow Request" page
3. Submit a borrow request for any available item
4. Login as admin
5. Navigate to "Approved Inventory Request" page
6. Click "View Details" on the pending request
7. Click "APPROVE" button
8. Check the resident's email inbox

### Step 3: Test Decline Email
1. Login as a resident
2. Submit another borrow request
3. Login as admin
4. Go to pending request
5. Click "DECLINE" button
6. Enter a reason in the remarks field
7. Submit decline
8. Check the resident's email inbox

## Email Content

### Approval Email Includes:
- Greeting with resident's name
- Request number
- Item details (name, quantity)
- Borrow and return dates
- **Pickup location** (from inventory location field)
- Admin remarks (if any)
- Link to view request details
- Reminder to return on time

### Decline Email Includes:
- Greeting with resident's name
- Request number
- Item details
- **Reason for decline** (admin remarks)
- Link to submit new request
- Contact information suggestion

## Important Notes

1. **User Email Required**: Make sure users have valid email addresses in their profiles
2. **Mail Configuration**: Emails will only be sent if `MAIL_MAILER` is NOT set to `log`
3. **Error Handling**: If email sending fails, the system will log the error but won't fail the approval/decline operation
4. **Queue**: For better performance in production, consider using Laravel queues for email sending

## Troubleshooting

### Emails Not Sending?
1. Check `.env` configuration
2. Clear config cache: `php artisan config:clear`
3. Check Laravel logs: `storage/logs/laravel.log`
4. Verify user has email address in database
5. Test email configuration: `php artisan tinker` then:
   ```php
   Mail::raw('Test email', function($msg) {
       $msg->to('test@example.com')->subject('Test');
   });
   ```

### Gmail "Less Secure Apps" Error?
- Gmail no longer supports "less secure apps"
- You MUST use an App Password (16 characters, no spaces)
- Enable 2-Step Verification first

### Mailtrap Not Receiving?
- Check if you're using the correct inbox credentials
- Mailtrap has a free tier limit of 500 emails/month
- Check Mailtrap inbox at: https://mailtrap.io/inboxes

## Files Created/Modified

### New Files:
- `app/Notifications/BorrowRequestApprovedNotification.php`
- `app/Notifications/BorrowRequestDeclinedNotification.php`

### Modified Files:
- `app/Http/Controllers/InventoriesController.php`
  - Added notification sending in `approveBorrowRequest()` method
  - Added notification sending in `declineBorrowRequest()` method

## Future Enhancements

Consider adding:
- [ ] Email notification when item is marked as returned
- [ ] Email reminder before return date
- [ ] SMS notifications (using services like Semaphore)
- [ ] In-app notification center with bell icon
- [ ] Email notification preferences for users
