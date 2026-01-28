const fetch = require('node-fetch');

async function testCandidateStatus() {
  try {
    // Test with the registration numbers we saw in the database
    const testRegNos = ['MED/2024/001', 'MED/2024/002'];
    
    for (const regNo of testRegNos) {
      console.log(`\n=== Testing ${regNo} ===`);
      const encodedRegNo = encodeURIComponent(regNo);
      const url = `https://votingsystem-evg4.onrender.com/api/delegate-candidates/status/${encodedRegNo}`;
      
      console.log('URL:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log('Status:', response.status);
      console.log('Response:', JSON.stringify(data, null, 2));
      
      if (data.candidate) {
        console.log('Status field:', data.candidate.status);
        console.log('AdminComments field:', data.candidate.adminComments);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testCandidateStatus();