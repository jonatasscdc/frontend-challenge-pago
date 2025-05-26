import React from 'react';
import { motion } from 'framer-motion';
import { Users, MapPin, Building, Filter } from 'lucide-react';

const StatsCards = ({ contacts, filteredContacts }) => {
  const totalContacts = contacts.length;
  const filteredCount = filteredContacts.length;
  const isFiltered = totalContacts !== filteredCount;
  
  // Calcular estatísticas
  const citiesCount = new Set(contacts.filter(c => c.city).map(c => c.city)).size;
  const statesCount = new Set(contacts.filter(c => c.state).map(c => c.state)).size;
  const withAddressCount = contacts.filter(c => c.street || c.city).length;

  const stats = [
    {
      icon: Users,
      label: isFiltered ? 'Contatos Filtrados' : 'Total de Contatos',
      value: isFiltered ? filteredCount : totalContacts,
      color: '#667eea',
      gradient: 'var(--primary-gradient)'
    },
    {
      icon: MapPin,
      label: 'Com Endereço',
      value: withAddressCount,
      color: '#10b981',
      gradient: 'var(--success-gradient)'
    },
    {
      icon: Building,
      label: 'Cidades',
      value: citiesCount,
      color: '#f59e0b',
      gradient: 'var(--warning-gradient)'
    },
    {
      icon: Filter,
      label: 'Estados',
      value: statesCount,
      color: '#ef4444',
      gradient: 'var(--danger-gradient)'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  if (totalContacts === 0) return null;

  return (
    <div className="stats-section">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="stats-grid"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            variants={cardVariants}
            whileHover={{ y: -4 }}
            className="stat-card"
          >
            <div className="stat-icon" style={{ color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-number">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
      
      {isFiltered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="filter-info"
        >
          <Filter size={16} />
          <span>Mostrando {filteredCount} de {totalContacts} contatos</span>
        </motion.div>
      )}
    </div>
  );
};

export default StatsCards; 