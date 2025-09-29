import { Types } from 'mongoose';

export interface IUserContact {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  contactId: Types.ObjectId;
  alias: string;
  labels?: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserContactWithDetails extends IUserContact {
  contact?: {
    _id: Types.ObjectId;
    phoneNumber: string;
    normalizedPhone: string;
  };
}

export interface IAddContact {
  phoneNumber: string;
  alias: string;
  labels?: string[];
  notes?: string;
}

export interface IUpdateContact {
  alias?: string;
  labels?: string[];
  notes?: string;
}

export interface ISearchContactsQuery {
  search?: string;
  searchBy?: 'alias' | 'phone' | 'both';
  page?: number;
  limit?: number;
}