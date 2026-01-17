const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function checkIndexes() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Check candidates collection indexes
    console.log('\n=== CANDIDATES COLLECTION INDEXES ===');
    try {
      const candidatesIndexes = await db.collection('candidates').indexes();
      console.log('Candidates indexes:', JSON.stringify(candidatesIndexes, null, 2));
    } catch (error) {
      console.log('Candidates collection does not exist or error:', error.message);
    }

    // Check delegatecandidates collection indexes  
    console.log('\n=== DELEGATECANDIDATES COLLECTION INDEXES ===');
    try {
      const delegateIndexes = await db.collection('delegatecandidates').indexes();
      console.log('DelegateCandidates indexes:', JSON.stringify(delegateIndexes, null, 2));
    } catch (error) {
      console.log('DelegateCandidates collection does not exist or error:', error.message);
    }

    // List all collections
    console.log('\n=== ALL COLLECTIONS ===');
    const collections = await db.listCollections().toArray();
    collections.forEach(col => console.log(col.name));

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkIndexes();