import { Schema, model } from 'mongoose';
import { TContact } from './contact.interface';

const contactSchema = new Schema<TContact>(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    normalizedPhone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster search
contactSchema.index({ normalizedPhone: 1 });
contactSchema.index({ phoneNumber: 1 });

export const Contact = model<TContact>('Contact', contactSchema);