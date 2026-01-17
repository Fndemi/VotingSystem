# BlockVote Frontend

A modern, responsive React frontend for the BlockVote decentralized voting system built with Vite, Wagmi, and Tailwind CSS.

## Features

- 🔗 **Wallet Integration**: Connect with MetaMask and other Web3 wallets
- 🗳️ **Multi-Phase Voting**: Support for registration, delegate voting, and council voting
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🎨 **Modern UI**: Glass morphism design with smooth animations
- ⚡ **Fast Performance**: Built with Vite for lightning-fast development and builds
- 🔒 **Secure**: Direct smart contract interaction with proper error handling

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet
- Sepolia testnet ETH for transactions

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd blockvote-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** to `http://localhost:5173`

### Network Configuration

Make sure your wallet is configured for Sepolia testnet:
- **Network Name**: Sepolia
- **Chain ID**: 11155111
- **RPC URL**: https://sepolia.infura.io/v3/YOUR_KEY
- **Currency Symbol**: ETH

### Get Test ETH

Get Sepolia ETH from these faucets:
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Alchemy Faucet](https://sepoliafaucet.com/)

## Project Structure

```
src/
├── components/          # React components
│   ├── ModernNavbar.jsx    # Navigation with wallet connection
│   ├── ModernCard.jsx      # Reusable card components
│   ├── RegistrationForm.jsx # Voter registration
│   ├── DelegateVoting.jsx  # Delegate voting interface
│   ├── CouncilVoting.jsx   # Council voting interface
│   ├── Results.jsx         # Election results
│   └── Admin.jsx           # Admin panel
├── constants/           # Contract configuration
│   └── contract.js         # Contract address and ABI
├── abi/                # Smart contract ABI
│   └── Blockvote.json     # Contract ABI file
├── App.jsx             # Main application component
├── main.jsx            # Application entry point
└── index.css           # Global styles and Tailwind config
```

## Key Components

### ModernNavbar
- Wallet connection/disconnection
- Network status indicator
- Current voting phase display
- Responsive design for mobile/desktop

### Voting Components
- **RegistrationForm**: Student voter registration
- **DelegateVoting**: Vote for department delegates
- **CouncilVoting**: Vote for council positions
- **Results**: View election results

### Admin Panel
- Phase management
- Candidate registration
- Election oversight

## Smart Contract Integration

The frontend connects to the BlockVote smart contract deployed on Sepolia:

- **Contract Address**: `0xEfA783fAe29F03a89e02426D6328E480a7a4d4Bc`
- **Network**: Sepolia Testnet
- **ABI**: Located in `src/abi/Blockvote.json`

## Voting Phases

1. **Registration** (Phase 0): Students register to vote
2. **Candidate Registration** (Phase 1): Admin registers candidates
3. **Delegate Voting** (Phase 2): Students vote for department delegates
4. **Nominee Registration** (Phase 3): Admin registers council nominees
5. **Party Registration** (Phase 4): Admin creates party lineups
6. **Council Voting** (Phase 5): Delegates vote for council positions
7. **Results** (Phase 6): View final election results

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

Create a `.env` file (optional):
```env
VITE_CONTRACT_ADDRESS=0xEfA783fAe29F03a89e02426D6328E480a7a4d4Bc
VITE_CHAIN_ID=11155111
```

## Troubleshooting

### Common Issues

1. **Wallet Connection Issues**
   - Ensure MetaMask is installed and unlocked
   - Switch to Sepolia testnet
   - Refresh the page

2. **Transaction Failures**
   - Check you have sufficient Sepolia ETH
   - Verify you're in the correct voting phase
   - Ensure you meet eligibility requirements

3. **Contract Interaction Errors**
   - Confirm contract address is correct
   - Check network connection
   - Verify ABI is up to date

4. **Admin Dashboard Issues**
   - **MetaMask triggering repeatedly**: This has been optimized. Contract reads now only happen when needed and are throttled to every 10 seconds.
   - **Phase not advancing**: Ensure you're connected with the admin wallet and have sufficient gas.
   - **Reset functionality**: The admin can now reset the election at any phase using either the "Reset Election" button (full reset) or "Revert to Phase" button (partial revert).

5. **Phase Synchronization Issues**
   - **Web2 phase out of sync**: Use the reset utility script:
     ```bash
     node src/utils/resetPhase.js
     ```
   - **Blockchain phase stuck**: Contact admin to reset via smart contract

6. **After Election Reset**
   - Election can now be reset at any phase without restrictions
   - Use "Reset Election" for a complete reset to phase 0
   - Use "Revert to Phase" to go back to any previous phase
   - Student registrations are kept during resets (by design)
   - You may need to manually clear Web2 database for a complete reset
   - See `ADMIN_GUIDE.md` for detailed reset procedures

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Verify your wallet is connected to Sepolia
3. Ensure you have test ETH for transactions
4. Check that you're in the correct voting phase

## Technology Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript interface for Ethereum
- **Tailwind CSS** - Utility-first CSS framework
- **TanStack Query** - Data fetching and caching

## License

MIT License - see LICENSE file for details.