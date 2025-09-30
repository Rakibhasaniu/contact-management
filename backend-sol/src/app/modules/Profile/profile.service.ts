/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { IProfile } from './profile.interface';
import { Profile } from './profile.model';

const getProfileByUserId = async (userId: string) => {
  const profile = await Profile.findOne({ 
    userId: new mongoose.Types.ObjectId(userId) 
  }).populate('userId', 'email');;

  if (!profile) {
    throw new AppError(httpStatus.NOT_FOUND, 'Profile not found');
  }

  return profile;
};

const updateProfile = async (
  userId: string,
  payload: Partial<IProfile>
) => {
  const { userId: _userId, contacts, ...updateData } = payload as any;

  const profile = await Profile.findOneAndUpdate(
    { userId: new mongoose.Types.ObjectId(userId) },
    updateData,
    { new: true, runValidators: true }
  );

  if (!profile) {
    throw new AppError(httpStatus.NOT_FOUND, 'Profile not found');
  }

  return profile;
};

export const ProfileServices = {
  getProfileByUserId,
  updateProfile,
};