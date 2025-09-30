/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearError, clearSuccess } from '../../redux/slices/authSlice';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';

// Validation schema
const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.auth);
  const [contacts, setContacts] = useState([{ phoneNumber: '', alias: '' }]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        dispatch(clearSuccess());
        navigate('/login');
      }, 2000);
    }
  }, [success, navigate, dispatch]);

  const onSubmit = async (data) => {
    const { confirmPassword, ...registerData } = data;
    
    // Filter out empty contacts
    const validContacts = contacts.filter(
      (c) => c.phoneNumber.trim() !== '' && c.alias.trim() !== ''
    );

    const payload = {
      ...registerData,
      contacts: validContacts.length > 0 ? validContacts : [],
    };

    dispatch(registerUser(payload));
  };

  const addContactField = () => {
    setContacts([...contacts, { phoneNumber: '', alias: '' }]);
  };

  const removeContactField = (index) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const updateContact = (index, field, value) => {
    const updated = [...contacts];
    updated[index][field] = value;
    setContacts(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-600 mt-2">Join ContactHub today</p>
        </div>

        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => dispatch(clearError())}
          />
        )}

        {success && (
          <Alert
            type="success"
            message="Registration successful! Redirecting to login..."
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="John"
              register={register('firstName')}
              error={errors.firstName?.message}
              required
            />
            <Input
              label="Last Name"
              placeholder="Doe"
              register={register('lastName')}
              error={errors.lastName?.message}
              required
            />
          </div>

          <Input
            label="Email"
            type="email"
            placeholder="john@example.com"
            register={register('email')}
            error={errors.email?.message}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            register={register('password')}
            error={errors.password?.message}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            register={register('confirmPassword')}
            error={errors.confirmPassword?.message}
            required
          />

          {/* Initial Contacts Section */}
          <div className="border-t pt-4 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Initial Contacts (Optional)
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addContactField}
              >
                + Add Contact
              </Button>
            </div>

            <div className="space-y-3">
              {contacts.map((contact, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={contact.phoneNumber}
                    onChange={(e) => updateContact(index, 'phoneNumber', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Name/Alias"
                    value={contact.alias}
                    onChange={(e) => updateContact(index, 'alias', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  {contacts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeContactField(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            Register
          </Button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;