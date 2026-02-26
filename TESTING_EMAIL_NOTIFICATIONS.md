# Testing Your Blotter Email Notification System - Step by Step

## ✅ Your System Already Has Everything!

Good news! Your blotter notification system already implements **everything** from the guide and more:

1. ✅ Email configuration in `.env`
2. ✅ `BlotterNotification` class (like `ReportFiledNotification` in guide)
3. ✅ `BlotterController` with auto-notification
4. ✅ User model with `Notifiable` trait
5. ✅ API routes configured
6. ✅ **BONUS:** SMS notifications + database notifications

---

## 🧪 **Test Methods**

### **Method 1: Using Laravel Tinker (Quick Test)**

This is the fastest way to test if emails work:

```bash
# Open Laravel Tinker
php artisan tinker

# Load the test script
include 'test_blotter_email.php';
```

The script will:
- ✅ Check your email configuration
- ✅ Find a user with an email
- ✅ Create/use a test blotter
- ✅ Send a test email notification
- ✅ Tell you where to check for the email

---

### **Method 2: Using Postman/Insomnia (Real Scenario Test)**

This tests the complete flow like the guide describes:

#### **Step 1: Get Authentication Token**

First, log in to get your Bearer token:

**Request:**
```
POST http://localhost:8000/api/login
Content-Type: application/json

{
    "username": "your_admin_username",
    "password": "your_password"
}
```

**Response:**
```json
{
    "token": "1|abc123xyz...",
    "user": {...}
}
```

Copy the token!

#### **Step 2: Create a Blotter (This Triggers Email)**

**Request:**
```
POST http://localhost:8000/api/blotters
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
    "complainant_resident": "Juan Dela Cruz",
    "respondent": "Pedro Santos",
    "respondent_id": 1,
    "incident": "Noise Complaint",
    "date_of_incident": "2026-02-26",
    "location_of_incident": "Purok 3, Barangay II",
    "complainant_statement": "Loud music past midnight disturbing the neighborhood.",
    "status": "pending",
    "date_reported": "2026-02-26"
}
```

**Success Response:**
```json
{
    "message": "Barangay information created successfully"
}
```

**What Happens Behind the Scenes:**
1. ✅ Blotter saved to database
2. ✅ System finds resident with ID = 1
3. ✅ Looks up their user account
4. ✅ Checks if they have email
5. ✅ **Sends email notification automatically**
6. ✅ **Sends SMS if configured**
7. ✅ **Saves in-app notification**

#### **Step 3: Check the Email**

The resident (with `respondent_id: 1`) will receive:

**Email Subject:**
```
Blotter Case Notification - BLT-000001
```

**Email Content:**
```
Hello [Resident Name]!

You have been named as a respondent in a blotter case.

Case Number: BLT-000001
Incident Type: Noise Complaint
Date of Incident: February 26, 2026
Location: Purok 3, Barangay II
Status: Pending

Please cooperate with the barangay officials regarding this case. 
You may contact the barangay office for more information.

[View Blotter Notification Button]

Regards,
Barangay II Office
```

---

### **Method 3: Test Email Only (Using Log Driver)**

To test without actually sending emails:

#### **Step 1: Update .env**

```env
MAIL_MAILER=log
```

#### **Step 2: Clear Config**

```bash
php artisan config:clear
```

#### **Step 3: Create a Blotter**

Use Postman method above or create through your admin panel.

#### **Step 4: Check Logs**

Open `storage/logs/laravel.log` and search for:

```
To: resident@email.com
Subject: Blotter Case Notification - BLT-000001
```

You'll see the complete email that would have been sent!

---

### **Method 4: Using Mailtrap (Recommended for Testing)**

#### **Step 1: Sign Up**

