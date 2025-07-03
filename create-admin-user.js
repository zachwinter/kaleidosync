#!/usr/bin/env node

/**
 * Create Admin User Script
 * 
 * This script creates the ShaderTom admin user with wallet address
 * 6Qxu5cRDNFEZvYtgtvo27tdg7LuT5wuX7THqqPbBWJmT
 * 
 * Usage: node create-admin-user.js
 */

const { execSync } = require('child_process');
const path = require('path');

// Admin wallet address
const ADMIN_WALLET = '6Qxu5cRDNFEZvYtgtvo27tdg7LuT5wuX7THqqPbBWJmT';

async function createAdminUser() {
  try {
    console.log('🔑 Creating ShaderTom Admin User...');
    console.log(`👑 Wallet Address: ${ADMIN_WALLET}`);
    
    // Path to API directory
    const apiPath = path.join(__dirname, '..', 'api');
    
    // Set environment variables and run the database initialization
    process.env.ADMIN_WALLET = ADMIN_WALLET;
    process.env.NODE_ENV = 'development';
    
    console.log('\n📊 Step 1: Running database migrations...');
    try {
      execSync('npm run db:migrate', { 
        cwd: apiPath, 
        stdio: 'inherit',
        env: { ...process.env, ADMIN_WALLET }
      });
      console.log('✅ Database migrations completed');
    } catch (error) {
      console.log('⚠️  Migration may have already been run or failed:', error.message);
    }
    
    console.log('\n🧪 Step 2: Creating test users (includes admin setup)...');
    try {
      execSync('npm run db:seed:test-users', { 
        cwd: apiPath, 
        stdio: 'inherit',
        env: { ...process.env, ADMIN_WALLET }
      });
      console.log('✅ Test users seeded successfully');
    } catch (error) {
      console.log('⚠️  Test users seeding failed:', error.message);
    }
    
    console.log('\n🎨 Step 3: Creating Kaleidosync study...');
    try {
      execSync('tsx scripts/sketches.ts', { 
        cwd: apiPath, 
        stdio: 'inherit',
        env: { ...process.env, ADMIN_WALLET }
      });
      console.log('✅ Kaleidosync study created successfully');
    } catch (error) {
      console.log('⚠️  Kaleidosync study creation failed:', error.message);
    }
    
    console.log('\n✨ Admin user setup complete!');
    console.log('🔗 You can now:');
    console.log('   1. Start the API server: cd ../api && npm run dev');
    console.log('   2. Test the sketches API endpoints');
    console.log('   3. Verify the admin user exists in the database');
    console.log(`   4. Admin wallet: ${ADMIN_WALLET}`);
    
  } catch (error) {
    console.error('❌ Failed to create admin user:', error);
    process.exit(1);
  }
}

createAdminUser();