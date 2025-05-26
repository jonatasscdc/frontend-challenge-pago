// src/components/ContactFilters.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, User, MapPin, Building, X } from 'lucide-react';

const ContactFilters = ({
  filterValues,
  onFilterChange,
  searchTerm,
  onSearchChange,
}) => {
  const handleFilterInputChange = (event) => {
    const { name, value } = event.target;
    onFilterChange(name, value);
  };

  const removeFilter = (filterName) => {
    onFilterChange(filterName, '');
  };

  const removeSearchTerm = () => {
    onSearchChange({ target: { value: '' } });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="filters-section"
    >
      {/* Seção de Busca Rápida */}
      <motion.div variants={itemVariants} className="search-section">
        <h3 className="section-title">
          <Search size={20} />
          Busca Rápida
        </h3>
        
        <div className="form-group">
          <label htmlFor="searchTerm" className="form-label">
            Buscar por nome de exibição
          </label>
          <div className="input-with-icon">
            <input
              type="text"
              id="searchTerm"
              name="searchTerm"
              className="form-input"
              value={searchTerm}
              onChange={onSearchChange}
              placeholder="Digite parte do nome..."
            />
            <div className="input-icon">
              <Search size={16} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Seção de Filtros Específicos */}
      <motion.div variants={itemVariants}>
        <h3 className="section-title">
          <Filter size={20} />
          Filtros Específicos
        </h3>
        
        <div className="filters-grid">
          <div className="form-group">
            <label htmlFor="filterUser" className="form-label">
              <User size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Nome de Usuário
            </label>
            <input
              type="text"
              id="filterUser"
              name="user"
              className="form-input"
              value={filterValues.user}
              onChange={handleFilterInputChange}
              placeholder="Filtrar por usuário..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="filterCity" className="form-label">
              <Building size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Cidade
            </label>
            <input
              type="text"
              id="filterCity"
              name="city"
              className="form-input"
              value={filterValues.city}
              onChange={handleFilterInputChange}
              placeholder="Filtrar por cidade..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="filterState" className="form-label">
              <MapPin size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Estado (UF)
            </label>
            <input
              type="text"
              id="filterState"
              name="state"
              className="form-input"
              value={filterValues.state}
              onChange={handleFilterInputChange}
              placeholder="Ex: SP, RJ, MG..."
              maxLength="2"
            />
          </div>
        </div>
      </motion.div>

      {/* Indicador de Filtros Ativos */}
      {(filterValues.user || filterValues.city || filterValues.state || searchTerm) && (
        <motion.div 
          variants={itemVariants}
          className="active-filters"
        >
          <div className="active-filters-title">Filtros ativos:</div>
          <div className="active-filters-list">
            {searchTerm && (
              <span className="filter-tag">
                Busca: "{searchTerm}"
                <button
                  className="filter-tag-remove"
                  onClick={removeSearchTerm}
                  title="Remover busca"
                  aria-label="Remover busca"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {filterValues.user && (
              <span className="filter-tag">
                Usuário: "{filterValues.user}"
                <button
                  className="filter-tag-remove"
                  onClick={() => removeFilter('user')}
                  title="Remover filtro de usuário"
                  aria-label="Remover filtro de usuário"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {filterValues.city && (
              <span className="filter-tag">
                Cidade: "{filterValues.city}"
                <button
                  className="filter-tag-remove"
                  onClick={() => removeFilter('city')}
                  title="Remover filtro de cidade"
                  aria-label="Remover filtro de cidade"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {filterValues.state && (
              <span className="filter-tag">
                Estado: "{filterValues.state}"
                <button
                  className="filter-tag-remove"
                  onClick={() => removeFilter('state')}
                  title="Remover filtro de estado"
                  aria-label="Remover filtro de estado"
                >
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ContactFilters;