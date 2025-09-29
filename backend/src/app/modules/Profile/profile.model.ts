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
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    otherEmails: {
      type: [String],
      default: [],
      validate: {
        validator: function (emails: string[]) {
          return emails.every(email => /^\S+@\S+\.\S+$/.test(email));
        },
        message: 'All emails must be valid',
      },
    },
    contacts: {
      type: [
        {
          phoneNumber: { type: String, required: true },
          alias: { type: String, required: true },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes
profileSchema.index({ userId: 1 });
profileSchema.index({ firstName: 1, lastName: 1 });

export const Profile = model<IProfile>('Profile', profileSchema);