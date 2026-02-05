# Admin Scripts

This directory contains administrative scripts for managing the QRMaker SaaS application.

## Create Admin Account

### Quick Start

```bash
npm run admin:create
```

This will launch an interactive prompt asking for:
- Full Name
- Email
- Username
- Password (8+ characters, must include uppercase, lowercase, and number)

### Environment Variables Method

For automated deployments or CI/CD:

```bash
ADMIN_NAME="John Doe" \
ADMIN_EMAIL="admin@qrmaker.com" \
ADMIN_USERNAME="admin" \
ADMIN_PASSWORD="SecurePass123" \
npm run admin:create
```

## Features

✅ **Interactive CLI** - User-friendly prompts with validation  
✅ **Password Security** - Bcrypt hashing with 10 salt rounds  
✅ **Duplicate Prevention** - Checks for existing email/username  
✅ **Strong Validation** - Email format, username rules, password complexity  
✅ **Pro Plan** - Admins automatically get "pro" plan access  

## Admin Role

Admins have full access to:
- `/admin` dashboard
- User management
- Analytics and reports
- System settings
- Plan configuration

## Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- Only letters, numbers, underscores, and hyphens allowed in username

## Example Output

```
🔐 QRMaker Admin Account Creator

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This script will create an admin account with full access.

📝 Please enter admin details:

Full Name: John Doe
Email: admin@qrmaker.com
Username: admin
Password: ********

⏳ Validating input...
🔌 Connecting to MongoDB...
✅ Connected to database
🔍 Checking for existing users...
🔒 Hashing password...
👤 Creating admin account...

✨ SUCCESS! Admin account created successfully!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Admin Details:
   Name:     John Doe
   Email:    admin@qrmaker.com
   Username: admin
   Role:     admin
   Plan:     pro
   ID:       65f4a3b2c1d2e3f4g5h6i7j8
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 You can now log in with these credentials!
```

## Troubleshooting

### "MONGODB_URI environment variable is not set"
Make sure your `.env.local` file contains:
```
MONGODB_URI=mongodb+srv://...
```

### "Email already in use" or "Username already taken"
These credentials are already registered. Use different values or update the existing user in the database.

### "Validation Error"
Check that your password meets all requirements and your email is in valid format.

## Security Notes

- Passwords are hashed using bcryptjs (never stored in plain text)
- The script never logs passwords to console
- Admin accounts are created with `role: "admin"` and `plan: "pro"`
- All input is validated before database operations
