// src/App.jsx
import React, { useState } from 'react';
import './App.css'; // Você pode adicionar estilos globais aqui, se necessário
import Header from './components/Header';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList'; // Importando ContactList

function App() {
  const appTitle = "Minha Agenda de Endereços";
  const appSubtitle = "Gerencie seus contatos facilmente!";

  // Estado para a lista de contatos
  const [contacts, setContacts] = useState([]);

  const addContactHandler = (newContactData) => {
    const contactWithId = {
      ...newContactData,
      id: crypto.randomUUID(),
    };

    setContacts(prevContacts => {
      const updatedContacts = [...prevContacts, contactWithId];
      console.log('App.jsx: Lista de contatos atualizada:', updatedContacts);
      return updatedContacts;
    });
  };

  return (
    <div>
      <Header
        title={appTitle}
        subtitle={appSubtitle}
      />
      <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <ContactForm onAddContact={addContactHandler} />
        
        <hr style={{ margin: '30px 0', borderColor: '#eee' }} />

        <h2 style={{ color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>
          Meus Contatos
        </h2>
        {contacts.length === 0 ? (
          <p style={{ fontStyle: 'italic', color: '#777' }}>Nenhum contato adicionado ainda.</p>
        ) : (
          <ContactList contacts={contacts} />
        )}

        {/* Para debug: Exibe a lista de contatos na tela */}
        {/* Descomente a linha abaixo para ver os dados da lista durante o desenvolvimento */}
        {/* <pre style={{ backgroundColor: '#f4f4f4', border: '1px solid #ddd', padding: '10px', borderRadius: '4px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          {JSON.stringify(contacts, null, 2)}
        </pre> */}
      </main>
    </div>
  );
}

export default App;