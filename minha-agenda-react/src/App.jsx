// src/App.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import Header from './components/Header';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';
import ContactFilters from './components/ContactFilters';
import StatsCards from './components/StatsCards';
import Modal from './components/Modal';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Plus, Edit3, Users, Sparkles } from 'lucide-react';

function App() {
  const appTitle = "Minha Agenda de Endereços";
  const appSubtitle = "Gerencie seus contatos facilmente!";

  const [contacts, setContacts] = useState([]);
  const [editingContactId, setEditingContactId] = useState(null);
  const [editingDisplayName, setEditingDisplayName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    user: '',
    city: '',
    state: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

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
    toast.success("Novo contato adicionado!");
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
    let tempContacts = contacts.filter(contact => !contact.isArchived);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="app-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Header title={appTitle} subtitle={appSubtitle} />
      
      {/* Modal de Edição */}
      <AnimatePresence>
        {editingContactId && (
          <Modal
            isOpen={true}
            onClose={handleEditCancel}
            title="Editar Nome de Exibição"
          >
            <div className="form-group">
              <label htmlFor="editingDisplayNameInput" className="form-label">
                Novo nome de exibição:
              </label>
              <input
                type="text"
                id="editingDisplayNameInput"
                className="form-input"
                value={editingDisplayName}
                onChange={(e) => setEditingDisplayName(e.target.value)}
                placeholder="Digite o novo nome"
                autoFocus
              />
            </div>
            
            <div className="form-actions">
              <button 
                onClick={handleEditCancel} 
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button 
                onClick={handleEditSave} 
                className="btn btn-primary"
              >
                <Edit3 size={16} />
                Salvar
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Modal do Formulário de Contato */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Adicionar Novo Contato"
      >
        <ContactForm 
          onAddContact={addContactHandler}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Botão para Adicionar Contato */}
      <motion.div 
        variants={sectionVariants}
        className="add-contact-section"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="add-contact-btn"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={20} className="btn-icon" />
          Adicionar Novo Contato
        </motion.button>
      </motion.div>

      {/* Estatísticas */}
      <motion.div variants={sectionVariants}>
        <StatsCards 
          contacts={contacts} 
          filteredContacts={processedContacts}
        />
      </motion.div>

      {/* Filtros */}
      <motion.div variants={sectionVariants}>
        <ContactFilters
          filterValues={filters}
          onFilterChange={handleFilterChange}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />
      </motion.div>

      {/* Lista de Contatos */}
      <motion.div variants={sectionVariants}>
        <div className="section-header">
          <h2>Meus Contatos</h2>
          {processedContacts.length !== contacts.length && (
            <div className="contacts-count">
              {processedContacts.length} de {contacts.length}
            </div>
          )}
        </div>
        
        {processedContacts.length === 0 ? (
          <motion.div 
            className="empty-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="empty-state-icon">
              <Users size={64} />
            </div>
            <div className="empty-state-title">
              {contacts.length > 0 ? 'Nenhum contato encontrado' : 'Nenhum contato adicionado'}
            </div>
            <div className="empty-state-description">
              {contacts.length > 0 
                ? 'Tente ajustar os filtros ou busca para encontrar seus contatos.'
                : 'Comece adicionando seu primeiro contato clicando no botão acima.'
              }
            </div>
            {contacts.length === 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus size={16} />
                Adicionar Primeiro Contato
              </motion.button>
            )}
          </motion.div>
        ) : (
          <ContactList
            contacts={processedContacts}
            onEditContact={handleEditInitiate}
            onDeleteContact={handleDeleteContact}
          />
        )}
      </motion.div>

      {/* Toast Container */}
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
        toastStyle={{
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        }}
      />
    </motion.div>
  );
}

export default App;