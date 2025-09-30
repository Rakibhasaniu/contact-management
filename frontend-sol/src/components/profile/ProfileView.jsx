import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateProfile, clearError, clearSuccess } from '../../redux/slices/profileSlice';
import { changePassword, clearError as clearAuthError, clearSuccess as clearAuthSuccess } from '../../redux/slices/authSlice';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import Spinner from '../common/Spinner';
import { UserCircleIcon, KeyIcon } from '@heroicons/react/24/outline';

// Profile update schema
const profileSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
});

// Password change schema
const passwordSchema = yup.object().shape({
  oldPassword: yup.string().required('Current password is required'),
  newPassword: yup.string().min(6, 'Password must be at least 6 characters').required('New password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const ProfileView = () => {
  const dispatch = useDispatch();
  const { profile, loading, error, success } = useSelector((state) => state.profile);
  console.log("🚀 ~ ProfileView ~ profile:", profile)
  const { error: authError, success: authSuccess, loading: authLoading } = useSelector((state) => state.auth);
  
  const [otherEmails, setOtherEmails] = useState([]);
  const [emailInput, setEmailInput] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    setValue,
  } = useForm({
    resolver: yupResolver(profileSchema),
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setValue('firstName', profile.firstName);
      setValue('lastName', profile.lastName);
      setOtherEmails(profile.otherEmails || []);
    }
  }, [profile, setValue]);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        dispatch(clearSuccess());
      }, 3000);
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (authSuccess) {
      resetPassword();
      setShowPasswordForm(false);
      setTimeout(() => {
        dispatch(clearAuthSuccess());
      }, 3000);
    }
  }, [authSuccess, dispatch, resetPassword]);

  const onSubmitProfile = async (data) => {
    const profileData = {
      ...data,
      otherEmails: otherEmails.length > 0 ? otherEmails : [],
    };
    dispatch(updateProfile(profileData));
  };

  const onSubmitPassword = async (data) => {
    const { oldPassword, newPassword } = data;
    dispatch(changePassword({ oldPassword, newPassword }));
  };

  const handleAddEmail = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (emailInput.trim() && emailRegex.test(emailInput) && !otherEmails.includes(emailInput.trim())) {
      setOtherEmails([...otherEmails, emailInput.trim()]);
      setEmailInput('');
    }
  };

  const handleRemoveEmail = (emailToRemove) => {
    setOtherEmails(otherEmails.filter((email) => email !== emailToRemove));
  };

  if (loading && !profile) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
            {profile?.firstName?.[0]}{profile?.lastName?.[0]}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {profile?.firstName} {profile?.lastName}
            </h1>
            <p className="text-gray-600 mt-1">{profile?.userId?.email}</p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && <Alert type="error" message={error} onClose={() => dispatch(clearError())} />}
      {authError && <Alert type="error" message={authError} onClose={() => dispatch(clearAuthError())} />}
      {success && <Alert type="success" message="Profile updated successfully!" />}
      {authSuccess && <Alert type="success" message="Password changed successfully!" />}

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-2 mb-6">
          <UserCircleIcon className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
        </div>

        <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="John"
              register={registerProfile('firstName')}
              error={profileErrors.firstName?.message}
              required
            />
            <Input
              label="Last Name"
              placeholder="Doe"
              register={registerProfile('lastName')}
              error={profileErrors.lastName?.message}
              required
            />
          </div>

          {/* Primary Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Email
            </label>
            <input
              type="email"
              value={profile?.userId?.email || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Primary email cannot be changed</p>
          </div>

          {/* Other Emails */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Emails
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddEmail(e)}
                placeholder="additional@email.com"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <button
                type="button"
                onClick={handleAddEmail}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Add
              </button>
            </div>
            {otherEmails.length > 0 && (
              <div className="space-y-2">
                {otherEmails.map((email, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg"
                  >
                    <span className="text-gray-700">{email}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEmail(email)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4">
            <Button type="submit" variant="primary" loading={loading}>
              Update Profile
            </Button>
          </div>
        </form>
      </div>

      {/* Password Change Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <KeyIcon className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Change Password</h2>
          </div>
          {!showPasswordForm && (
            <Button
              variant="outline"
              onClick={() => setShowPasswordForm(true)}
            >
              Change Password
            </Button>
          )}
        </div>

        {showPasswordForm && (
          <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              register={registerPassword('oldPassword')}
              error={passwordErrors.oldPassword?.message}
              required
            />

            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              register={registerPassword('newPassword')}
              error={passwordErrors.newPassword?.message}
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              register={registerPassword('confirmPassword')}
              error={passwordErrors.confirmPassword?.message}
              required
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowPasswordForm(false);
                  resetPassword();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={authLoading}>
                Update Password
              </Button>
            </div>
          </form>
        )}

        {!showPasswordForm && (
          <p className="text-gray-600 text-sm">
            Keep your account secure by using a strong password.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileView;