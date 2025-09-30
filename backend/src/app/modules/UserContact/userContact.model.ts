import { Schema, model } from 'mongoose';
import { IUserContact } from './userContact.interface';

const userContactSchema = new Schema<IUserContact>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    contactId: {
      type: Schema.Types.ObjectId,
      ref: 'Contact',
      required: true,
    },
    alias: {
      type: String,
      required: [true, 'Alias is required'],
      trim: true,
      maxlength: [100, 'Alias cannot exceed 100 characters'],
    },
    labels: {
      type: [String],
      default: [],
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userContactSchema.index({ userId: 1, contactId: 1 }, { unique: true });

userContactSchema.index({ userId: 1, alias: 'text' });

userContactSchema.index({ userId: 1, createdAt: -1 });

export const UserContact = model<IUserContact>('UserContact', userContactSchema);