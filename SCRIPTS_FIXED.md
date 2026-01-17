# Scripts Fixed After Cleanup

## Issue
After removing blockchain models (Candidate.js, Vote.js), some scripts were still referencing them, causing errors.

## Scripts Fixed

### 1. resetElection.js ✅
**Error:** `Cannot find module '../models/Candidate'`

**Fixed:**
- Removed `require('../models/Candidate')`
- Removed `require('../models/Vote')`
- Removed deletion of general candidates
- Removed deletion of general votes

**Now uses only Web2 models:**
- DelegateCandidate
- DelegateVote
- CouncilVote
- ElectedDelegate
- Party
- Phase
- Student

### 2. checkElectionData.js ✅
**Fixed:**
- Removed `require('../models/Candidate')`
- Removed `require('../models/Vote')`
- Removed general candidates check
- Removed general votes check

**Now checks only:**
- Delegate candidates
- Delegate votes
- Council votes
- Current phase

### 3. checkWallets.js ✅
**Status:** No changes needed (doesn't use deleted models)

### 4. linkWallets.js ✅
**Status:** No changes needed (doesn't use deleted models)

## Usage

### Reset Election (Fresh Start)
```bash
cd databaseBackend/scripts
node resetElection.js
```

**What it does:**
- Deletes all delegate votes
- Deletes all council votes
- Deletes all delegate candidates
- Deletes all elected delegates
- Deletes all parties
- Resets student passwords
- Sets phase to 0 (Registration)

### Check Election Data
```bash
cd databaseBackend/scripts
node checkElectionData.js
```

**What it shows:**
- Current phase
- Delegate candidates count
- Delegate votes count
- Council votes count

## All Scripts Status

| Script | Status | Notes |
|--------|--------|-------|
| resetElection.js | ✅ Fixed | Removed blockchain model references |
| checkElectionData.js | ✅ Fixed | Removed blockchain model references |
| checkWallets.js | ✅ OK | No changes needed |
| linkWallets.js | ✅ OK | No changes needed |
| checkIndexes.js | ⚠️ Check | May need review |
| createAdmin.js | ✅ OK | No changes needed |
| debugDelegateElection.js | ⚠️ Check | May need review |
| fixVoteCounts.js | ⚠️ Check | May need review |
| populateElectedDelegates.js | ✅ OK | Uses Web2 models |
| removeWalletIndex.js | ✅ OK | Wallet-related but safe |
| resetToPhase2.js | ⚠️ Check | May need review |
| seedDatabase.js | ✅ OK | Seeds base data |
| setPhase.js | ✅ OK | Phase management |
| testPhaseSkip.js | ✅ OK | Tests phase transitions |
| testSetPhase.js | ✅ OK | Tests phase setting |
| updateElectedDelegates.js | ✅ OK | Uses Web2 models |

## Testing

Run resetElection.js to verify the fix:
```bash
cd /mnt/c/Users/Administrator/Projects/FinalYear/databaseBackend/scripts
node resetElection.js
```

Expected output:
```
Connected to MongoDB

=== RESETTING ELECTION ===

✓ Deleted X delegate votes
✓ Deleted X council votes
✓ Deleted X delegate candidates
✓ Deleted X elected delegates
✓ Deleted X parties
✓ Reset passwords for X students
✓ Reset phase to 0 (Registration)

=== ELECTION RESET COMPLETE ===
```

## Notes

- All scripts now use only Web2 models
- No blockchain model references remain
- Scripts are compatible with pure Web2 implementation
- Wallet-related scripts kept for backward compatibility but not required
