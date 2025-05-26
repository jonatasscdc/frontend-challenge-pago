// src/components/ContactList.jsx
import React from 'react';
import ContactItem from './ContactItem';

const ContactList = ({ contacts, onEditContact, onDeleteContact }) => { // Adicionada a prop onDeleteContact
  if (!contacts || contacts.length === 0) {
    return null;
  }

  const listStyle = {
    listStyleType: 'none',
    padding: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  };

  return (
    <ul style={listStyle}>
      {contacts.map(contact => (
        <ContactItem
          key={contact.id}
          contact={contact}
          onEdit={onEditContact}
          onDelete={onDeleteContact} // Passando a função de exclusão para cada ContactItem
        />
      ))}
    </ul>
  );
};

export default ContactList;