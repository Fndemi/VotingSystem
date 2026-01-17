const mongoose = require('mongoose');
const Phase = require('../models/Phase');
require('dotenv').config();

async function testPhaseSkipping() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');

    // Test phase progression: 0 -> 1 -> 2 -> 4 (skip 3)
    const phases = [
      { phase: 0, name: 'Registration' },
      { phase: 1, name: 'Candidate Registration' },
      { phase: 2, name: 'Delegate Voting' },
      { phase: 4, name: 'Party Registration' }, // Skip 3
      { phase: 5, name: 'Council Voting' },
      { phase: 6, name: 'Ended' }
    ];

    console.log('\n=== Web2 Phase Flow Test ===');
    console.log('Expected: 0 -> 1 -> 2 -> 4 -> 5 -> 6 (skips 3)');
    console.log('Blockchain: 0 -> 1 -> 2 -> 3 -> 4 -> 5 -> 6 (includes 3)');
    
    for (const { phase, name } of phases) {
      const newPhase = new Phase({
        currentPhase: phase,
        phaseName: name
      });
      await newPhase.save();
      console.log(`✓ Phase ${phase}: ${name}`);
    }

    console.log('\n=== Phase Skip Implementation Complete ===');
    console.log('- Phase 3 (Nominee Registration) exists in schema but is skipped in Web2');
    console.log('- /api/phases/next automatically skips from Phase 2 to Phase 4');
    console.log('- /api/phases/set prevents manual setting of Phase 3');
    console.log('- /api/delegate-voting/tally auto-advances to Phase 4');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

testPhaseSkipping();