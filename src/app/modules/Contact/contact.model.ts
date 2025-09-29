import { Schema, model } from 'mongoose';
import { IContact } from './contact.interface';

const contactSchema = new Schema<IContact>(
  {
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    normalizedPhone: {
      type: String,
      required: [true, 'Normalized phone is required'],
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes
contactSchema.index({ normalizedPhone: 1 }, { unique: true });
contactSchema.index({ phoneNumber: 1 });

export const Contact = model<IContact>('Contact', contactSchema);