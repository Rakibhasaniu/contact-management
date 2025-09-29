import { normalizePhoneNumber } from '../../utils/phoneNormalizer';
import { TContact } from './contact.interface';
import { Contact } from './contact.model';

const createContact = async (payload: TContact) => {
  const normalizedPhone = normalizePhoneNumber(payload.phoneNumber);
  
  const contact = await Contact.create({
    ...payload,
    normalizedPhone,
  });

  return contact;
};

const getContactByPhone = async (phoneNumber: string) => {
  const normalizedPhone = normalizePhoneNumber(phoneNumber);
  return await Contact.findOne({ normalizedPhone });
};

const upsertContact = async (phoneNumber: string) => {
  const normalizedPhone = normalizePhoneNumber(phoneNumber);
  
  let contact = await Contact.findOne({ normalizedPhone });
  
  if (!contact) {
    contact = await Contact.create({
      phoneNumber,
      normalizedPhone,
    });
  }
  
  return contact;
};

const searchContacts = async (searchTerm: string) => {
  // Search by phone number (exact match on normalized phone)
  const normalizedSearch = normalizePhoneNumber(searchTerm);
  
  return await Contact.find({
    $or: [
      { normalizedPhone: { $regex: normalizedSearch, $options: 'i' } },
      { phoneNumber: { $regex: searchTerm, $options: 'i' } },
    ],
    isActive: true,
  });
};

export const ContactServices = {
  createContact,
  getContactByPhone,
  upsertContact,
  searchContacts,
};