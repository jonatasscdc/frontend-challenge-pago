// src/App.jsx
import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import Header from './components/Header';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';
import ContactFilters from './components/ContactFilters';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const appTitle = "Minha Agenda de Endereços";
  const appSubtitle = "Gerencie seus contatos facilmente!";

  const [contacts, setContacts] = useState([]);
  const [editingContactId, setEditingContactId] = useState(null);
  const [editingDisplayName, setEditingDisplayName] = useState('');

  const [filters, setFilters] = useState({
    user: '',
    city: '',
    state: '',
  });
  const [searchTerm, setSearchTerm] = useState(''); // Estado para o termo de busca

  // EFEITO PARA CARREGAR CONTATOS DO LOCALSTORAGE
  useEffect(() => {
    console.log("App.jsx: Efeito de CARREGAMENTO do localStorage executado.");
    const storedContacts = localStorage.getItem('contacts');
    if (storedContacts) {
      try {
        const parsedContacts = JSON.parse(storedContacts);
        if (Array.isArray(parsedContacts)) {
          setContacts(parsedContacts);
        } else {
          localStorage.removeItem('contacts');
          setContacts([]);
        }
      } catch (error) {
        console.error("App.jsx: Erro ao parsear contatos do localStorage:", error);
        localStorage.removeItem('contacts');
        setContacts([]);
      }
    }
  }, []);

  // EFEITO PARA SALVAR CONTATOS NO LOCALSTORAGE
  useEffect(() => {
    console.log("App.jsx: Efeito de SALVAMENTO no localStorage executado. Contacts:", contacts);
    if (contacts && contacts.length > 0) {
      localStorage.setItem('contacts', JSON.stringify(contacts));
    } else if (contacts && contacts.length === 0 && localStorage.getItem('contacts') !== null) {
      localStorage.removeItem('contacts');
    }
  }, [contacts]);

  const addContactHandler = (newContactData) => {
    const contactWithId = {
      ...newContactData,
      id: crypto.randomUUID(),
      isArchived: false, 
    };
    setContacts(prevContacts => [...prevContacts, contactWithId]);
    toast.info("Novo contato adicionado!");
  };

  const handleEditInitiate = (contactId) => {
    const contactToEdit = contacts.find(contact => contact.id === contactId);
    if (contactToEdit) {
      setEditingContactId(contactId);
      setEditingDisplayName(contactToEdit.displayName);
    }
  };

  const handleEditCancel = () => {
    setEditingContactId(null);
    setEditingDisplayName('');
  };

  const handleEditSave = () => {
    if (!editingDisplayName.trim()) {
      toast.error("O nome de exibição não pode ser vazio.");
      return;
    }
    setContacts(prevContacts =>
      prevContacts.map(contact =>
        contact.id === editingContactId ? { ...contact, displayName: editingDisplayName.trim() } : contact
      )
    );
    toast.success("Nome de exibição atualizado com sucesso!");
    handleEditCancel();
  };

  const handleDeleteContact = (contactIdToDelete) => {
    if (window.confirm("Tem certeza que deseja excluir este contato? Esta ação não pode ser desfeita.")) {
      setContacts(prevContacts =>
        prevContacts.filter(contact => contact.id !== contactIdToDelete)
      );
      toast.success("Contato excluído com sucesso!");
      if (editingContactId === contactIdToDelete) {
        handleEditCancel();
      }
    }
  };

  const handleFilterChange = (filterName, filterValue) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: filterValue,
    }));
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const processedContacts = useMemo(() => {
    console.log("App.jsx: Recalculando processedContacts (contacts, filters, searchTerm)...");
    let tempContacts = contacts.filter(contact => !contact.isArchived); // Exemplo, se tivéssemos isArchived

    // Aplicar filtros estruturados
    if (filters.user) {
      tempContacts = tempContacts.filter(contact =>
        contact.userName.toLowerCase().includes(filters.user.toLowerCase())
      );
    }
    if (filters.city) {
      tempContacts = tempContacts.filter(contact =>
        contact.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }
    if (filters.state) {
      tempContacts = tempContacts.filter(contact =>
        contact.state.toLowerCase().includes(filters.state.toLowerCase())
      );
    }

    // Aplicar termo de busca (no displayName)
    if (searchTerm) {
      tempContacts = tempContacts.filter(contact =>
        contact.displayName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return tempContacts;
  }, [contacts, filters, searchTerm]);


  return (
    <div>
      <Header title={appTitle} subtitle={appSubtitle} />
      <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        
        {editingContactId && (
          <div style={{ 
            padding: '20px', 
            margin: '20px 0', 
            border: '2px solid #007bff', 
            borderRadius: '8px', 
            backgroundColor: '#f8f9fa' 
          }}>
            <h3 style={{ marginTop: '0', color: '#007bff' }}>Editando Nome de Exibição</h3>
            <label htmlFor="editingDisplayNameInput" style={{ display: 'block', marginBottom: '5px' }}>Novo nome:</label>
            <input
              type="text"
              id="editingDisplayNameInput"
              value={editingDisplayName}
              onChange={(e) => setEditingDisplayName(e.target.value)}
              style={{ marginRight: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: 'calc(100% - 200px)' }}
            />
            <button 
              onClick={handleEditSave} 
              style={{ padding: '8px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Salvar
            </button>
            <button 
              onClick={handleEditCancel} 
              style={{ padding: '8px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '5px' }}
            >
              Cancelar
            </button>
          </div>
        )}

        <ContactForm onAddContact={addContactHandler} />
        
        <hr style={{ margin: '30px 0', borderColor: '#eee' }} />

        <ContactFilters
          filterValues={filters}
          onFilterChange={handleFilterChange}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />

        <h2 style={{ color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '10px', marginTop: '30px' }}>
          Meus Contatos {processedContacts.length !== contacts.length ? `(Exibindo ${processedContacts.length} de ${contacts.length})` : `(${contacts.length} no total)`}
        </h2>
        
        {processedContacts.length === 0 ? (
          <p style={{ fontStyle: 'italic', color: '#777' }}>
            {contacts.length > 0 ? 'Nenhum contato corresponde aos filtros/busca atuais.' : 'Nenhum contato adicionado ainda.'}
          </p>
        ) : (
          <ContactList
            contacts={processedContacts}
            onEditContact={handleEditInitiate}
            onDeleteContact={handleDeleteContact}
          />
        )}
      </main>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;