import { Types } from 'mongoose';

export interface IProfileContact {
  phoneNumber: string;
  alias: string;
}

export interface IProfile {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  firstName: string;
  lastName: string;
  otherEmails?: string[];
  contacts?: IProfileContact[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateProfile {
  userId: Types.ObjectId;
  firstName: string;
  lastName: string;
  otherEmails?: string[];
  contacts?: IProfileContact[];
}