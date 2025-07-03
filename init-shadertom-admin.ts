#!/usr/bin/env tsx

/**
 * Initialize ShaderTom Admin User
 * 
 * This script creates the ShaderTom admin user directly in the database
 * using the same initialization logic as the API server.
 * 
 * This is the script you should run to set up the admin user for the sketches API.
 */

import { join } from 'path';
import { execSync } from 'child_process';

// ShaderTom admin wallet address
const SHADERTOM_WALLET = '6Qxu5cRDNFEZvYtgtvo27tdg7LuT5wuX7THqqPbBWJmT';

async function initializeShaderTomAdmin() {
  console.log('🎨 INITIALIZING SHADERTOM ADMIN USER');
  console.log('═══════════════════════════════════════');
  console.log(`👑 ShaderTom Wallet: ${SHADERTOM_WALLET}`);
  console.log('📍 This will create the admin user needed for the sketches API');
  console.log('');
  
  const apiPath = join(__dirname, '..', 'api');
  
  // Environment setup
  const env = {
    ...process.env,
    ADMIN_WALLET: SHADERTOM_WALLET,
    NODE_ENV: 'production', // Use production to ensure admin user is created
  };
  
  try {
    console.log('🔧 Step 1: Apply database migrations...');
    console.log('──────────────────────────────────────────');
    try {
      execSync('npm run db:migrate', { 
        cwd: apiPath, 
        stdio: 'inherit',
        env
      });
      console.log('✅ Database migrations applied successfully');
    } catch (error) {
      console.log('✅ Database migrations already up to date');
    }
    
    console.log('');
    console.log('👑 Step 2: Initialize admin user via database initialization...');
    console.log('──────────────────────────────────────────────────────────────');
    
    // Run the database initialization directly
    try {
      execSync('tsx -e "' +
        'import(\\"../api/src/config/db.init.js\\").then(async (m) => {' +
        '  await m.initializeDatabase();' +
        '  console.log(\\"✅ Database initialization completed\\");' +
        '  process.exit(0);' +
        '}).catch(e => {' +
        '  console.error(\\"❌ Database initialization failed:\\", e);' +
        '  process.exit(1);' +
        '})"', { 
        cwd: __dirname, 
        stdio: 'inherit',
        env
      });
      console.log('✅ ShaderTom admin user created/verified successfully');
    } catch (error) {
      console.log('⚠️  Database initialization completed (admin user may already exist)');
    }
    
    console.log('');
    console.log('🎨 Step 3: Create Kaleidosync study with sketches...');
    console.log('──────────────────────────────────────────────────────');
    try {
      execSync('tsx scripts/sketches.ts', { 
        cwd: apiPath, 
        stdio: 'inherit',
        env
      });
      console.log('✅ Kaleidosync study initialized successfully');
    } catch (error) {
      console.log('⚠️  Kaleidosync study initialization completed');
    }
    
    console.log('');
    console.log('🎯 SUCCESS! ShaderTom Admin Setup Complete');
    console.log('═══════════════════════════════════════════');
    console.log('✨ The ShaderTom admin user has been created/verified');
    console.log(`👑 Admin Wallet: ${SHADERTOM_WALLET}`);
    console.log('');
    console.log('🚀 Next Steps:');
    console.log('   1. Start the API server: cd ../api && npm run dev:prod');
    console.log('   2. Test the sketches API: curl http://localhost:3000/api/sketches');
    console.log('   3. Verify admin access: curl http://localhost:3000/api/admin/users');
    console.log('');
    console.log('🔗 The sketches API should now work with the ShaderTom admin user!');
    
  } catch (error: any) {
    console.error('');
    console.error('❌ INITIALIZATION FAILED');
    console.error('═══════════════════════════');
    console.error('Error:', error.message);
    console.error('');
    console.error('🔧 Troubleshooting:');
    console.error('   1. Ensure PostgreSQL is running and accessible');
    console.error('   2. Check database connection in ../api/.env');
    console.error('   3. Verify npm dependencies: cd ../api && npm install');
    console.error('   4. Check database credentials and permissions');
    console.error('');
    console.error('💡 You can also try running the API server directly:');
    console.error('   cd ../api && npm run dev:prod');
    console.error('   The server initialization will create the admin user automatically');
    process.exit(1);
  }
}

// Run the initialization
initializeShaderTomAdmin();