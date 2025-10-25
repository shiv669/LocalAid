/**
 * LocalAid Connect - Environment Checker
 * 
 * Run this script to verify your environment is properly configured
 * Usage: node scripts/check-env.js
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_APPWRITE_PROJECT_ID',
  'NEXT_PUBLIC_APPWRITE_DATABASE_ID',
  'NEXT_PUBLIC_APPWRITE_STORAGE_ID',
  'NEXT_PUBLIC_APPWRITE_ENDPOINT',
  'NEXT_PUBLIC_COLLECTION_REQUESTS',
  'NEXT_PUBLIC_COLLECTION_RESOURCES',
  'NEXT_PUBLIC_COLLECTION_USERS',
  'NEXT_PUBLIC_COLLECTION_MATCHES',
];

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking LocalAid Connect Environment...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ Error: .env.local file not found!');
  console.log('\n📝 Create a .env.local file in the root directory with:');
  console.log('\nNEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id');
  console.log('NEXT_PUBLIC_APPWRITE_DATABASE_ID=localaid_db');
  console.log('NEXT_PUBLIC_APPWRITE_STORAGE_ID=localaid_storage');
  console.log('NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1');
  console.log('\nNEXT_PUBLIC_COLLECTION_REQUESTS=requests');
  console.log('NEXT_PUBLIC_COLLECTION_RESOURCES=resources');
  console.log('NEXT_PUBLIC_COLLECTION_USERS=users');
  console.log('NEXT_PUBLIC_COLLECTION_MATCHES=matches');
  console.log('\n📚 See QUICKSTART.md for more details\n');
  process.exit(1);
}

console.log('✅ .env.local file found\n');

// Load .env.local
require('dotenv').config({ path: envPath });

// Check each required variable
let missingVars = [];
let configuredVars = [];

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (!value || value.trim() === '') {
    missingVars.push(varName);
    console.log(`❌ ${varName}: Missing`);
  } else {
    configuredVars.push(varName);
    // Mask sensitive values
    const displayValue = varName.includes('PROJECT_ID') 
      ? value.substring(0, 8) + '...' 
      : value;
    console.log(`✅ ${varName}: ${displayValue}`);
  }
});

console.log('\n' + '='.repeat(50));

if (missingVars.length > 0) {
  console.log(`\n⚠️  Warning: ${missingVars.length} environment variable(s) missing:\n`);
  missingVars.forEach(v => console.log(`   - ${v}`));
  console.log('\n📚 Please update your .env.local file');
  console.log('📖 See APPWRITE_SETUP.md for configuration details\n');
  process.exit(1);
} else {
  console.log('\n✨ All environment variables configured!\n');
  console.log('📋 Next Steps:');
  console.log('   1. Make sure your Appwrite database and collections are created');
  console.log('   2. Enable phone authentication in Appwrite Console');
  console.log('   3. Run: npm run dev');
  console.log('   4. Visit: http://localhost:3000\n');
  console.log('📚 For detailed setup, see APPWRITE_SETUP.md\n');
  process.exit(0);
}
