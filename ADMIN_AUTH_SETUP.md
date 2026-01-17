# Admin Authentication Setup Guide

## Overview
The admin authentication system uses secure database-backed authentication with bcrypt password hashing.

## Initial Setup

### 1. Create Your First Admin Account

Run the admin creation script:

```bash
cd databaseBackend/scripts
node createAdmin.js <username> <password> <email>
```

**Example:**
```bash
node createAdmin.js admin MySecurePassword123! admin@university.edu
```

### 2. Update Environment Variables

Edit `databaseBackend/.env` and set a strong admin password (optional, for backup):

```env
ADMIN_PASSWORD=your-secure-admin-password-here
```

## Security Best Practices

### Password Requirements
- Minimum 8 characters
- Include uppercase and lowercase letters
- Include numbers
- Include special characters
- Avoid common words or patterns

### Recommended Actions
1. ✅ Change default admin password immediately
2. ✅ Use unique passwords for each admin
3. ✅ Store credentials in a secure password manager
4. ✅ Enable 2FA (if implemented)
5. ✅ Regularly rotate admin passwords
6. ✅ Limit admin accounts to necessary personnel only

## Admin Management

### Create Additional Admin
```bash
node createAdmin.js john SecurePass456! john@university.edu
```

### Update Admin Password
```bash
node createAdmin.js admin NewPassword789! admin@university.edu
```

### Check Existing Admins
Use MongoDB Compass or mongosh:
```javascript
db.admins.find({}, { username: 1, email: 1, role: 1, isActive: 1 })
```

### Deactivate Admin
```javascript
db.admins.updateOne(
  { username: "admin" },
  { $set: { isActive: false } }
)
```

## Login Process

1. Navigate to the application
2. Click "Admin Login"
3. Enter username and password
4. Access admin dashboard

## Troubleshooting

### "Invalid credentials" error
- Verify username is correct (case-sensitive)
- Ensure password matches exactly
- Check admin account is active: `isActive: true`

### "Connection error"
- Verify backend server is running on port 5000
- Check MongoDB connection in `.env`
- Ensure Admin model is properly imported

### Reset Admin Password
If you forget the admin password:
```bash
cd databaseBackend/scripts
node createAdmin.js admin NewPassword123! admin@university.edu
```

## Production Deployment

### Before Going Live:
1. ✅ Remove all default/test admin accounts
2. ✅ Create production admin with strong password
3. ✅ Update JWT_SECRET in `.env` to a random 64+ character string
4. ✅ Enable HTTPS for all admin traffic
5. ✅ Set up admin activity logging
6. ✅ Implement rate limiting on login endpoint
7. ✅ Add IP whitelisting for admin access (optional)

### Generate Secure JWT Secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Migration from Old System

If upgrading from the hardcoded password system:

1. Create admin account using the script
2. Update frontend to use AdminLogin component (already done)
3. Remove any hardcoded passwords from code
4. Test admin login thoroughly
5. Deploy changes

## API Endpoints

### Admin Login
```
POST /api/auth/admin-login
Body: { "username": "admin", "password": "password" }
Response: { "success": true, "token": "...", "user": {...} }
```

### Validate Admin Token
```
POST /api/auth/verify-token
Body: { "token": "..." }
Response: { "success": true, "user": {...} }
```

## Support

For issues or questions:
1. Check this documentation
2. Review server logs: `databaseBackend/` console output
3. Check MongoDB for admin records
4. Verify environment variables are loaded correctly
