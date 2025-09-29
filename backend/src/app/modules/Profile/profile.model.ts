import { Schema, model } from 'mongoose';
import { IProfile } from './profile.interface';

const profileSchema = new Schema<IProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    otherEmails: [{
      type: String,
      trim: true,
      lowercase: true,
    }],
    initialContacts: [{
      phoneNumber: {
        type: String,
        required: true,
      },
      alias: {
        type: String,
        required: true,
        trim: true,
      },
    }],
  },
  {
    timestamps: true,
  },
);

export const Profile = model<TProfile>('Profile', profileSchema);