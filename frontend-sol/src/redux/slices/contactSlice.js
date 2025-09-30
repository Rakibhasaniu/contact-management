import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { contactService } from '../../services/contactService';

// Async thunks
export const fetchContacts = createAsyncThunk(
  'contacts/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await contactService.getAllContacts(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const searchContacts = createAsyncThunk(
  'contacts/search',
  async ({ searchBy, searchTerm }, { rejectWithValue }) => {
    try {
      const response = await contactService.searchContacts(searchBy, searchTerm);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addContact = createAsyncThunk(
  'contacts/add',
  async (contactData, { rejectWithValue }) => {
    try {
      const response = await contactService.addContact(contactData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateContact = createAsyncThunk(
  'contacts/update',
  async ({ contactId, contactData }, { rejectWithValue }) => {
    try {
      const response = await contactService.updateContact(contactId, contactData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteContact = createAsyncThunk(
  'contacts/delete',
  async (contactId, { rejectWithValue }) => {
    try {
      const response = await contactService.deleteContact(contactId);
      return { contactId, ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  contacts: [],
  loading: false,
  error: null,
  success: false,
  searchResults: [],
  isSearching: false,
};

// Slice
const contactSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.isSearching = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all contacts
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload.data || [];
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch contacts';
      })
      // Search contacts
      .addCase(searchContacts.pending, (state) => {
        state.isSearching = true;
        state.error = null;
      })
      .addCase(searchContacts.fulfilled, (state, action) => {
        state.isSearching = false;
        state.searchResults = action.payload.data || [];
      })
      .addCase(searchContacts.rejected, (state, action) => {
        state.isSearching = false;
        state.error = action.payload?.message || 'Search failed';
      })
      // Add contact
      .addCase(addContact.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addContact.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (action.payload.data) {
          state.contacts.unshift(action.payload.data);
        }
      })
      .addCase(addContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to add contact';
      })
      // Update contact
      .addCase(updateContact.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.contacts.findIndex(
          (c) => c._id === action.payload.data._id
        );
        if (index !== -1) {
          state.contacts[index] = action.payload.data;
        }
      })
      .addCase(updateContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update contact';
      })
      // Delete contact
      .addCase(deleteContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = state.contacts.filter(
          (c) => c._id !== action.payload.contactId
        );
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete contact';
      });
  },
});

export const { clearError, clearSuccess, clearSearchResults } = contactSlice.actions;
export default contactSlice.reducer;