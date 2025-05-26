// src/components/ContactItem.jsx
import React from 'react';

const ContactItem = ({ contact, onEdit, onDelete }) => { // Adicionada a prop onDelete
  const { id, userName, displayName, cep, street, neighborhood, city, state, complement } = contact;

  const cardStyle = {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const strongStyle = { fontWeight: '600', color: '#4A5568' };
  const displayNameStyle = { color: '#2b6cb0', fontSize: '1.25em', margin: '0 0 10px 0', borderBottom: '1px dashed #e0e0e0', paddingBottom: '8px' };
  const paragraphStyle = { margin: '0', fontSize: '0.95em', lineHeight: '1.5', color: '#718096' };

  const buttonGroupStyle = {
    marginTop: 'auto',
    paddingTop: '15px',
    display: 'flex',
    gap: '10px',
    borderTop: '1px solid #f0f0f0',
  };

  const buttonBaseStyle = {
    padding: '8px 12px',
    border: '1px solid transparent',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9em',
    fontWeight: '500',
    transition: 'opacity 0.2s ease-in-out',
  };

  const editButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: '#ffc107', // Amarelo
    color: '#212529',
    borderColor: '#ffc107',
  };

  const deleteButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: '#dc3545', // Vermelho
    color: 'white',
    borderColor: '#dc3545',
  };
  
  // Efeito de hover simples (opacidade)
  const handleMouseOver = (e) => e.target.style.opacity = '0.8';
  const handleMouseOut = (e) => e.target.style.opacity = '1';

  return (
    <li style={cardStyle}>
      <h3 style={displayNameStyle}>{displayName}</h3>
      <p style={paragraphStyle}><span style={strongStyle}>Usuário:</span> {userName}</p>
      <p style={paragraphStyle}><span style={strongStyle}>CEP:</span> {cep}</p>
      <p style={paragraphStyle}>
        <span style={strongStyle}>Endereço:</span> {street || 'N/A'}
        {complement && `, ${complement}`}
        {neighborhood && `, ${neighborhood}`}
        {city && state ? ` - ${city} / ${state}` : (city || state || '')}
      </p>
      
      <div style={buttonGroupStyle}>
        <button
          style={editButtonStyle}
          onClick={() => onEdit(id)}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          Editar Nome
        </button>
        <button
          style={deleteButtonStyle}
          onClick={() => onDelete(id)} // Chama a função onDelete passada como prop, com o id do contato
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          Excluir
        </button>
      </div>
    </li>
  );
};

export default ContactItem;