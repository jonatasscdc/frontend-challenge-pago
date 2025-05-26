// src/components/Header.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Sparkles } from 'lucide-react';

const Header = ({ title, subtitle }) => {
  return (
    <motion.header 
      className="modern-header"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        style={{ marginBottom: '1rem' }}
      >
        <Users size={48} style={{ color: '#ffffff' }} />
      </motion.div>
      
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        {title}
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <Sparkles size={16} style={{ display: 'inline', marginRight: '0.5rem', color: '#ffffff' }} />
        {subtitle}
      </motion.p>
    </motion.header>
  );
};

export default Header;