import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContacts, deleteContact, clearError, clearSuccess } from '../../redux/slices/contactSlice';
import ContactCard from './ContactCard';
import ContactSearch from './ContactSearch';
import AddContactModal from './AddContactModal';
import EditContactModal from './EditContactModal';
import Button from '../common/Button';
import Alert from '../common/Alert';
import Spinner from '../common/Spinner';
import { PlusIcon } from '@heroicons/react/24/outline';

const ContactList = () => {
  const dispatch = useDispatch();
  const { contacts, loading, error, success, searchResults, isSearching } = useSelector(
    (state) => state.contacts
  );
  console.log("🚀 ~ ContactList ~ contacts:", contacts)

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        dispatch(clearSuccess());
      }, 3000);
    }
  }, [success, dispatch]);

  const handleEdit = (contact) => {
    setSelectedContact(contact);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      await dispatch(deleteContact(contactId));
      dispatch(fetchContacts());
    }
  };

  const handleSearchResults = (hasResults) => {
    setShowSearchResults(hasResults);
  };

  const displayContacts = showSearchResults ? searchResults : contacts;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Contacts</h1>
          <p className="text-gray-600 mt-1">
            {contacts.length} contact{contacts.length !== 1 ? 's' : ''} in your address book
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Add Contact
        </Button>
      </div>

      {/* Search Section */}
      <ContactSearch onSearchResults={handleSearchResults} />

      {/* Alerts */}
      {error && (
        <Alert type="error" message={error} onClose={() => dispatch(clearError())} />
      )}

      {success && <Alert type="success" message="Operation completed successfully!" />}

      {/* Loading State */}
      {loading && !isSearching && (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {/* Empty State */}
      {!loading && !isSearching && displayContacts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-24 w-24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {showSearchResults ? 'No contacts found' : 'No contacts yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {showSearchResults
              ? 'Try a different search term'
              : 'Get started by adding your first contact'}
          </p>
          {!showSearchResults && (
            <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
              Add Your First Contact
            </Button>
          )}
        </div>
      )}

      {/* Contact Grid */}
      {!loading && !isSearching && displayContacts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayContacts.map((contact) => (
            <ContactCard
              key={contact._id}
              contact={contact}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AddContactModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {selectedContact && (
        <EditContactModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedContact(null);
          }}
          contact={selectedContact}
        />
      )}
    </div>
  );
};

export default ContactList;