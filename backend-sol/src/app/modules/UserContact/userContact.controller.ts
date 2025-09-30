import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserContactServices } from './userContact.service';

const addContact = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await UserContactServices.addContact(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Contact added successfully',
    data: result,
  });
});

const getMyContacts = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await UserContactServices.getMyContacts(userId, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Contacts retrieved successfully',
    data: result,
  });
});

const updateMyContact = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;
  const result = await UserContactServices.updateMyContact(userId, id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Contact updated successfully',
    data: result,
  });
});

const deleteMyContact = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;
  const result = await UserContactServices.deleteMyContact(userId, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

const searchContacts = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await UserContactServices.searchContacts(userId, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Search completed successfully',
    data: result,
  });
});

export const UserContactControllers = {
  addContact,
  getMyContacts,
  updateMyContact,
  deleteMyContact,
  searchContacts,
};