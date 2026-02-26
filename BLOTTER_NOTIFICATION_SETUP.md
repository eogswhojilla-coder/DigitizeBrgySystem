# Blotter Notification System Configuration Guide

This guide explains how to configure email and SMS notifications for residents who are reported in blotter cases.

## Overview

When a resident is named as a respondent in a blotter case, they will receive notifications through:
1. **In-App Database Notification** (Always active)
2. **Email Notification** (When configured)
3. **SMS Notification** (When configured)

## Prerequisites

- Resident must be registered in the system with email address and/or phone number
- For registered users with accounts, notifications appear in their dashboard
- For residents without accounts, SMS and email notifications still work

## Email Notification Setup

### Option 1: Using Gmail (Development/Testing)

1. Update your `.env` file:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_gmail@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your_gmail@gmail.com
MAIL_FROM_NAME="${APP_NAME}"
```

2. Generate Gmail App Password:
   - Go to Google Account Settings → Security
   - Enable 2-Step Verification
   - Generate App Password for "Mail"
   - Use this password in `MAIL_PASSWORD`

### Option 2: Using Mailtrap (Development/Testing)

1. Create free account at [mailtrap.io](https://mailtrap.io)
2. Update your `.env` file:
```env
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@barangay.local
MAIL_FROM_NAME="${APP_NAME}"
```

### Option 3: Using Other SMTP Services

For production, use services like:
- **SendGrid**: Professional email delivery
- **Mailgun**: Reliable email service
- **Amazon SES**: AWS email service

## SMS Notification Setup

### Using Semaphore (Philippine SMS Gateway)

1. Create account at [semaphore.co](https://semaphore.co/)
2. Purchase SMS credits
3. Get your API key from the dashboard
4. Update your `.env` file:
```env
SMS_API_KEY=your_actual_api_key_here
SMS_SENDER_ID=BARANGAY
```

### SMS Features

- Automatically formats Philippine phone numbers (09XXXXXXXXX)
- Converts to international format (+639XXXXXXXXX)
- Validates phone numbers before sending
- Logs all SMS attempts for debugging
- Fails gracefully if API key is not configured

### SMS Message Format

When a resident is reported:
```
[BARANGAY NAME] ALERT:

You have been named in a blotter case.
Case #: BLT-000001
Incident: [Incident Type]
Status: pending

Please contact the barangay office for more information.
```

When status is updated:
```
[BARANGAY NAME] UPDATE:

Your blotter case BLT-000001 status has been updated to: Resolved.

Please contact the barangay office for more information.
```

## Barangay Information Configuration

Update these in your `.env` file:
```env
BARANGAY_NAME="San Antonio"
MUNICIPALITY_NAME="San Pedro"
PROVINCE_NAME="Laguna"
```

These values appear in:
- Email notifications
- SMS notifications
- System headers

## Testing Notifications

### 1. Test Email Notifications

```bash
# Laravel tinker
php artisan tinker

# Send test email
$user = App\Models\User::first();
$user->notify(new App\Notifications\BlotterNotification(App\Models\Blotter::first()));
```

### 2. Test SMS Notifications

```bash
php artisan tinker

# Send test SMS
$sms = app(App\Services\SmsService::class);
$sms->send('09171234567', 'Test message from Barangay System');
```

### 3. Create Test Blotter

1. Go to admin panel
2. Create a new blotter
3. Select a resident as respondent (must have email/phone)
4. Submit the blotter
5. Check if notifications were sent (check logs)

## Checking Notification Logs

View Laravel logs to see notification status:
```bash
tail -f storage/logs/laravel.log
```

Look for:
```
[INFO] Blotter notification sent to user ID: XXX for blotter ID: XXX
[INFO] SMS sent successfully to +639XXXXXXXXX
```

## Notification Flow

### For Registered Users (with accounts):
1. ✅ Database notification (appears in their dashboard)
2. ✅ Email notification (if email configured)
3. ✅ SMS notification (if SMS configured)

### For Registered Residents (no accounts):
1. ✅ SMS notification (if phone number on file)
2. ✅ Email notification (if implemented direct email sending)

## Troubleshooting

### Email Not Sending

1. Check `.env` has correct SMTP credentials
2. Verify `MAIL_MAILER` is not set to `log`
3. Check Laravel logs: `storage/logs/laravel.log`
4. Test SMTP connection manually
5. Ensure firewall allows SMTP ports (587, 465)

### SMS Not Sending

1. Verify API key is correct in `.env`
2. Check SMS credits balance in Semaphore account
3. Ensure phone number format is correct (09XXXXXXXXX)
4. Check Laravel logs for SMS errors
5. Verify internet connection

### Notifications Not Appearing in Dashboard

1. Run migration: `php artisan migrate`
2. Check `notifications` table exists
3. Verify user account is linked to resident
4. Check browser console for JS errors

## Cost Considerations

### Email
- **Mailtrap**: Free for development (500 emails/month)
- **Gmail**: Free but has daily limits (500/day)
- **SendGrid**: Free tier (100 emails/day)
- **Mailgun**: Pay as you go (~$0.80/1000 emails)

### SMS
- **Semaphore**: 
  - P0.65 - P1.00 per SMS (depending on volume)
  - Minimum load: P100
  - Typical usage: 100-200 SMS/month for small barangay

## Production Recommendations

1. **Use Professional SMTP Service**
   - SendGrid or Mailgun for reliability
   - Monitor delivery rates

2. **SMS Best Practices**
   - Send SMS only for critical notifications
   - Use email for detailed information
   - Monitor SMS costs monthly

3. **Queue Notifications**
   - Enable queue workers for better performance
   - Update `.env`: `QUEUE_CONNECTION=database`
   - Run: `php artisan queue:work`

4. **Backup Notification Methods**
   - Always have database notifications as fallback
   - Log all notification attempts
   - Implement retry logic for failed SMS/emails

## Privacy and Compliance

- Store resident phone numbers and emails securely
- Get consent before sending SMS notifications
- Comply with Data Privacy Act of 2012 (Philippines)
- Allow residents to opt-out of notifications
- Keep audit logs of all notifications sent

## Support

For issues:
1. Check logs: `storage/logs/laravel.log`
2. Review Semaphore dashboard for SMS status
3. Test email with Mailtrap first
4. Contact Semaphore support for SMS issues
