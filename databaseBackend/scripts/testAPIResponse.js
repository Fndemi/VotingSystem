// Test script to check the exact API response

async function testAPI() {
  try {
    const response = await fetch('https://votingsystem-evg4.onrender.com/api/delegate-candidates/status/MED%2F2024%2F001');
    const data = await response.json();
    
    console.log('Full API Response:');
    console.log(JSON.stringify(data, null, 2));
    
    console.log('\nAnalysis:');
    console.log('Has isCandidate:', 'isCandidate' in data);
    console.log('Has candidate:', 'candidate' in data);
    
    if (data.candidate) {
      console.log('Candidate keys:', Object.keys(data.candidate));
      console.log('Has status:', 'status' in data.candidate);
      console.log('Has adminComments:', 'adminComments' in data.candidate);
      console.log('Status value:', data.candidate.status);
      console.log('AdminComments value:', data.candidate.adminComments);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testAPI();