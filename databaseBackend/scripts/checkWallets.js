const mongoose = require('mongoose');
require('dotenv').config();

const Student = require('../models/Student');

// Utility to check wallet address linkage
async function checkWalletLinkage() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');

    const students = await Student.find();
    console.log(`\nTotal students: ${students.length}`);
    
    const studentsWithWallets = students.filter(s => s.walletAddress);
    console.log(`Students with wallet addresses: ${studentsWithWallets.length}`);
    
    console.log('\nStudents with wallets:');
    studentsWithWallets.forEach(student => {
      console.log(`${student.registrationNumber} (${student.name}): ${student.walletAddress}`);
    });
    
    console.log('\nStudents without wallets:');
    const studentsWithoutWallets = students.filter(s => !s.walletAddress);
    studentsWithoutWallets.forEach(student => {
      console.log(`${student.registrationNumber} (${student.name}): NO WALLET`);
    });
    
  } catch (error) {
    console.error('Error checking wallet linkage:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Clear all wallet addresses (for testing)
async function clearWalletAddresses() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');

    const result = await Student.updateMany({}, { $unset: { walletAddress: 1 } });
    console.log(`Cleared wallet addresses for ${result.modifiedCount} students`);
    
  } catch (error) {
    console.error('Error clearing wallet addresses:', error);
  } finally {
    await mongoose.disconnect();
  }
}

const command = process.argv[2];

if (command === 'check') {
  checkWalletLinkage();
} else if (command === 'clear') {
  clearWalletAddresses();
} else {
  console.log('Usage:');
  console.log('  node checkWallets.js check  - Check which students have wallet addresses');
  console.log('  node checkWallets.js clear  - Clear all wallet addresses (testing only)');
}