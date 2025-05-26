// src/components/ContactList.jsx
import React from 'react';
import { motion } from 'framer-motion';
import ContactItem from './ContactItem';

const ContactList = ({ contacts, onEditContact, onDeleteContact }) => {
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      variants={listVariants}
      initial="hidden"
      animate="visible"
      className="contact-list"
    >
      {contacts.map((contact, index) => (
        <ContactItem
          key={contact.id}
          contact={contact}
          onEdit={onEditContact}
          onDelete={onDeleteContact}
          index={index}
        />
      ))}
    </motion.div>
  );
};

export default ContactList;