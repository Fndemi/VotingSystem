# BlockVote Admin Quick Reference

## 🚀 Quick Start

1. **Login**: Connect MetaMask with admin wallet
2. **Dashboard**: View current phase and progress
3. **Advance**: Click "Advance Phase" to move forward
4. **Reset**: Click "Reset Election" to start over

## 📊 Phase Overview

| Phase | Name | Description | Admin Actions |
|-------|------|-------------|---------------|
| 0 | Registration | Students register | Monitor registrations |
| 1 | Candidate Registration | Students apply as candidates | Review applications |
| 2 | Delegate Voting | Students vote for delegates | Tally votes per department |
| 3 | Nominee Registration | Register council nominees | Register 7+ nominees |
| 4 | Party Registration | Create party lineups | Register parties |
| 5 | Council Voting | Delegates vote for council | Monitor voting |
| 6 | Results | Election complete | View results |

## ⚡ Common Tasks

### Advance to Next Phase
```
Dashboard → "Advance Phase" button → Confirm in MetaMask
```

### Reset Election
```
Dashboard → "Reset Election" button → Confirm warning → Confirm in MetaMask
```

### Register Nominees (Phase 3)
```
1. Ensure you have 7+ students to nominate
2. Use "Quick Nominee Setup" for demo data
3. Or manually enter each nominee's details
```

### Register Party (Phase 4)
```
Dashboard → "Party Registration" tab → Fill party details → Submit
```

### Tally Delegate Votes (Phase 2)
```
Enter School ID and Department ID → "Tally Votes & Elect Delegate"
```

## 🔧 Troubleshooting

### MetaMask Keeps Popping Up
- **Fixed**: Contract reads are now optimized and throttled
- Only essential data is fetched based on current phase

### Can't Advance Phase
- ✅ Check you're connected with admin wallet
- ✅ Ensure sufficient gas in wallet
- ✅ Verify you're not at phase 6 (complete)

### Reset Not Working
- ✅ Confirm in MetaMask popup
- ✅ Wait for transaction confirmation
- ✅ Web2 will auto-sync after blockchain confirms

### Phase Out of Sync
```bash
# Check current phase
curl http://localhost:5000/api/phases/current

# Reset Web2 phase
node src/utils/resetPhase.js
```

## 🛡️ Important Restrictions

1. **Cannot revert past Phase 2**: Contract prevents reverting to or before Delegate Voting phase
2. **Reset limitations**: Reset clears phase counters but keeps student/candidate data
3. **One-way progression**: Phases must advance in order (0→1→2→3→4→5→6)

## 📱 Hybrid System

- **Phase 0**: Blockchain (for security)
- **Phases 1-5**: Web2 (for flexibility)
- **Phase 6**: Blockchain (for final results)

This means:
- Phase 0→1: Requires MetaMask transaction
- Phases 1→2→3→4→5: Instant (no gas fees)
- Phase 5→6: Automatic when tallying results

## 🔐 Security Checklist

- [ ] Admin wallet private key is secure
- [ ] Only admin has access to dashboard
- [ ] MetaMask is locked when not in use
- [ ] Sepolia testnet is selected
- [ ] Contract address is verified
- [ ] Backup important data before reset

## 📞 Support

**Error Messages**:
- Check browser console (F12)
- Look for red error messages in dashboard
- Check MetaMask for transaction failures

**Network Issues**:
- Verify Sepolia testnet connection
- Check Infura/Alchemy RPC status
- Try refreshing the page

**Data Issues**:
- Verify Web2 API is running (localhost:5000)
- Check database connection
- Review API logs for errors

## 🎯 Best Practices

1. **Test First**: Use test environment before production
2. **Backup Data**: Export important data before major operations
3. **Monitor Both**: Keep track of blockchain AND Web2 states
4. **Verify Before Advancing**: Check all data is correct before moving to next phase
5. **Document Changes**: Keep notes of any manual interventions

## 📚 Additional Resources

- Full Admin Guide: `ADMIN_GUIDE.md`
- Frontend README: `README.md`
- Contract Documentation: `../Blockvote/README.md`
- API Documentation: `../backend/API.md`
