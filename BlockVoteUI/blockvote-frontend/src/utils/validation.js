export const validateRegistrationNumber = (regNumber, departmentCode) => {
  if (!regNumber) return 'Registration number is required';
  if (!regNumber.startsWith(departmentCode)) {
    return `Registration number must start with ${departmentCode}`;
  }
  return null;
};

export const validateMeanScore = (score) => {
  const numScore = parseFloat(score);
  if (isNaN(numScore)) return 'Mean score must be a number';
  if (numScore < 0 || numScore > 100) return 'Mean score must be between 0 and 100';
  return null;
};

export const validateEthereumAddress = (address) => {
  if (!address) return 'Address is required';
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) return 'Invalid Ethereum address';
  return null;
};

export const validateName = (name) => {
  if (!name?.trim()) return 'Name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  return null;
};