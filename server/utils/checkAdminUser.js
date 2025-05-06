const mongoose = require('mongoose');
const User = require('../models/User');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database_name';

console.log('[CHECK_ADMIN] ADMIN_USERNAME:', process.env.ADMIN_USERNAME);

async function checkAdminUser() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

const adminUsername = process.env.ADMIN_USERNAME || 'admin';
const adminUser = await User.findOne({ username: adminUsername });
    if (!adminUser) {
      console.log('Admin user not found');
    } else {
      console.log('Admin user found:');
      console.log({
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role,
        passwordHash: adminUser.passwordHash ? '***hidden***' : 'No passwordHash',
      });
    }
    process.exit(0);
  } catch (error) {
    console.error('Error checking admin user:', error);
    process.exit(1);
  }
}

checkAdminUser();
