const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function removeWalletIndex() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Drop the walletAddress index from candidates collection
    await db.collection('candidates').dropIndex('walletAddress_1');
    console.log('Successfully dropped walletAddress_1 index from candidates collection');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

removeWalletIndex();