export const formatVoteCount = (count) => {
  return count?.toString() || '0';
};

export const formatPercentage = (votes, total) => {
  if (!total || total === 0) return '0%';
  return `${((votes / total) * 100).toFixed(1)}%`;
};

export const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  return new Date(timestamp * 1000).toLocaleString();
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};