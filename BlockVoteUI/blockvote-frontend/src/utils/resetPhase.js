/**
 * Reset Web2 Database Phase
 * 
 * This script resets the Web2 database phase to 0 (Registration)
 * Use this when the blockchain has been reset but Web2 is out of sync
 */

const API_BASE_URL = 'http://localhost:5000/api';

async function resetWeb2Phase() {
  try {
    console.log('🔄 Resetting Web2 phase to 0...');
    
    const response = await fetch(`${API_BASE_URL}/phases/set`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phaseNumber: 0 }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Web2 phase reset successfully:', result);
    
    // Verify the phase
    const verifyResponse = await fetch(`${API_BASE_URL}/phases/current`);
    const currentPhase = await verifyResponse.json();
    console.log('📊 Current phase:', currentPhase);
    
    return result;
  } catch (error) {
    console.error('❌ Error resetting Web2 phase:', error);
    throw error;
  }
}

async function getCurrentPhase() {
  try {
    const response = await fetch(`${API_BASE_URL}/phases/current`);
    const data = await response.json();
    console.log('📊 Current Web2 phase:', data.currentPhase);
    return data;
  } catch (error) {
    console.error('❌ Error getting current phase:', error);
    throw error;
  }
}

// Main execution
async function main() {
  console.log('=== BlockVote Web2 Phase Reset Utility ===\n');
  
  // Check current phase
  await getCurrentPhase();
  
  // Ask for confirmation
  console.log('\n⚠️  This will reset the Web2 database phase to 0');
  console.log('⚠️  Make sure the blockchain has also been reset');
  console.log('\nPress Ctrl+C to cancel, or wait 3 seconds to continue...\n');
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Reset phase
  await resetWeb2Phase();
  
  console.log('\n✅ Reset complete!');
}

// Run if called directly
if (typeof window === 'undefined') {
  // Node.js environment
  main().catch(console.error);
} else {
  // Browser environment - expose functions
  window.BlockVoteUtils = {
    resetWeb2Phase,
    getCurrentPhase,
  };
  console.log('BlockVote utilities loaded. Use:');
  console.log('- BlockVoteUtils.getCurrentPhase()');
  console.log('- BlockVoteUtils.resetWeb2Phase()');
}

export { resetWeb2Phase, getCurrentPhase };
