#!/usr/bin/env tsx

/**
 * Check ShaderTom Admin User
 * 
 * This script checks if the ShaderTom admin user exists in the database
 * and shows the current status.
 */

import { join } from 'path';
import { execSync } from 'child_process';

const SHADERTOM_WALLET = '6Qxu5cRDNFEZvYtgtvo27tdg7LuT5wuX7THqqPbBWJmT';

async function checkAdminUser() {
  console.log('🔍 CHECKING SHADERTOM ADMIN USER STATUS');
  console.log('═══════════════════════════════════════');
  console.log(`👑 Looking for wallet: ${SHADERTOM_WALLET}`);
  console.log('');
  
  const apiPath = join(__dirname, '..', 'api');
  
  try {
    // Check if the user exists in the database
    const checkScript = `
      const { sequelize } = require('./src/config/database');
      const { User } = require('./src/models/user.model');
      
      async function checkUser() {
        try {
          await sequelize.authenticate();
          console.log('✅ Database connection established');
          
          const user = await User.findOne({
            where: { walletAddress: '${SHADERTOM_WALLET}' }
          });
          
          if (user) {
            console.log('✅ ShaderTom admin user found!');
            console.log('👑 User Details:');
            console.log('   - Wallet:', user.walletAddress);
            console.log('   - Role:', user.role);
            console.log('   - Active:', user.isActive);
            console.log('   - Created:', user.createdAt);
            console.log('   - Last Login:', user.lastLogin);
          } else {
            console.log('❌ ShaderTom admin user NOT found');
            console.log('💡 You need to run the initialization script:');
            console.log('   tsx init-shadertom-admin.ts');
          }
          
          await sequelize.close();
          process.exit(0);
        } catch (error) {
          console.error('❌ Database check failed:', error.message);
          process.exit(1);
        }
      }
      
      checkUser();
    `;
    
    console.log('🔍 Checking database for ShaderTom admin user...');
    console.log('──────────────────────────────────────────────────');
    
    execSync(`node -e "${checkScript}"`, { 
      cwd: apiPath, 
      stdio: 'inherit',
      env: { ...process.env, ADMIN_WALLET: SHADERTOM_WALLET }
    });
    
  } catch (error: any) {
    console.error('');
    console.error('❌ CHECK FAILED');
    console.error('═══════════════');
    console.error('Error:', error.message);
    console.error('');
    console.error('🔧 Possible Issues:');
    console.error('   1. Database not running or not accessible');
    console.error('   2. Database not initialized (run migrations first)');
    console.error('   3. Admin user not created yet');
    console.error('');
    console.error('💡 Solutions:');
    console.error('   1. Run: tsx init-shadertom-admin.ts');
    console.error('   2. Or start the API server: cd ../api && npm run dev:prod');
    process.exit(1);
  }
}

checkAdminUser();