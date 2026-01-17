// Test script to verify reset election API endpoint
// Run with: node testResetAPI.js

const fetch = require('node-fetch');

async function testResetElectionAPI() {
  try {
    console.log('Testing Reset Election API...');
    
    const response = await fetch('http://localhost:5000/api/admin/reset-election', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ API Test Successful!');
      console.log('Response:', result);
    } else {
      console.log('❌ API Test Failed!');
      console.log('Error:', result);
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message);
  }
}

// Only run if server is running
testResetElectionAPI();