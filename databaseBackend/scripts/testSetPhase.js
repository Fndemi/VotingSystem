// Test script to set phase to Candidate Registration
const API_BASE = 'http://localhost:5000/api';

async function setPhase() {
  try {
    const response = await fetch(`${API_BASE}/phases/set`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phaseNumber: 1 })
    });
    
    const result = await response.json();
    console.log('Phase set:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

setPhase();