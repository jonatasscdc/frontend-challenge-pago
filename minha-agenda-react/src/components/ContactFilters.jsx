// src/components/ContactFilters.jsx
import React from 'react';

const ContactFilters = ({
  filterValues,
  onFilterChange,
  searchTerm,
  onSearchChange,
  // Estilos definidos como defaultProps abaixo para manter o corpo do componente mais limpo
  formStyle,
  filterGroupStyle,
  individualFilterStyle,
  labelStyle,
  inputStyle,
  searchContainerStyle
}) => {

  const handleFilterInputChange = (event) => {
    const { name, value } = event.target;
    onFilterChange(name, value);
  };

  return (
    <div style={formStyle}>
      <h3 style={{ marginTop: '0', marginBottom: '20px', color: '#007bff', textAlign: 'left', fontSize: '1.2em', borderBottom: '1px solid #e0e0e0', paddingBottom: '10px' }}>
        Refinar Lista:
      </h3>
      
      {/* Filtros Estruturados */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{ marginBottom: '10px', fontWeight: 'bold', color: '#555', fontSize: '1em' }}>Filtros Específicos:</div>
        <div style={filterGroupStyle}>
          <div style={individualFilterStyle}>
            <label htmlFor="filterUser" style={labelStyle}>Por Nome de Usuário:</label>
            <input
              type="text"
              id="filterUser"
              name="user"
              value={filterValues.user}
              onChange={handleFilterInputChange}
              style={inputStyle}
              placeholder="Filtrar por usuário..."
            />
          </div>
          <div style={individualFilterStyle}>
            <label htmlFor="filterCity" style={labelStyle}>Por Cidade:</label>
            <input
              type="text"
              id="filterCity"
              name="city"
              value={filterValues.city}
              onChange={handleFilterInputChange}
              style={inputStyle}
              placeholder="Filtrar por cidade..."
            />
          </div>
          <div style={individualFilterStyle}>
            <label htmlFor="filterState" style={labelStyle}>Por Estado (UF):</label>
            <input
              type="text"
              id="filterState"
              name="state"
              value={filterValues.state}
              onChange={handleFilterInputChange}
              style={inputStyle}
              placeholder="Filtrar por UF..."
            />
          </div>
        </div>
      </div>

      {/* Campo de Busca */}
      <div style={searchContainerStyle}>
        <div style={{ marginBottom: '10px', fontWeight: 'bold', color: '#555', fontSize: '1em' }}>Busca Rápida:</div>
        <div style={individualFilterStyle}> {/* Reutilizando o estilo para consistência */}
          <label htmlFor="searchTerm" style={labelStyle}>Buscar por Nome de Exibição:</label>
          <input
            type="text"
            id="searchTerm"
            name="searchTerm"
            value={searchTerm}
            onChange={onSearchChange} // Chama diretamente a função onSearchChange do App.jsx
            style={inputStyle}
            placeholder="Digite parte do nome de exibição..."
          />
        </div>
      </div>
    </div>
  );
};

ContactFilters.defaultProps = {
  formStyle: { display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px', marginBottom: '20px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fdfdfd', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  filterGroupStyle: { display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-end' },
  individualFilterStyle: { display: 'flex', flexDirection: 'column', gap: '5px', flex: '1', minWidth: '180px' },
  labelStyle: { fontWeight: '500', fontSize: '0.9em', color: '#333', marginBottom: '3px' },
  inputStyle: { padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.95em', boxSizing: 'border-box' },
  searchContainerStyle: { marginTop: '15px', borderTop: '1px dashed #d0d0d0', paddingTop: '15px' },
};

export default ContactFilters;