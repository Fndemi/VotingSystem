# BlockVote Admin Guide

## Election Reset Process

### Important Notes

1. **Contract Restriction**: The smart contract prevents reverting to or before Phase 2 (Delegate Voting) to maintain data integrity. This is by design to prevent tampering with delegate election results.

2. **Reset Limitations**: When you reset the election:
   - ✅ Blockchain phase resets to 0
   - ✅ Phase counters reset
   - ❌ Student registration data is NOT cleared (by design)
   - ❌ Candidate data is NOT cleared (by design)
   - ❌ Delegate data is NOT cleared (by design)

### When to Reset

- **Testing**: During development and testing phases
- **Fresh Start**: When you need to restart the entire election process
- **After Errors**: If the election state becomes inconsistent

### Reset Procedure

#### Option 1: Using SimpleAdmin Dashboard (Recommended)

1. Login as admin with MetaMask
2. Click "Reset Election" button
3. Confirm the action
4. Wait for blockchain confirmation
5. Web2 database will auto-sync to phase 0

#### Option 2: Manual Reset

If you need to reset during council voting or after:

```bash
# 1. Reset blockchain (from your deployment script)
cast send <CONTRACT_ADDRESS> "resetElection()" --private-key <ADMIN_KEY>

# 2. Reset Web2 database phase
curl -X POST http://localhost:5000/api/phases/set -H "Content-Type: application/json" -d '{"phaseNumber": 0}'
```

### Hybrid Web2/Web3 Approach

BlockVote uses a hybrid approach:

- **Phase 0 (Registration)**: Blockchain-controlled
- **Phases 1-5**: Web2-controlled for flexibility
- **Phase 6 (Results)**: Blockchain-controlled

This allows:
- Fast phase transitions without gas fees
- Admin flexibility during candidate/party registration
- Blockchain security for critical voting phases

### Troubleshooting

#### MetaMask Triggering Too Often

**Problem**: MetaMask popup appears repeatedly when viewing admin dashboard.

**Solution**: 
- The latest update optimizes contract reads
- Only essential data is fetched based on current phase
- Reads are throttled to every 10 seconds

#### Reset Not Working

**Problem**: Reset button doesn't work or shows error.

**Causes**:
1. Not connected with admin wallet
2. Insufficient gas
3. Network congestion

**Solutions**:
1. Ensure you're connected with the admin wallet
2. Increase gas limit in MetaMask
3. Wait and retry

#### Web2 Phase Out of Sync

**Problem**: Web2 phase doesn't match blockchain phase.

**Solution**:
```bash
# Check current phases
curl http://localhost:5000/api/phases/current

# Manually sync Web2 to blockchain
curl -X POST http://localhost:5000/api/phases/set -H "Content-Type: application/json" -d '{"phaseNumber": 0}'
```

### Phase Management Best Practices

1. **Always advance phases in order**: Don't skip phases
2. **Verify data before advancing**: Check that all required data is registered
3. **Backup before reset**: Export important data before resetting
4. **Test thoroughly**: Use a test environment before production
5. **Monitor both systems**: Keep track of both blockchain and Web2 states

### Phase Checklist

#### Phase 0: Registration
- [ ] Students can register with credentials
- [ ] Registration data stored in Web2 database
- [ ] Wallet addresses linked to students

#### Phase 1: Candidate Registration
- [ ] Registered students can apply as candidates
- [ ] Applications stored in Web2
- [ ] Admin can review applications

#### Phase 2: Delegate Voting
- [ ] Students can vote for department delegates
- [ ] Votes recorded in Web2
- [ ] Admin can tally votes per department
- [ ] Delegates elected and stored on blockchain

#### Phase 3: Nominee Registration (Skipped in Web2)
- [ ] Admin registers council nominees on blockchain
- [ ] Minimum 7 nominees required for party registration

#### Phase 4: Party Registration
- [ ] Admin creates parties with 7 nominees
- [ ] Party data stored on blockchain
- [ ] Nominees assigned to slots

#### Phase 5: Council Voting
- [ ] Elected delegates can vote for parties
- [ ] Votes recorded in Web2
- [ ] Admin can tally final results

#### Phase 6: Results
- [ ] Results published on blockchain
- [ ] Winners displayed to all users
- [ ] Election marked as complete

### Security Considerations

1. **Admin Wallet**: Keep admin private key secure
2. **Database Access**: Restrict Web2 database access
3. **Phase Transitions**: Only admin can advance phases
4. **Data Integrity**: Contract prevents reverting past delegate voting
5. **Audit Trail**: All blockchain transactions are permanent

### Support

For issues or questions:
1. Check browser console for errors
2. Verify MetaMask connection
3. Check network (Sepolia testnet)
4. Review transaction history on Etherscan
5. Check Web2 API logs

## Contract Functions Reference

### Admin Functions

- `advancePhase()`: Move to next phase
- `resetElection()`: Reset to phase 0 (clears phase counters only)
- `addSchool(name)`: Add a school
- `addDepartment(schoolId, name, code)`: Add department to school
- `registerCouncilNominee(address, name, meanScore)`: Register council nominee
- `registerParty(name, slot0, slot1, slot2, slot3)`: Register party with nominees
- `tallyAndElectDelegate(schoolId, departmentId)`: Elect delegate for department
- `tallyCouncilVotes()`: Calculate final results and end election

### View Functions

- `currentPhase()`: Get current phase number
- `getStudentDetails(address)`: Get student info
- `getCandidateDetails(address)`: Get candidate info
- `getPartyDetails(partyId)`: Get party lineup
- `getSlotWinners(slotId)`: Get winners for council slot
