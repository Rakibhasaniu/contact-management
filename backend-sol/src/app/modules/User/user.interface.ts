/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  password: string;
  profileId?: Types.ObjectId;
  needsPasswordChange?: boolean;
  passwordChangedAt?: Date;
  status: 'active' | 'blocked';
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  isPasswordMatched(plainTextPassword: string, hashedPassword: string): Promise<boolean>;
}

export interface UserModel extends Model<IUser, {}, IUserMethods> {
  isUserExistsByEmail(email: string): Promise<IUser | null>;
  isPasswordMatched(plainTextPassword: string, hashedPassword: string): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number
  ): boolean;
}