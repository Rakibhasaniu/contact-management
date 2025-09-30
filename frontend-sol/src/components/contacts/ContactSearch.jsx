import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchContacts, fetchContacts, clearSearchResults } from '../../redux/slices/contactSlice';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../common/Button';
import Spinner from '../common/Spinner';

const ContactSearch = ({ onSearchResults }) => {
  const dispatch = useDispatch();
  const { isSearching } = useSelector((state) => state.contacts);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('alias');

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      return;
    }

    await dispatch(searchContacts({ searchBy, searchTerm: searchTerm.trim() }));
    onSearchResults(true);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    dispatch(clearSearchResults());
    dispatch(fetchContacts());
    onSearchResults(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Type Selector */}
          <div className="sm:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search By
            </label>
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="alias">Name/Alias</option>
              <option value="phone">Phone Number</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Term
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchBy === 'alias' ? 'Enter name...' : 'Enter phone number...'}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 items-end">
            <Button
              type="submit"
              variant="primary"
              disabled={isSearching || !searchTerm.trim()}
              className="px-6"
            >
              {isSearching ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <MagnifyingGlassIcon className="h-5 w-5 mr-2 inline" />
                  Search
                </>
              )}
            </Button>
            
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="Clear search"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Search Tips */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <strong>Tip:</strong> Search by alias shows only your personal names. Search by phone 
          number finds the contact with your assigned alias.
        </div>
      </form>
    </div>
  );
};

export default ContactSearch;