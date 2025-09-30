import React from 'react';
import Layout from '../components/layout/Layout';
import ContactList from '../components/contacts/ContactList';

const ContactsPage = () => {
  return (
    <Layout>
      <ContactList />
    </Layout>
  );
};

export default ContactsPage;