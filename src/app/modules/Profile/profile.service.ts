import mongoose from 'mongoose';
import { TProfile } from './profile.interface';
import { Profile } from './profile.model';
import { normalizePhoneNumber } from '../../utils/phoneNormalizer';


const createProfile = async (payload: TProfile) => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();

    // Create profile
    const profile = await Profile.create([payload], { session });

    // Process initial contacts
    if (payload.initialContacts && payload.initialContacts.length > 0) {
      for (const contact of payload.initialContacts) {
        const normalizedPhone = normalizePhoneNumber(contact.phoneNumber);
        
        // Find or create global contact
        let globalContact = await contact.findOne({ 
          normalizedPhone 
        }).session(session);
        
        if (!globalContact) {
          globalContact = await Contact.create([{
            phoneNumber: contact.phoneNumber,
            normalizedPhone,
          }], { session });
        }

        // Create user alias
        await Alias.create([{
          userId: payload.userId,
          contactId: globalContact[0]._id,
          alias: contact.alias,
        }], { session });
      }
    }

    await session.commitTransaction();
    await session.endSession();

    return profile[0];
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

const getProfile = async (userId: string) => {
  return await Profile.findOne({ userId }).populate('userId');
};

const updateProfile = async (userId: string, payload: Partial<TProfile>) => {
  return await Profile.findOneAndUpdate(
    { userId },
    payload,
    { new: true, runValidators: true }
  );
};

export const ProfileServices = {
  createProfile,
  getProfile,
  updateProfile,
};