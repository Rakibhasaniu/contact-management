import api from './api';

export const contactService = {
  // Get all contacts
  getAllContacts: async (params = {}) => {
    const response = await api.get('/contacts', { params });
    console.log('🚀 ~ Get all contact:', response.data);
    
    // Return the response but ensure data is the contacts array
    return {
      ...response.data,
      data: response.data.data?.contacts || [] // ← Extract contacts array
    };
  },

  // Search contacts
  searchContacts: async (searchBy, searchTerm) => {
    const response = await api.get('/contacts', {
      params: { searchBy, search: searchTerm },
    });
    console.log('🚀 ~ Search response:', response.data);
    
    // Return the response but ensure data is the contacts array
    return {
      ...response.data,
      data: response.data.data?.contacts || [] // ← Extract contacts array
    };
  },

  // Rest of the methods remain the same...
  addContact: async (contactData) => {
    const response = await api.post('/contacts', contactData);
    return response.data;
  },

  updateContact: async (contactId, contactData) => {
    const response = await api.patch(`/contacts/${contactId}`, contactData);
    return response.data;
  },

  deleteContact: async (contactId) => {
    const response = await api.delete(`/contacts/${contactId}`);
    return response.data;
  },
};