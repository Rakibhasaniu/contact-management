
export const normalizePhoneNumber = (phoneNumber: string): string => {
  let normalized = phoneNumber.replace(/[^\d+]/g, '');

  normalized = normalized.replace(/^0+/, '');

  if (!normalized.startsWith('+')) {
    normalized = `+880${normalized}`;
  }

  return normalized;
};


export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  const normalized = normalizePhoneNumber(phoneNumber);
  // Remove + and check if at least 10 digits remain
  const digitsOnly = normalized.replace(/\+/g, '');
  return digitsOnly.length >= 10;
};