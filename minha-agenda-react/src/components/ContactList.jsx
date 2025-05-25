// src/components/ContactList.jsx
import React from 'react';
import ContactItem from './ContactItem';

const ContactList = ({ contacts }) => {
  // A verificação de contacts.length === 0 já é feita no App.jsx,
  // então aqui podemos assumir que se o componente é renderizado, 'contacts' tem itens.
  // Mas, por segurança, manter uma verificação não faz mal.
  if (!contacts || contacts.length === 0) {
    return null; // Ou uma mensagem específica se preferir que ContactList controle isso.
  }

  const listStyle = {
    listStyleType: 'none',
    padding: 0,
    display: 'grid', // Usando grid para layout responsivo dos cards
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', // Cria colunas responsivas
    gap: '20px', // Espaço entre os cards
  };

  return (
    <ul style={listStyle}>
      {contacts.map(contact => (
        <ContactItem
          key={contact.id} // Prop 'key' é crucial para listas
          contact={contact}  // Passa o objeto de contato inteiro
        />
      ))}
    </ul>
  );
};

export default ContactList;