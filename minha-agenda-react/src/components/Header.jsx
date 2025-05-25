// src/components/Header.jsx
import React from 'react';

const Header = ({ title, subtitle, headerStyles }) => {
  // Estilos padrão que queremos manter
  const defaultStyles = {
    backgroundColor: '#f0f0f0',
    padding: '10px 20px',
    textAlign: 'center',
    marginBottom: '20px'
  };

  return (
    // Mesclamos os estilos padrão com os headerStyles passados via props.
    // Se headerStyles tiver uma propriedade em comum com defaultStyles,
    // a de headerStyles (que vem depois) prevalecerá.
    <header style={{ ...defaultStyles, ...headerStyles }}>
      <h1>{title}</h1>
      {subtitle && <h2>{subtitle}</h2>} {/* Corrigi 'subtitles' para 'subtitle' aqui também */}
    </header>
  );
};

export default Header;