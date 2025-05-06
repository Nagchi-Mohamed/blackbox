const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI;

const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'; // Use env or default
const adminUsername = process.env.ADMIN_USERNAME || 'admin'; // Use env or default
const adminPassword = process.env.ADMIN_PASSWORD || 'adminpassword'; // Use env or default

console.log('[SEED_ADMIN] ADMIN_EMAIL:', adminEmail);
console.log('[SEED_ADMIN] ADMIN_USERNAME:', adminUsername);
// console.log('[SEED_ADMIN] ADMIN_PASSWORD:', adminPassword); // Avoid logging password in production

async function createAdminUser() {
  try {
    console.log('Using MONGODB_URI:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB for admin seeding');

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(adminPassword, 10);
    const adminUser = new User({
      username: adminUsername,
      email: adminEmail,
      passwordHash,
      role: 'admin',
    });

    await adminUser.save();
    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
