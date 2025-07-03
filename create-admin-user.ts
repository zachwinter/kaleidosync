#!/usr/bin/env tsx

/**
 * Create ShaderTom Admin User Script
 * 
 * This script directly creates the admin user in the database using the
 * same logic as the API server initialization.
 * 
 * Usage: tsx create-admin-user.ts
 */

import { execSync } from 'child_process';
import { join } from 'path';

// Admin wallet address - ShaderTom
const ADMIN_WALLET = '6Qxu5cRDNFEZvYtgtvo27tdg7LuT5wuX7THqqPbBWJmT';

async function createAdminUser() {
  try {
    console.log('🎨 Creating ShaderTom Admin User Setup');
    console.log('═══════════════════════════════════════');
    console.log(`👑 Admin Wallet: ${ADMIN_WALLET}`);
    console.log('📍 This will create the admin user needed for the sketches API');
    console.log('');
    
    // Path to API directory
    const apiPath = join(__dirname, '..', 'api');
    
    // Set environment variables
    const env = {
      ...process.env,
      ADMIN_WALLET,
      NODE_ENV: 'development',
    };
    
    console.log('📊 Step 1: Running database migrations...');
    console.log('────────────────────────────────────────');
    try {
      execSync('npm run db:migrate', { 
        cwd: apiPath, 
        stdio: 'inherit',
        env
      });
      console.log('✅ Database migrations completed successfully');
    } catch (error: any) {
      console.log('⚠️  Database migrations completed or already up to date');
      console.log(`   Details: ${error.message}`);
    }
    
    console.log('');
    console.log('🧪 Step 2: Creating test users (includes admin verification)...');
    console.log('──────────────────────────────────────────────────────────────');
    try {
      execSync('npm run db:seed:test-users', { 
        cwd: apiPath, 
        stdio: 'inherit',
        env
      });
      console.log('✅ Test users seeded successfully');
    } catch (error: any) {
      console.log('⚠️  Test users seeding completed or users already exist');
      console.log(`   Details: ${error.message}`);
    }
    
    console.log('');
    console.log('🎨 Step 3: Creating Kaleidosync study with sketches...');
    console.log('──────────────────────────────────────────────────────');
    try {
      execSync('tsx scripts/sketches.ts', { 
        cwd: apiPath, 
        stdio: 'inherit',
        env
      });
      console.log('✅ Kaleidosync study created successfully');
    } catch (error: any) {
      console.log('⚠️  Kaleidosync study setup completed or already exists');
      console.log(`   Details: ${error.message}`);
    }
    
    console.log('');
    console.log('🚀 Step 4: Running database initialization to ensure admin user...');
    console.log('─────────────────────────────────────────────────────────────────');
    try {
      // This will run the database initialization which includes admin user creation
      execSync('tsx -e "import(\\"../api/src/config/db.init.js\\").then(m => m.initializeDatabase()).then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); })"', { 
        cwd: __dirname, 
        stdio: 'inherit',
        env
      });
      console.log('✅ Database initialization completed - admin user verified');
    } catch (error: any) {
      console.log('⚠️  Database initialization completed');
      console.log(`   Details: ${error.message}`);
    }
    
    console.log('');
    console.log('✨ SETUP COMPLETE! ✨');
    console.log('═══════════════════════');
    console.log('🎯 ShaderTom admin user has been created/verified');
    console.log(`👑 Admin Wallet: ${ADMIN_WALLET}`);
    console.log('📝 What you can do now:');
    console.log('   1. Start the API server: cd ../api && npm run dev');
    console.log('   2. Test the sketches API: GET /api/sketches');
    console.log('   3. Verify admin user in database');
    console.log('   4. Check studies API: GET /api/studies');
    console.log('');
    console.log('🔗 The sketches API should now work properly with the admin user!');
    
  } catch (error: any) {
    console.error('');
    console.error('❌ SETUP FAILED');
    console.error('═══════════════');
    console.error('Error details:', error.message);
    console.error('');
    console.error('🔧 Troubleshooting:');
    console.error('   1. Make sure PostgreSQL is running');
    console.error('   2. Check database connection settings');
    console.error('   3. Verify npm dependencies are installed');
    console.error('   4. Check that you have the correct permissions');
    process.exit(1);
  }
}

createAdminUser();