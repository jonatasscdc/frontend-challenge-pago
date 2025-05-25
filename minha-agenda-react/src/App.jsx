// src/App.jsx
import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import ContactForm from './components/ContactForm';
// import ContactList from './components/ContactList'; // Deixaremos para a próxima seção

function App() {
  const appTitle = "Minha Agenda de Endereços";
  const appSubtitle = "Gerencie seus contatos facilmente!";
  // const customHeaderStyles = { // Se você ainda estiver usando, mantenha
  //   backgroundColor: 'lightblue',
  //   borderBottom: '2px solid navy'
  // };

  // Estado para a lista de contatos
  const [contacts, setContacts] = useState([]);

  const addContactHandler = (newContactData) => {
    // newContactData vem do ContactForm e já contém todos os campos preenchidos
    // (userName, displayName, cep, street, neighborhood, city, state, complement)
    const contactWithId = {
      ...newContactData,
      id: crypto.randomUUID(), // Adiciona um ID único universal
    };

    setContacts(prevContacts => {
      const updatedContacts = [...prevContacts, contactWithId];
      console.log('App.jsx: Lista de contatos atualizada:', updatedContacts); // Para debug
      return updatedContacts;
    });
  };

  return (
    <div>
      <Header
        title={appTitle}
        subtitle={appSubtitle}
        // headerStyles={customHeaderStyles} // Descomente se estiver usando
      />
      <main style={{ padding: '20px' }}>
        <ContactForm onAddContact={addContactHandler} />
        
        <hr style={{ margin: '30px 0' }} />

        <h2>Meus Contatos</h2>
        {contacts.length === 0 && (
          <p>Nenhum contato adicionado ainda.</p>
        )}

        {/* Para debug: Exibe a lista de contatos na tela */}
        {/* Você pode descomentar a linha abaixo para ver os dados */}
        {/* <pre>{JSON.stringify(contacts, null, 2)}</pre> */}

        {/* Aqui virá o <ContactList contacts={contacts} /> na próxima seção */}
      </main>
    </div>
  );
}

export default App;