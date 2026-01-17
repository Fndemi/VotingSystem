const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Admin = require('../models/Admin');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB\n');

    const username = process.argv[2] || 'admin';
    const password = process.argv[3];
    const email = process.argv[4] || 'admin@blockvote.com';

    if (!password) {
      console.error('Usage: node createAdmin.js <username> <password> <email>');
      console.error('Example: node createAdmin.js admin SecurePass123! admin@university.edu');
      process.exit(1);
    }

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      console.log(`Admin '${username}' already exists. Updating password...`);
      existingAdmin.passwordHash = await bcrypt.hash(password, 10);
      await existingAdmin.save();
      console.log('✓ Password updated successfully');
    } else {
      const passwordHash = await bcrypt.hash(password, 10);
      const admin = new Admin({
        username,
        passwordHash,
        email,
        role: 'super_admin'
      });
      await admin.save();
      console.log('✓ Admin account created successfully');
    }

    console.log('\nAdmin Details:');
    console.log(`Username: ${username}`);
    console.log(`Email: ${email}`);
    console.log('\n⚠️  Keep these credentials secure!');

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();
