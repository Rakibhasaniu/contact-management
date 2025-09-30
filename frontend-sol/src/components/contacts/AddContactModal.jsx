import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { addContact, fetchContacts, clearError } from '../../redux/slices/contactSlice';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';

// Validation schema
const schema = yup.object().shape({
  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .matches(/^[0-9+\s-()]+$/, 'Invalid phone number format'),
  alias: yup.string().required('Name/Alias is required'),
  notes: yup.string(),
});

const AddContactModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.contacts);
  const [labels, setLabels] = useState([]);
  const [labelInput, setLabelInput] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (success && isOpen) {
      reset();
      setLabels([]);
      setLabelInput('');
      dispatch(fetchContacts());
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  }, [success, isOpen, reset, onClose, dispatch]);

  const onSubmit = async (data) => {
    const contactData = {
      ...data,
      labels: labels.length > 0 ? labels : undefined,
    };

    await dispatch(addContact(contactData));
  };

  const handleAddLabel = (e) => {
    e.preventDefault();
    if (labelInput.trim() && !labels.includes(labelInput.trim())) {
      setLabels([...labels, labelInput.trim()]);
      setLabelInput('');
    }
  };

  const handleRemoveLabel = (labelToRemove) => {
    setLabels(labels.filter((label) => label !== labelToRemove));
  };

  const handleClose = () => {
    reset();
    setLabels([]);
    setLabelInput('');
    dispatch(clearError());
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Contact">
      {error && <Alert type="error" message={error} onClose={() => dispatch(clearError())} />}
      {success && <Alert type="success" message="Contact added successfully!" />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <Input
          label="Phone Number"
          placeholder="01712345678 or +8801712345678"
          register={register('phoneNumber')}
          error={errors.phoneNumber?.message}
          required
        />

        <Input
          label="Name/Alias"
          placeholder="John Doe"
          register={register('alias')}
          error={errors.alias?.message}
          required
        />

        {/* Labels */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Labels (Optional)
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={labelInput}
              onChange={(e) => setLabelInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddLabel(e)}
              placeholder="e.g., friend, family, work"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <button
              type="button"
              onClick={handleAddLabel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Add
            </button>
          </div>
          {labels.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {labels.map((label, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {label}
                  <button
                    type="button"
                    onClick={() => handleRemoveLabel(label)}
                    className="hover:text-blue-900"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            {...register('notes')}
            rows="3"
            placeholder="Additional notes about this contact..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading} className="flex-1">
            Add Contact
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddContactModal;