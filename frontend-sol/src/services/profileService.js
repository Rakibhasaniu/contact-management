import api from './api';

export const profileService = {
  // Get my profile
  getMyProfile: async () => {
    const response = await api.get('/profile/me');
    return response.data;
  },

  // Update my profile
  updateMyProfile: async (profileData) => {
    const response = await api.patch('/profile/me', profileData);
    return response.data;
  },
};