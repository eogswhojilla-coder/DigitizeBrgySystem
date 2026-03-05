# Railway Deployment Guide

## Prerequisites
- Railway account
- Railway CLI installed (optional)
- GitHub repository connected to Railway

## Step 1: Database Setup

### Add MySQL Database Service
1. In Railway dashboard, click **"New"** → **"Database"** → **"Add MySQL"**
2. Railway will automatically provide connection variables

### Environment Variables (Set in Railway)

```env
# Application
APP_NAME="Barangay Management System"
APP_ENV=production
APP_KEY=                    # Generate with: php artisan key:generate --show
APP_DEBUG=false
APP_URL=https://your-app.up.railway.app

# Database (Railway MySQL - these are auto-provided)
DB_CONNECTION=mysql
DB_HOST=${{MYSQLHOST}}
DB_PORT=${{MYSQLPORT}}
DB_DATABASE=${{MYSQLDATABASE}}
DB_USERNAME=${{MYSQLUSER}}
DB_PASSWORD=${{MYSQLPASSWORD}}

# Session & Cache
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=true
CACHE_STORE=database
QUEUE_CONNECTION=database

# Mail Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_ENCRYPTION=tls
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"

# SMS Configuration (Semaphore)
SMS_API_KEY=your_semaphore_api_key
SMS_SENDER_ID=BARANGAY

# Barangay Details
MUNICIPALITY_NAME="San Carlos"
PROVINCE_NAME="Negros Occidental"
BARANGAY_NAME="Barangay II"

# File Storage
FILESYSTEM_DISK=local

# Vite
VITE_APP_NAME="${APP_NAME}"
```

## Step 2: Required Files

✅ `Procfile` - Created (defines start command)
✅ `nixpacks.toml` - Created (defines build process)

## Step 3: Deploy Process

### Option A: GitHub Connection (Recommended)
1. Push your code to GitHub
2. In Railway: **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Railway will auto-detect Laravel and start building

### Option B: Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up
```

## Step 4: Post-Deployment Tasks

After first successful deployment, run these commands in Railway terminal:

```bash
# Generate application key (if not set)
php artisan key:generate

# Run migrations
php artisan migrate --force

# Seed database
php artisan db:seed --force

# Setup storage link
php artisan storage:link

# Cache configurations
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## Step 5: File Storage Configuration

Railway ephemeral filesystem means uploaded files will be lost on redeploys. Consider:

### Option 1: Railway Volumes (Persistent Storage)
1. Add volume in Railway: **Settings** → **Volumes** → **New Volume**
2. Mount path: `/app/storage/app/public`

### Option 2: AWS S3 (Recommended for Production)
Update `.env`:
```env
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_DEFAULT_REGION=ap-southeast-1
AWS_BUCKET=your-bucket-name
AWS_URL=https://your-bucket.s3.amazonaws.com
```

## Common Errors & Fixes

### Error: "No application encryption key has been specified"
```bash
# In Railway terminal:
php artisan key:generate
```

### Error: "SQLSTATE[HY000] [2002] Connection refused"
- Check database service is running
- Verify environment variables reference Railway's MySQL variables correctly:
  - `DB_HOST=${{MYSQLHOST}}`
  - Use double curly braces for Railway variable references

### Error: "Class 'App\...' not found"
```bash
composer dump-autoload
php artisan optimize:clear
```

### Error: "npm: command not found" during build
- Check `nixpacks.toml` includes Node.js
- Verify npm packages are in `devDependencies`

### Error: "Vite manifest not found"
```bash
# Ensure build runs in nixpacks.toml
npm run build
```

### Error: "The stream or file 'storage/logs/laravel.log' could not be opened"
```bash
chmod -R 775 storage bootstrap/cache
```

## Testing Deployment

1. **Check health**: Navigate to your Railway URL
2. **Test login**: Try resident/admin authentication
3. **Check database**: Verify migrations ran
4. **Test file uploads**: Upload certificate receipt
5. **Check emails**: Test notification system
6. **Monitor logs**: Railway → Deployments → Logs

## Performance Optimization

```bash
# Enable OPcache in production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Queue worker (add separate service)
php artisan queue:work --tries=3
```

## Scaling Considerations

- **Add Redis**: For cache/sessions - Railway → New → Redis
- **Queue Worker**: Separate Railway service running `queue:work`
- **CDN**: CloudFlare for static assets
- **Database**: Upgrade Railway MySQL plan for more connections

## Monitoring

```bash
# View logs
railway logs

# SSH into container
railway shell

# Run commands
railway run php artisan tinker
```

## Security Checklist

- ✅ `APP_DEBUG=false` in production
- ✅ `APP_ENV=production`
- ✅ `SESSION_ENCRYPT=true`
- ✅ Use HTTPS (Railway provides by default)
- ✅ Set strong `DB_PASSWORD`
- ✅ Never commit `.env` file
- ✅ Use Railway secrets for sensitive data

## Useful Commands

```bash
# Restart deployment
railway reboot

# View environment variables
railway env

# Add environment variable
railway env set KEY=value

# View database
railway db connect
```
