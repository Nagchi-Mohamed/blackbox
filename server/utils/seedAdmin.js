const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI;

const adminEmail = 'admin@example.com'; // Change to desired admin email
const adminUsername = 'admin'; // Change to desired admin username
const adminPassword = 'adminpassword'; // Change to desired admin password

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
