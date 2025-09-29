import { Types } from 'mongoose';

export interface IContact {
  _id: Types.ObjectId;
  phoneNumber: string;
  normalizedPhone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateContact {
  phoneNumber: string;
  normalizedPhone: string;
}