1. Go to [mailtrap.io](https://mailtrap.io)
2. Create free account
3. Go to "Email Testing" → "Inboxes"
4. Copy SMTP credentials

#### **Step 2: Update .env**

```env
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@barangay.local
```

#### **Step 3: Clear Config & Test**

```bash
php artisan config:clear
```

Then create a blotter using Postman method.

#### **Step 4: View in Mailtrap**

1. Open Mailtrap dashboard
2. Go to your inbox
3. **See the email exactly as residents would!**
4. Check HTML, text, spam score, etc.

---

## 🔍 **Finding a Resident to Test With**

### **Method 1: Check Database**

```sql
-- Find residents with email addresses
SELECT br.id, br.firstName, br.lastName, br.emailAddress, br.contactNumber,
       u.id as user_id, u.email as user_email
FROM barangay_residents br
LEFT JOIN users u ON u.barangay_resident_id = br.id
WHERE br.emailAddress IS NOT NULL OR u.email IS NOT NULL;
```

### **Method 2: Use Tinker**

```bash
php artisan tinker

# Find all users with emails
User::whereNotNull('email')->get(['id', 'first_name', 'email', 'barangay_resident_id']);

# Find all residents with emails
App\Models\BarangayResident::whereNotNull('emailAddress')->first();
```

### **Method 3: Create Test Account**

If no residents have emails, create one with **your own email** for testing:

```bash
php artisan tinker

$user = new App\Models\User();
$user->first_name = "Test";
$user->last_name = "Resident";
$user->email = "your.email@gmail.com";  # YOUR EMAIL HERE
$user->username = "test.resident";
$user->password = Hash::make("password123");
$user->user_type = "resident";
$user->status = "approved";
$user->save();

echo "Created user with ID: " . $user->id;
```

Now use this user's ID as `respondent_id` when creating a test blotter!

---

## 🎯 **Complete Testing Flow (Following the Guide)**

### **1. Verify Email Config**

```bash
php artisan tinker

# Check configuration
echo config('mail.mailer');
echo config('mail.host');
echo config('mail.username');
```

### **2. Prepare Test Data**

- ✅ Have a user with email address
- ✅ Know their barangay_resident_id

### **3. Create Blotter via API**

Use Postman with the JSON from Method 2 above.

### **4. Verify Notification Sent**

**Check Logs:**
```bash
tail -f storage/logs/laravel.log
```

Look for:
```
[INFO] Blotter notification sent to user ID: X for blotter ID: Y
```

**Check Email:**
- Mailtrap inbox (if using Mailtrap)
- Your Gmail inbox (if using Gmail)
- `storage/logs/laravel.log` (if using log driver)

### **5. Verify In-App Notification**

Log in as the resident and go to **Blotter Notifications** page.

---

## 🐛 **Troubleshooting Guide**

### **"Mail not sent" or No Errors**

```bash
# 1. Clear all caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# 2. Check mail configuration
php artisan tinker
config('mail');
```

### **Gmail Authentication Failed**

Your `MAIL_PASSWORD` must be an **App Password**, not your regular password:

1. Google Account → Security
2. Enable 2-Step Verification
3. Search "App Passwords"
4. Generate for "Mail"
5. Copy 16-character code (no spaces)
6. Update `.env` with this code

### **Email Goes to Spam**

Normal for test emails! Check your spam/junk folder.

### **No User Found / Notification Not Sent**

```bash
php artisan tinker

# Check if user has Notifiable trait
$user = User::first();
method_exists($user, 'notify'); // Should return true

# Check if resident is linked to user
$resident = App\Models\BarangayResident::find(1);
$user = User::where('barangay_resident_id', $resident->id)->first();
if (!$user) {
    echo "Resident has no user account!";
}
```

### **Check SMTP Connection**

```bash
php artisan tinker

use Illuminate\Support\Facades\Mail;

Mail::raw('Test email', function($message) {
    $message->to('your@email.com')
            ->subject('SMTP Test');
});

echo "If no error, SMTP is working!";
```

---

## 📊 **Understanding the Flow (From the Guide)**

```
Admin Panel
    ↓
Fills Blotter Form (selects resident as respondent)
    ↓
POST /api/blotters
    ↓
BlotterController::store()
    ↓
Validates data
    ↓
Creates Blotter record
    ↓
Finds Resident by respondent_id
    ↓
Finds User account linked to Resident
    ↓
Checks if User has email
    ↓
$user->notify(new BlotterNotification($blotter))
    ↓
BlotterNotification::via() → returns ['database', 'mail']
    ↓
BlotterNotification::toMail() → builds email content
    ↓
Laravel connects to SMTP server
    ↓
Sends formatted HTML email
    ↓
Email arrives in Resident's inbox
    ↓
Returns success response to Admin
```

---

## ✅ **Comparison: Guide vs Your System**

| Feature | Guide's System | Your System | Status |
|---------|---------------|------------|--------|
| Email on create | ✅ | ✅ | **IMPLEMENTED** |
| Custom message | ✅ | ✅ | **IMPLEMENTED** |
| Action button | ✅ | ✅ | **IMPLEMENTED** |
| Professional format | ✅ | ✅ | **IMPLEMENTED** |
| Error handling | ✅ | ✅ | **IMPLEMENTED** |
| Logging | ✅ | ✅ | **IMPLEMENTED** |
| Database notifications | ❌ | ✅ | **BONUS** |
| SMS notifications | ❌ | ✅ | **BONUS** |
| Status update emails | ❌ | ✅ | **BONUS** |
| Mark as read | ❌ | ✅ | **BONUS** |

---

## 🎉 **Your System is Ready!**

Your implementation **exceeds** the guide's requirements:

- ✅ All email features from guide
- ✅ **PLUS** SMS notifications
- ✅ **PLUS** in-app notifications  
- ✅ **PLUS** status update notifications
- ✅ **PLUS** mark as read functionality

**Just test it with the methods above and you're good to go!** 🚀

---

## 📝 **Quick Test Command**

Run this one command to test everything:

```bash
php artisan tinker --execute="include 'test_blotter_email.php';"
```

This will automatically test your email configuration and send a test notification!
