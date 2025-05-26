// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css'; // Estilos globais
import Header from './components/Header';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';

// Importações para react-toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const appTitle = "Minha Agenda de Endereços";
  const appSubtitle = "Gerencie seus contatos facilmente!";

  const [contacts, setContacts] = useState([]);

  // EFEITO PARA CARREGAR CONTATOS DO LOCALSTORAGE
  useEffect(() => {
    console.log("App.jsx: Efeito de CARREGAMENTO do localStorage executado.");
    const storedContacts = localStorage.getItem('contacts');
    if (storedContacts) {
      try {
        const parsedContacts = JSON.parse(storedContacts);
        if (Array.isArray(parsedContacts)) {
          setContacts(parsedContacts);
          console.log("App.jsx: Contatos carregados do localStorage:", parsedContacts);
        } else {
          console.warn("App.jsx: Dados do localStorage não são um array. Resetando.");
          localStorage.removeItem('contacts');
          setContacts([]);
        }
      } catch (error) {
        console.error("App.jsx: Erro ao parsear contatos do localStorage:", error);
        localStorage.removeItem('contacts');
        setContacts([]);
      }
    } else {
      console.log("App.jsx: Nenhum contato encontrado no localStorage.");
    }
  }, []);

  // EFEITO PARA SALVAR CONTATOS NO LOCALSTORAGE
  useEffect(() => {
    console.log("App.jsx: Efeito de SALVAMENTO no localStorage executado. Contacts:", contacts);
    if (contacts && contacts.length > 0) {
      localStorage.setItem('contacts', JSON.stringify(contacts));
      console.log("App.jsx: Contatos salvos no localStorage.");
    } else if (contacts && contacts.length === 0 && localStorage.getItem('contacts') !== null) {
      localStorage.removeItem('contacts');
      console.log("App.jsx: Lista de contatos vazia, chave 'contacts' removida.");
    }
  }, [contacts]);

  const addContactHandler = (newContactData) => {
    const contactWithId = {
      ...newContactData,
      id: crypto.randomUUID(),
    };
    setContacts(prevContacts => [...prevContacts, contactWithId]);
    // O toast de "contato adicionado" pode ser disparado aqui ou no ContactForm
    // Por enquanto, focaremos nos toasts de busca de CEP conforme o desafio.
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
        {contacts && contacts.length === 0 ? (
          <p style={{ fontStyle: 'italic', color: '#777' }}>Nenhum contato adicionado ainda.</p>
        ) : (
          <ContactList contacts={contacts} />
        )}
      </main>
      <ToastContainer
        position="top-right"
        autoClose={5000} // Fecha automaticamente após 5 segundos
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" // Opções: "light", "dark", "colored"
      />
    </div>
  );
}

export default App;