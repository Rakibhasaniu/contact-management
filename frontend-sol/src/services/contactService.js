import api from './api';

export const contactService = {
  // Get all contacts
  getAllContacts: async (params = {}) => {
    const response = await api.get('/contacts', { params });
    return response.data;
  },

  // Search contacts
  searchContacts: async (searchBy, searchTerm) => {
    const response = await api.get('/contacts', {
      params: { searchBy, search: searchTerm },
    });
    return response.data;
  },

  // Add new contact
  addContact: async (contactData) => {
    const response = await api.post('/contacts', contactData);
    return response.data;
  },

  // Update contact
  updateContact: async (contactId, contactData) => {
    const response = await api.patch(`/contacts/${contactId}`, contactData);
    return response.data;
  },

  // Delete contact
  deleteContact: async (contactId) => {
    const response = await api.delete(`/contacts/${contactId}`);
    return response.data;
  },
};