/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import config from '../../config';
import AppError from '../../errors/AppError';
import { Profile } from '../Profile/profile.model';
import { User } from '../User/user.model';
import { TLoginUser, TRegisterUser } from './auth.interface';
import { createToken } from './auth.utils';
import { isValidPhoneNumber, normalizePhoneNumber } from '../Contact/contact.utils';
import { Contact } from '../Contact/contact.model';
import { UserContact } from '../UserContact/userContact.model';

const registerUser = async (payload: TRegisterUser) => {
  const { email, password, firstName, lastName, otherEmails, contacts } = payload;

  const existingUser = await User.isUserExistsByEmail(email);
  if (existingUser) {
    throw new AppError(httpStatus.CONFLICT, 'User with this email already exists');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Step 1: Create User
    const [newUser] = await User.create(
      [
        {
          email,
          password,
          status: 'active',
          isDeleted: false,
        },
      ],
      { session }
    );

    // Step 2: Create Profile
    const [newProfile] = await Profile.create(
      [
        {
          userId: newUser._id,
          firstName,
          lastName,
          otherEmails: otherEmails || [],
          contacts: contacts || [], // Store initial contacts in profile
        },
      ],
      { session }
    );

    // Step 3: Link profile to user
    await User.findByIdAndUpdate(
      newUser._id,
      { profileId: newProfile._id },
      { session }
    );

    // Step 4: Process initial contacts if provided
    if (contacts && contacts.length > 0) {
      for (const contactData of contacts) {
        const { phoneNumber, alias } = contactData;

        // Validate phone number
        if (!isValidPhoneNumber(phoneNumber)) {
          console.warn(`Invalid phone number skipped during registration: ${phoneNumber}`);
          continue; // Skip invalid numbers, don't fail the entire registration
        }

        const normalizedPhone = normalizePhoneNumber(phoneNumber);

        // Upsert global contact
        let globalContact = await Contact.findOne({ normalizedPhone }).session(session);

        if (!globalContact) {
          [globalContact] = await Contact.create(
            [
              {
                phoneNumber,
                normalizedPhone,
              },
            ],
            { session }
          );
        }

        // Create user-contact link (skip if duplicate)
        try {
          await UserContact.create(
            [
              {
                userId: newUser._id,
                contactId: globalContact._id,
                alias,
                labels: [],
                notes: '',
              },
            ],
            { session }
          );
        } catch (error: any) {
          // If duplicate (same phone number twice in registration), skip
          if (error.code === 11000) {
            console.warn(`Duplicate contact skipped: ${phoneNumber}`);
            continue;
          }
          throw error;
        }
      }
    }

    await session.commitTransaction();

    const jwtPayload = {
      userId: newUser._id.toString(),
      role: 'user',
    };

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string
    );

    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as string
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: newUser._id,
        email: newUser.email,
        profile: {
          firstName: newProfile.firstName,
          lastName: newProfile.lastName,
        },
      },
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const loginUser = async (payload: TLoginUser) => {
  const { email, password } = payload;

  const user = await User.isUserExistsByEmail(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }

  if (user.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  if (!(await User.isPasswordMatched(password, user.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password does not match');
  }

  // Get profile info
  const profile = await Profile.findOne({ userId: user._id });

  const jwtPayload = {
    userId: user._id.toString(),
    role: 'user',
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
    user: {
      id: user._id,
      email: user.email,
      profile: profile
        ? {
            firstName: profile.firstName,
            lastName: profile.lastName,
          }
        : null,
    },
  };
};

const changePassword = async (
  userData: { userId: string },
  payload: { oldPassword: string; newPassword: string }
) => {
  const user = await User.findById(userData.userId).select('+password');

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }

  if (user.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  if (!(await User.isPasswordMatched(payload.oldPassword, user.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Old password does not match');
  }

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  await User.findByIdAndUpdate(userData.userId, {
    password: newHashedPassword,
    needsPasswordChange: false,
    passwordChangedAt: new Date(),
  });

  return {
    message: 'Password changed successfully',
  };
};

export const AuthServices = {
  registerUser,
  loginUser,
  changePassword,
};