// src/components/ContactItem.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Edit3, Trash2, Home, Building2 } from 'lucide-react';

const ContactItem = ({ contact, onEdit, onDelete, index }) => {
  const { id, userName, displayName, cep, street, neighborhood, city, state, complement } = contact;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1
      }
    }
  };

  const formatAddress = () => {
    const parts = [];
    if (street) parts.push(street);
    if (complement) parts.push(complement);
    if (neighborhood) parts.push(neighborhood);
    
    const addressLine = parts.join(', ');
    const cityState = [city, state].filter(Boolean).join(' / ');
    
    return { addressLine, cityState };
  };

  const { addressLine, cityState } = formatAddress();

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4 }}
      className="contact-card"
    >
      <div className="contact-header">
        <div className="contact-name-section">
          <h3 className="contact-name">{displayName}</h3>
          <div className="contact-info-item">
            <User size={16} />
            <span>{userName}</span>
          </div>
        </div>
        
        <div className="contact-actions">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-secondary btn-sm"
            onClick={() => onEdit(id)}
            title="Editar nome de exibição"
          >
            <Edit3 size={16} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(id)}
            title="Excluir contato"
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
      </div>

      <div className="contact-info">
        {cep && (
          <div className="contact-info-item">
            <MapPin size={16} />
            <span>CEP: {cep}</span>
          </div>
        )}
        
        {addressLine && (
          <div className="contact-info-item">
            <Home size={16} />
            <span>{addressLine}</span>
          </div>
        )}
        
        {cityState && (
          <div className="contact-info-item">
            <Building2 size={16} />
            <span>{cityState}</span>
          </div>
        )}
        
        {!cep && !addressLine && !cityState && (
          <div className="contact-info-item empty-address">
            <MapPin size={16} />
            <span>Endereço não informado</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ContactItem;