import React from 'react';
import { PhoneIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const ContactCard = ({ contact, onEdit, onDelete }) => {
  const phoneNumber = contact.contact?.phoneNumber || contact.phoneNumber;
  const alias = contact.alias;
  const labels = contact.labels || [];
  const notes = contact.notes || '';
  const createdAt = contact.createdAt;

  const getInitials = (alias) => {
    if (!alias) return '?';
    const names = alias.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return alias.substring(0, 2).toUpperCase();
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return 'N/A';
    // Simple formatting: 01234 567890
    if (phone.startsWith('0')) {
      return phone.replace(/(\d{5})(\d{6})/, '$1 $2');
    }
    return phone;
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100 flex flex-col h-full">
      {/* Header Section - Fixed Height */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {getInitials(alias)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-gray-800 truncate">{alias}</h3>
            <div className="flex items-center text-gray-600 text-sm mt-1">
              <PhoneIcon className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="truncate">{formatPhoneNumber(phoneNumber)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Labels Section - Fixed Minimum Height */}
      <div className="mb-3 min-h-[28px]">
        {labels && labels.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {labels.map((label, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
              >
                {label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Notes Section - Flexible Height with Fixed Maximum */}
      <div className="flex-1 mb-4 min-h-[40px]">
        {notes && (
          <p className="text-gray-600 text-sm line-clamp-2">{notes}</p>
        )}
      </div>

      {/* Actions Section - Fixed at Bottom */}
      <div className="mt-auto">
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          <button
            onClick={() => onEdit(contact)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
          >
            <PencilIcon className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(contact._id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
          >
            <TrashIcon className="h-4 w-4" />
            Delete
          </button>
        </div>

        {/* Timestamp */}
        {createdAt && (
          <div className="text-xs text-gray-400 mt-3 text-center">
            Added {new Date(createdAt).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactCard;