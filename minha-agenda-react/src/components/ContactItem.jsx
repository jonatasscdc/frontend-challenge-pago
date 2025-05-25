// src/components/ContactItem.jsx
import React from 'react';

const ContactItem = ({ userName, displayName, cep, street, neighborhood, city, state }) => {
  // Estilos inline simples para o card do contato
  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const strongStyle = {
    fontWeight: 'bold'
  };

  return (
    <div style={cardStyle}>
      <h3>{displayName}</h3>
      <p><span style={strongStyle}>Usuário:</span> {userName}</p>
      <p><span style={strongStyle}>CEP:</span> {cep}</p>
      <p><span style={strongStyle}>Endereço:</span> {street}, {neighborhood}, {city} - {state}</p>
      {/* Futuramente, adicionaremos botões de Editar e Excluir aqui */}
    </div>
  );
};

export default ContactItem;