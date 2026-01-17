# How to Reset the Election

If you're currently in Council Voting (Phase 5) or any other phase and want to restart the entire election, follow these steps:

## Step 1: Reset the Database

Run the reset script to clear all election data from MongoDB:

```bash
cd databaseBackend/scripts
node resetElection.js
```

This script will:
- ✅ Delete all delegate votes
- ✅ Delete all council votes  
- ✅ Delete all general votes
- ✅ Delete all delegate candidates
- ✅ Delete all general candidates
- ✅ Delete all elected delegates
- ✅ Delete all parties
- ✅ Reset student voting status (keeps students but clears their voting flags)
- ✅ Reset phase to 0 (Registration)

**Note:** This script keeps students, schools, and departments in the database. Only election-related data is cleared.

## Step 2: Reset the Blockchain

After clearing the database, reset the blockchain state:

1. Go to the **Admin Dashboard** in your frontend
2. Click the **"🔄 Reset Election"** button
3. Confirm the action in the popup
4. Wait for the blockchain transaction to complete

This will:
- ✅ Reset the smart contract phase to Registration (Phase 0)
- ✅ Reset candidate and party counters
- ✅ Clear phase end times

## Step 3: Verify Reset

After both steps are complete:

1. Check that the phase shows as "Phase 0: Student Registration"
2. Verify that no votes, candidates, or parties exist
3. Students can now register again and start fresh

## Important Notes

⚠️ **This action cannot be undone!** All election data will be permanently deleted.

⚠️ **Students are NOT deleted** - only their voting status is reset. They can participate in the new election.

⚠️ **Schools and Departments are NOT deleted** - the organizational structure remains intact.

## Alternative: Partial Reset

If you only want to reset certain aspects:

### Reset Only Votes
```javascript
// In MongoDB or via script
await DelegateVote.deleteMany({});
await CouncilVote.deleteMany({});
await Vote.deleteMany({});
```

### Reset Only Candidates
```javascript
await DelegateCandidate.deleteMany({});
await Candidate.deleteMany({});
```

### Reset Phase Only
```bash
cd databaseBackend/scripts
node setPhase.js 0
```

## Troubleshooting

If you encounter issues:

1. **Database connection error**: Make sure MongoDB is running and `.env` file has correct `DATABASE_URL`
2. **Blockchain reset fails**: Ensure you're connected with the admin wallet
3. **Phase doesn't reset**: Check both database and blockchain phase separately

## Quick Reset Command

For a complete reset in one go:

```bash
# Terminal 1: Reset database
cd databaseBackend/scripts && node resetElection.js

# Then in Admin Dashboard: Click "Reset Election" button
```

