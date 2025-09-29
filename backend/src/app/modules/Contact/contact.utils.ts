/**
 * Normalize phone number for consistent storage and comparison
 * Rules:
 * 1. Remove all spaces, dashes, parentheses
 * 2. Remove leading zeros
 * 3. Add country code if missing (default: +880 for Bangladesh)
 */
export const normalizePhoneNumber = (phoneNumber: string): string => {
  // Remove all non-digit characters except +
  let normalized = phoneNumber.replace(/[^\d+]/g, '');

  // Remove leading zeros
  normalized = normalized.replace(/^0+/, '');

  // If doesn't start with +, add default country code
  if (!normalized.startsWith('+')) {
    // Assume Bangladesh country code if no country code present
    normalized = `+880${normalized}`;
  }

  return normalized;
};

/**
 * Validate phone number format
 * Minimum 10 digits after normalization
 */
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  const normalized = normalizePhoneNumber(phoneNumber);
  // Remove + and check if at least 10 digits remain
  const digitsOnly = normalized.replace(/\+/g, '');
  return digitsOnly.length >= 10;
};