# BlockVote Frontend - Troubleshooting Guide

## Common Issues and Solutions

### 1. RainbowKit/WalletConnect Errors
**Error**: `Cannot resolve @rainbow-me/rainbowkit`
**Solution**: 
```bash
npm install @rainbow-me/rainbowkit@^2.1.0
```

### 2. Environment Variables
**Error**: Missing project ID or configuration errors
**Solution**:
1. Copy `.env.example` to `.env`
2. Get a project ID from https://cloud.walletconnect.com/
3. Update `VITE_WALLETCONNECT_PROJECT_ID` in your `.env` file

### 3. Contract Connection Issues
**Error**: Contract read/write failures
**Solution**:
- Ensure you're connected to Sepolia testnet
- Verify the contract address in `src/constants/contract.js`
- Check that your wallet has Sepolia ETH

### 4. Build/Development Issues
**Error**: Module resolution or build errors
**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
npm run dev -- --force
```

### 5. Styling Issues
**Error**: Tailwind classes not working
**Solution**:
- Ensure `@tailwind` directives are in `src/index.css`
- Check that `tailwind.config.js` is properly configured
- Restart the development server

## Installation Steps

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set up Environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

## Required Dependencies

The following dependencies should be in your `package.json`:

```json
{
  "dependencies": {
    "@rainbow-me/rainbowkit": "^2.1.0",
    "@tanstack/react-query": "^5.89.0",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "viem": "^2.37.6",
    "wagmi": "^2.17.0"
  }
}
```

## Network Configuration

Make sure your wallet is connected to:
- **Network**: Sepolia Testnet
- **Chain ID**: 11155111
- **RPC URL**: https://sepolia.infura.io/v3/YOUR_KEY (or any Sepolia RPC)

## Getting Test ETH

To interact with the contract, you'll need Sepolia ETH:
- https://sepoliafaucet.com/
- https://faucet.sepolia.dev/

## Contract Information

- **Contract Address**: `0xEfA783fAe29F03a89e02426D6328E480a7a4d4Bc`
- **Network**: Sepolia Testnet
- **ABI**: Located in `src/abi/Blockvote.json`