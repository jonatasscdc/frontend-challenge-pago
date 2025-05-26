// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';

function App() {
  const appTitle = "Minha Agenda de Endereços";
  const appSubtitle = "Gerencie seus contatos facilmente!";

  // Estado para a lista de contatos
  // A inicialização agora é feita dentro do useEffect de carregamento
  // ou como um array vazio se nada for encontrado no localStorage.
  // Para simplificar, podemos inicializar como vazio e deixar o useEffect preencher.
  const [contacts, setContacts] = useState([]);

  // EFEITO PARA CARREGAR CONTATOS DO LOCALSTORAGE NA PRIMEIRA RENDERIZAÇÃO
  useEffect(() => {
    console.log("App.jsx: Efeito de CARREGAMENTO do localStorage executado (montagem).");
    const storedContacts = localStorage.getItem('contacts');
    if (storedContacts) {
      try {
        const parsedContacts = JSON.parse(storedContacts);
        if (Array.isArray(parsedContacts)) { // Verifica se o dado parseado é um array
          setContacts(parsedContacts);
          console.log("App.jsx: Contatos carregados do localStorage:", parsedContacts);
        } else {
          console.warn("App.jsx: Dados do localStorage não são um array. Resetando para lista vazia.");
          localStorage.removeItem('contacts'); // Limpa dados inválidos
          setContacts([]);
        }
      } catch (error) {
        console.error("App.jsx: Erro ao parsear contatos do localStorage:", error);
        // Opcional: limpar o localStorage se estiver corrompido
        localStorage.removeItem('contacts');
        setContacts([]); // Garante que contacts seja um array em caso de erro
      }
    } else {
      console.log("App.jsx: Nenhum contato encontrado no localStorage. Iniciando com lista vazia.");
      // Não é necessário setContacts([]) aqui se o estado inicial já é [],
      // mas é bom ter o log para saber o que aconteceu.
    }
  }, []); // Array de dependências VAZIO: roda apenas uma vez na montagem do componente

  // EFEITO PARA SALVAR CONTATOS NO LOCALSTORAGE QUANDO 'contacts' MUDAR
  useEffect(() => {
    // Este efeito não deve rodar na montagem inicial se 'contacts' ainda estiver vazio
    // e nada foi carregado do localStorage. Ele rodará após 'contacts' ser populado
    // pelo primeiro useEffect ou alterado pelo addContactHandler.
    console.log("App.jsx: Efeito de SALVAMENTO no localStorage executado. Contacts mudou:", contacts);
    // A condição 'contacts.length > 0' é uma forma de evitar salvar um array vazio explicitamente
    // se essa for a intenção. Mas, para garantir que a remoção de todos os contatos
    // também limpe o localStorage, a lógica pode ser ajustada.

    // Se contacts não for o array vazio inicial Efetivamente (ou seja, se ele foi alterado desde a montagem)
    // Ou se a lista ficou vazia após ter tido itens.
    if (contacts && contacts.length > 0) {
      localStorage.setItem('contacts', JSON.stringify(contacts));
      console.log("App.jsx: Contatos salvos no localStorage.");
    } else if (contacts && contacts.length === 0 && localStorage.getItem('contacts') !== null) {
      // Se a lista está vazia AGORA, mas ANTES havia algo no localStorage, removemos.
      // Isso lida com o caso de deletar todos os contatos.
      localStorage.removeItem('contacts');
      console.log("App.jsx: Lista de contatos vazia, chave 'contacts' removida do localStorage.");
    }
    // Se contacts for o array vazio inicial e nada foi carregado, este efeito pode não precisar fazer nada.
    // A lógica acima tenta ser um pouco mais inteligente sobre quando escrever/remover.
  }, [contacts]); // Array de dependências com 'contacts': roda quando 'contacts' mudar

  const addContactHandler = (newContactData) => {
    const contactWithId = {
      ...newContactData,
      id: crypto.randomUUID(),
    };

    setContacts(prevContacts => {
      const updatedContacts = [...prevContacts, contactWithId];
      // O log de 'contacts' mudou já será pego pelo useEffect de salvamento.
      // console.log('App.jsx: (addContactHandler) Lista de contatos atualizada para:', updatedContacts);
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
        {contacts && contacts.length === 0 ? ( // Adicionado 'contacts &&' para segurança extra
          <p style={{ fontStyle: 'italic', color: '#777' }}>Nenhum contato adicionado ainda.</p>
        ) : (
          <ContactList contacts={contacts} />
        )}

        {/* Para debug: Exibe a lista de contatos na tela */}
        {/*
        <div style={{ marginTop: '20px', maxHeight: '300px', overflowY: 'auto', backgroundColor: '#f4f4f4', border: '1px solid #ddd', padding: '10px', borderRadius: '4px' }}>
          <h3>Debug: Estado Atual de Contacts</h3>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {JSON.stringify(contacts, null, 2)}
          </pre>
        </div>
        */}
      </main>
    </div>
  );
}

export default App;