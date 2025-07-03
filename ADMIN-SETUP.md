# ShaderTom Admin User Setup

This directory contains scripts to initialize the ShaderTom admin user needed for the sketches API to work properly.

## The Problem

The sketches API endpoints require an admin user with the wallet address `6Qxu5cRDNFEZvYtgtvo27tdg7LuT5wuX7THqqPbBWJmT` to be present in the database. Without this user, the API returns empty results.

## The Solution

The `@wearesage/api` package has built-in database initialization that creates the admin user automatically when the server starts. However, you can also run these scripts manually to ensure the admin user is created.

## Available Scripts

### 1. `init-shadertom-admin.ts` (Recommended)
**This is the main script you should run.**

```bash
tsx init-shadertom-admin.ts
```

This script:
- Runs database migrations
- Creates the ShaderTom admin user with the correct wallet address
- Sets up the Kaleidosync study with sketches
- Provides detailed status information

### 2. `check-admin-user.ts`
Check if the admin user already exists:

```bash
tsx check-admin-user.ts
```

This script:
- Connects to the database
- Looks for the ShaderTom admin user
- Shows user details if found
- Provides guidance if not found

### 3. `create-admin-user.ts`
Alternative initialization script:

```bash
tsx create-admin-user.ts
```

This script:
- Runs the full database setup process
- Creates test users and admin user
- Sets up the Kaleidosync study

### 4. `create-admin-user.js`
Node.js version of the setup script:

```bash
node create-admin-user.js
```

Same functionality as the TypeScript version but runs with Node.js.

## Quick Start

1. **Run the main initialization script:**
   ```bash
   tsx init-shadertom-admin.ts
   ```

2. **Start the API server:**
   ```bash
   cd ../api && npm run dev:prod
   ```

3. **Test the sketches API:**
   ```bash
   curl http://localhost:3000/api/sketches
   ```

## How It Works

### Admin User Details
- **Wallet Address**: `6Qxu5cRDNFEZvYtgtvo27tdg7LuT5wuX7THqqPbBWJmT`
- **Role**: `ADMIN` (role ID: 1)
- **Status**: Active
- **Purpose**: This is the ShaderTom admin user needed for sketch management

### Database Initialization Process
1. **Database Connection**: Connects to PostgreSQL
2. **Model Initialization**: Sets up all database models
3. **Admin User Creation**: Creates/verifies the admin user exists
4. **Study Setup**: Creates the Kaleidosync study with sketches

### Environment Variables
The scripts use these environment variables:
- `ADMIN_WALLET`: Set to the ShaderTom wallet address
- `NODE_ENV`: Set to 'production' to ensure admin user creation
- `DATABASE_URL`: Database connection string (from API config)

## Alternative: Automatic Creation

The admin user is also created automatically when you start the API server:

```bash
cd ../api && npm run dev:prod
```

The server initialization includes the admin user creation logic in `/Users/zach/dev/@wearesage/api/src/config/db.init.ts`.

## Database Files

The key database files involved:
- **Admin User Creation**: `/Users/zach/dev/@wearesage/api/src/config/db.init.ts`
- **User Model**: `/Users/zach/dev/@wearesage/api/src/models/user.model.ts`
- **Environment Config**: `/Users/zach/dev/@wearesage/api/src/config/env.ts`
- **Test Users Seeder**: `/Users/zach/dev/@wearesage/api/src/seeders/20250702130000-create-test-users.js`
- **Sketches Script**: `/Users/zach/dev/@wearesage/api/scripts/sketches.ts`

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check database credentials in `../api/.env`
- Verify database exists and is accessible

### User Already Exists
- The scripts are safe to run multiple times
- Existing admin users will be verified/updated
- No duplicate users will be created

### Migration Issues
- Run `cd ../api && npm run db:migrate` first
- Check that migrations have been applied
- Verify database schema is up to date

### API Not Working
- Ensure admin user was created successfully
- Check server logs for errors
- Verify the API server is running on the correct port
- Test with: `curl http://localhost:3000/api/sketches`

## Success Indicators

You'll know the setup worked when:
1. ✅ The admin user exists in the database
2. ✅ The API server starts without errors
3. ✅ The sketches API returns data: `GET /api/sketches`
4. ✅ Admin endpoints are accessible: `GET /api/admin/users`

## Next Steps

After running the setup:
1. Start the API server: `cd ../api && npm run dev:prod`
2. Test the sketches API endpoints
3. Verify the admin user has the correct permissions
4. Check that the Kaleidosync study is accessible

---

**Note**: These scripts are designed to be safe to run multiple times. They check for existing data and avoid creating duplicates.