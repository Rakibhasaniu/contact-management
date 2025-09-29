/* eslint-disable no-useless-escape */
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

export const normalizePhoneNumber = (phoneNumber: string): string => {
  try {
    // Remove all spaces, dashes, and parentheses
    let cleaned = phoneNumber.replace(/[\s\-\(\)]/g, '');

    // If it starts with +, parse it with the library
    if (cleaned.startsWith('+')) {
      if (isValidPhoneNumber(cleaned)) {
        const parsed = parsePhoneNumber(cleaned);
        return parsed.number.toString();
      }
    }

    // If no country code, assume it's a local number and just normalize
    // Remove leading zeros for consistency
    cleaned = cleaned.replace(/^0+/, '');

    // Add + prefix if not present
    if (!cleaned.startsWith('+')) {
      // For Bangladesh numbers (assuming 880 country code for local numbers)
      if (cleaned.length === 10 || cleaned.length === 11) {
        cleaned = '+880' + cleaned;
      } else {
        cleaned = '+' + cleaned;
      }
    }

    return cleaned;
  } catch (error) {
    // If parsing fails, return basic normalization
    return phoneNumber.replace(/[\s\-\(\)]/g, '').replace(/^0+/, '');
  }
};

export const validatePhoneNumber = (phoneNumber: string): boolean => {
  try {
    const normalized = normalizePhoneNumber(phoneNumber);
    return normalized.length >= 10; // Basic validation
  } catch (error) {
    return false;
  }
};

export const formatPhoneNumber = (phoneNumber: string): string => {
  try {
    if (phoneNumber.startsWith('+') && isValidPhoneNumber(phoneNumber)) {
      const parsed = parsePhoneNumber(phoneNumber);
      return parsed.formatInternational();
    }
    return phoneNumber;
  } catch (error) {
    return phoneNumber;
  }
};