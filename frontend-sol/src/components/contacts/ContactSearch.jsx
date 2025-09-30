import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchContacts, fetchContacts, clearSearchResults } from '../../redux/slices/contactSlice';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import useDebounce from '../../hooks/useDebounce';
import Spinner from '../common/Spinner';

const ContactSearch = ({ onSearchResults }) => {
  const dispatch = useDispatch();
  const { isSearching } = useSelector((state) => state.contacts);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('alias');
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      console.log('🔍 Auto-searching for:', debouncedSearchTerm);
      dispatch(searchContacts({ searchBy, searchTerm: debouncedSearchTerm.trim() }));
      onSearchResults(true);
    } else {
      handleClearSearch();
    }
  }, [debouncedSearchTerm, searchBy, dispatch]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchTypeChange = (e) => {
    setSearchBy(e.target.value);
    if (debouncedSearchTerm.trim()) {
      dispatch(searchContacts({ 
        searchBy: e.target.value, 
        searchTerm: debouncedSearchTerm.trim() 
      }));
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    dispatch(clearSearchResults());
    dispatch(fetchContacts());
    onSearchResults(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="sm:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search By
            </label>
            <select
              value={searchBy}
              onChange={handleSearchTypeChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="alias">Name/Alias</option>
              <option value="phone">Phone Number</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Term
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder={searchBy === 'alias' ? 'Type name to search...' : 'Type phone number...'}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              
              {isSearching && (
                <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                  <Spinner size="sm" />
                </div>
              )}

              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  title="Clear search"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {searchTerm && (
          <div className="flex items-center gap-2 text-sm">
            {isSearching ? (
              <span className="text-blue-600">🔍 Searching...</span>
            ) : debouncedSearchTerm === searchTerm ? (
              <span className="text-green-600">✓ Search completed</span>
            ) : (
              <span className="text-gray-500">⏳ Typing...</span>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
          <div className="flex items-start gap-2">
            <div>
              <p>
                • Search by <strong>alias</strong> shows only your personal names<br/>
                • Search by <strong>phone number</strong> finds contacts with your assigned alias
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSearch;