/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { Contact } from '../Contact/contact.model';
import { isValidPhoneNumber, normalizePhoneNumber } from '../Contact/contact.utils';
import {
  IAddContact,
  ISearchContactsQuery,
  IUpdateContact,
} from './userContact.interface';
import { UserContact } from './userContact.model';

const addContact = async (userId: string, payload: IAddContact) => {
  const { phoneNumber, alias, labels, notes } = payload;

  // Validate phone number
  if (!isValidPhoneNumber(phoneNumber)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Invalid phone number format. Must be at least 10 digits.'
    );
  }

  const normalizedPhone = normalizePhoneNumber(phoneNumber);
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Step 1: Upsert global contact
    let contact = await Contact.findOne({ normalizedPhone }).session(session);

    if (!contact) {
      const [newContact] = await Contact.create(
        [
          {
            phoneNumber,
            normalizedPhone,
          },
        ],
        { session }
      );
      contact = newContact;
    }

    // Step 2: Check if user already has this contact
    const existingUserContact = await UserContact.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      contactId: contact._id,
    }).session(session);

    if (existingUserContact) {
      await session.abortTransaction();
      throw new AppError(
        httpStatus.CONFLICT,
        'You have already added this contact. You can update it instead.'
      );
    }

    // Step 3: Create user-contact link
    const [userContact] = await UserContact.create(
      [
        {
          userId: new mongoose.Types.ObjectId(userId),
          contactId: contact._id,
          alias,
          labels: labels || [],
          notes: notes || '',
        },
      ],
      { session }
    );

    await session.commitTransaction();

    // Return with populated contact details
    const result = await UserContact.findById(userContact._id).populate('contactId');
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getMyContacts = async (userId: string, query: ISearchContactsQuery) => {
  const { search, searchBy = 'both', page = 1, limit = 20 } = query;

  const skip = (Number(page) - 1) * Number(limit);

  // Build aggregation pipeline
  const pipeline: mongoose.PipelineStage[] = [
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: 'contacts',
        localField: 'contactId',
        foreignField: '_id',
        as: 'contact',
      },
    },
    {
      $unwind: '$contact',
    },
  ];

  // Add search filters if provided
  if (search) {
    const searchConditions: any[] = [];

    if (searchBy === 'alias' || searchBy === 'both') {
      searchConditions.push({
        alias: { $regex: search, $options: 'i' },
      });
    }

    if (searchBy === 'phone' || searchBy === 'both') {
      searchConditions.push(
        { 'contact.phoneNumber': { $regex: search, $options: 'i' } },
        { 'contact.normalizedPhone': { $regex: search, $options: 'i' } }
      );
    }

    pipeline.push({
      $match: {
        $or: searchConditions,
      },
    });
  }

  // Add sorting, pagination, and projection
  pipeline.push(
    {
      $sort: { createdAt: -1 },
    },
    {
      $facet: {
        metadata: [{ $count: 'total' }],
        data: [
          { $skip: skip },
          { $limit: Number(limit) },
          {
            $project: {
              _id: 1,
              alias: 1,
              labels: 1,
              notes: 1,
              createdAt: 1,
              updatedAt: 1,
              contact: {
                _id: 1,
                phoneNumber: 1,
                normalizedPhone: 1,
              },
            },
          },
        ],
      },
    }
  );

  const result = await UserContact.aggregate(pipeline);

  const total = result[0]?.metadata[0]?.total || 0;
  const contacts = result[0]?.data || [];

  return {
    contacts,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

const updateMyContact = async (
  userId: string,
  userContactId: string,
  payload: IUpdateContact
) => {
  const userContact = await UserContact.findOne({
    _id: new mongoose.Types.ObjectId(userContactId),
    userId: new mongoose.Types.ObjectId(userId),
  });

  if (!userContact) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Contact not found or you do not have permission to update it'
    );
  }

  const updatedContact = await UserContact.findByIdAndUpdate(
    userContactId,
    payload,
    { new: true, runValidators: true }
  ).populate('contactId');

  return updatedContact;
};

const deleteMyContact = async (userId: string, userContactId: string) => {
  const userContact = await UserContact.findOne({
    _id: new mongoose.Types.ObjectId(userContactId),
    userId: new mongoose.Types.ObjectId(userId),
  });

  if (!userContact) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Contact not found or you do not have permission to delete it'
    );
  }

  await UserContact.findByIdAndDelete(userContactId);

  return { message: 'Contact deleted successfully' };
};

const searchContacts = async (userId: string, query: ISearchContactsQuery) => {
  return await getMyContacts(userId, query);
};

export const UserContactServices = {
  addContact,
  getMyContacts,
  updateMyContact,
  deleteMyContact,
  searchContacts,
};