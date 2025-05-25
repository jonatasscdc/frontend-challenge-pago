// src/components/ContactItem.jsx
import React from 'react';

const ContactItem = ({ contact }) => {
  // Desestrutura os campos necessários do objeto contact
  const { userName, displayName, cep, street, neighborhood, city, state, complement } = contact;

  // Estilos para o card do contato
  const cardStyle = {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px', // Espaçamento entre os parágrafos dentro do card
  };

  const strongStyle = {
    fontWeight: '600', // Um pouco mais forte
    color: '#4A5568', // Um cinza mais escuro
  };

  const displayNameStyle = {
    color: '#2b6cb0', // Um azul mais sóbrio
    fontSize: '1.25em', // Um pouco maior
    margin: '0 0 10px 0', // Ajuste de margem
    borderBottom: '1px dashed #e0e0e0',
    paddingBottom: '8px',
  };

  const paragraphStyle = {
    margin: '0',
    fontSize: '0.95em',
    lineHeight: '1.5',
    color: '#718096', // Um cinza mais claro para o texto
  };

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
      {/* Futuramente, botões de Editar e Excluir virão aqui */}
      {/* Exemplo:
        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
          <button>Editar</button>
          <button>Excluir</button>
        </div>
      */}
    </li>
  );
};

export default ContactItem;