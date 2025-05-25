// src/App.jsx
import './App.css';
import Header from './components/Header';
import ContactItem from './components/ContactItem';
import ContactForm from './components/ContactForm'; // 1. Importar ContactForm

function App() {
  const appTitle = "Minha Agenda de Endereços";
  const appSubtitle = "Gerencie seus contatos facilmente!";
  const customHeaderStyles = {
    backgroundColor: 'lightblue',
    borderBottom: '2px solid navy'
  };

  // Dados de exemplo (manteremos por enquanto para o ContactItem)
  const contact1 = {
    userName: "usuario_joao",
    displayName: "Casa do João",
    cep: "12345-678",
    street: "Rua das Palmeiras, 123",
    neighborhood: "Bairro Jardim",
    city: "São Paulo",
    state: "SP"
  };

  const contact2 = {
    userName: "maria_dev",
    displayName: "Escritório Maria",
    cep: "98765-432",
    street: "Avenida Central, 789",
    neighborhood: "Centro",
    city: "Rio de Janeiro",
    state: "RJ"
  };

  return (
    <div>
      <Header
        title={appTitle}
        subtitle={appSubtitle}
        headerStyles={customHeaderStyles}
      />
      <main style={{ padding: '20px' }}>
        <ContactForm /> {/* 2. Adicionar o ContactForm aqui */}

        <hr style={{ margin: '30px 0' }} /> {/* Uma linha divisória para separar visualmente */}

        <h2>Meus Contatos</h2>
        {/* Usando o operador spread para passar props de forma concisa */}
        <ContactItem {...contact1} />
        <ContactItem {...contact2} />
      </main>
    </div>
  );
}

export default App;