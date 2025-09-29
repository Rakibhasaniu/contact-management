import httpStatus from 'http-status';
import { ProfileServices } from './profile.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const createProfile = catchAsync(async (req, res) => {
  const result = await ProfileServices.createProfile(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile created successfully',
    data: result,
  });
});

const getProfile = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await ProfileServices.getProfile(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile retrieved successfully',
    data: result,
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await ProfileServices.updateProfile(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  });
});

export const ProfileControllers = {
  createProfile,
  getProfile,
  updateProfile,
};