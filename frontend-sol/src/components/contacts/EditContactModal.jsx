import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { updateContact, fetchContacts, clearError } from '../../redux/slices/contactSlice';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';

// Validation schema
const schema = yup.object().shape({
  alias: yup.string().required('Name/Alias is required'),
  notes: yup.string(),
});

const EditContactModal = ({ isOpen, onClose, contact }) => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.contacts);
  const [labels, setLabels] = useState(contact.labels || []);
  const [labelInput, setLabelInput] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (contact) {
      setValue('alias', contact.alias);
      setValue('notes', contact.notes || '');
      setLabels(contact.labels || []);
    }
  }, [contact, setValue]);

  useEffect(() => {
    if (success && isOpen) {
      dispatch(fetchContacts());
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  }, [success, isOpen, onClose, dispatch]);

  const onSubmit = async (data) => {
    const contactData = {
      ...data,
      labels: labels.length > 0 ? labels : [],
    };

    await dispatch(
      updateContact({
        contactId: contact._id,
        contactData,
      })
    );
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
    dispatch(clearError());
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Contact">
      {error && <Alert type="error" message={error} onClose={() => dispatch(clearError())} />}
      {success && <Alert type="success" message="Contact updated successfully!" />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        {/* Phone Number (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="text"
            value={contact.phoneNumber}
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">Phone number cannot be changed</p>
        </div>

        <Input
          label="Name/Alias"
          placeholder="John Doe"
          register={register('alias')}
          error={errors.alias?.message}
          required
        />

        {/* Labels */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Labels</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
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
            Update Contact
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditContactModal;