// src/components/ContactForm.jsx
import React, { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    userName: '',
    displayName: '',
    cep: '',
    street: '',      // Para logradouro
    neighborhood: '',// Para bairro
    city: '',        // Para localidade
    state: '',       // Para uf
  });
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [cepError, setCepError] = useState('');

  // Estilos (você pode movê-los para um arquivo .css se preferir)
  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px', // Aumentei um pouco o gap para melhor espaçamento
    maxWidth: '500px', // Aumentei um pouco a largura máxima
    margin: '20px auto',
    padding: '25px', // Aumentei um pouco o padding
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Adicionei uma sombra mais pronunciada
  };

  const fieldGroupStyle = { // Estilo para agrupar label e input
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  };

  const labelStyle = {
    fontWeight: 'bold',
    fontSize: '0.95em',
    color: '#333',
  };

  const inputStyle = {
    padding: '10px', // Aumentei o padding do input
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1em',
  };

  const buttonStyle = {
    padding: '12px 20px', // Aumentei o padding do botão
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1em',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out', // Adicionei uma transição suave
  };

  const buttonHoverStyle = { // Estilo para o hover do botão
    backgroundColor: '#0056b3',
  };

  const errorStyle = {
    color: 'red',
    fontSize: '0.9em',
    marginTop: '2px', // Ajustei a margem
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
    if (name === 'cep') {
      setCepError('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCepError('');

    if (!formData.cep || formData.cep.trim() === '') {
      setCepError('Por favor, preencha o campo CEP.');
      return;
    }

    const cepDigitsOnly = formData.cep.replace(/\D/g, '');
    if (cepDigitsOnly.length !== 8) {
      setCepError('Formato de CEP inválido. Deve conter 8 dígitos.');
      return;
    }

    setIsLoadingCep(true);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepDigitsOnly}/json/`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar CEP: ${response.statusText} (Status: ${response.status})`);
      }

      const data = await response.json();

      if (data.erro) {
        setCepError('CEP não encontrado.');
        setFormData(prevState => ({
          ...prevState,
          street: '',
          neighborhood: '',
          city: '',
          state: '',
        }));
        // TODO: Implementar toast de falha para CEP não encontrado (Módulo 6)
      } else {
        console.log('Endereço encontrado pela API:', data);
        setFormData(prevState => ({
          ...prevState,
          street: data.logradouro || '',
          neighborhood: data.bairro || '',
          city: data.localidade || '',
          state: data.uf || '',
        }));
        // TODO: Implementar toast de sucesso (Módulo 6)
      }
    } catch (error) {
      console.error('Falha ao buscar endereço:', error);
      setCepError(`Falha ao buscar endereço: ${error.message}`);
      setFormData(prevState => ({
        ...prevState,
        street: '',
        neighborhood: '',
        city: '',
        state: '',
      }));
      // TODO: Implementar toast de falha (Módulo 6)
    } finally {
      setIsLoadingCep(false);
    }
  };

  return (
    <form
      style={formStyle}
      onSubmit={handleSubmit}
      onMouseOver={(e) => { if(e.target.type === 'submit') e.target.style.backgroundColor = buttonHoverStyle.backgroundColor; }}
      onMouseOut={(e) => { if(e.target.type === 'submit') e.target.style.backgroundColor = buttonStyle.backgroundColor; }}
    >
      <h2 style={{ textAlign: 'center', color: '#007bff', marginBottom: '20px' }}>Adicionar Novo Contato</h2>

      <div style={fieldGroupStyle}>
        <label htmlFor="userName" style={labelStyle}>
          Nome de Usuário:
        </label>
        <input
          type="text"
          id="userName"
          name="userName"
          style={inputStyle}
          value={formData.userName}
          onChange={handleChange}
          required // Adicionando required para validação do navegador
        />
      </div>

      <div style={fieldGroupStyle}>
        <label htmlFor="displayName" style={labelStyle}>
          Nome de Exibição do Endereço:
        </label>
        <input
          type="text"
          id="displayName"
          name="displayName"
          style={inputStyle}
          value={formData.displayName}
          onChange={handleChange}
          required
        />
      </div>

      <div style={fieldGroupStyle}>
        <label htmlFor="cep" style={labelStyle}>
          CEP:
        </label>
        <input
          type="text"
          id="cep"
          name="cep"
          placeholder="Ex: 00000-000"
          style={inputStyle}
          value={formData.cep}
          onChange={handleChange}
          required
        />
        {cepError && <p style={errorStyle}>{cepError}</p>}
      </div>

      <div style={fieldGroupStyle}>
        <label htmlFor="street" style={labelStyle}>
          Logradouro:
        </label>
        <input
          type="text"
          id="street"
          name="street"
          style={inputStyle}
          value={formData.street}
          onChange={handleChange}
        />
      </div>

      <div style={fieldGroupStyle}>
        <label htmlFor="neighborhood" style={labelStyle}>
          Bairro:
        </label>
        <input
          type="text"
          id="neighborhood"
          name="neighborhood"
          style={inputStyle}
          value={formData.neighborhood}
          onChange={handleChange}
        />
      </div>

      <div style={fieldGroupStyle}>
        <label htmlFor="city" style={labelStyle}>
          Cidade:
        </label>
        <input
          type="text"
          id="city"
          name="city"
          style={inputStyle}
          value={formData.city}
          onChange={handleChange}
        />
      </div>

      <div style={fieldGroupStyle}>
        <label htmlFor="state" style={labelStyle}>
          Estado (UF):
        </label>
        <input
          type="text"
          id="state"
          name="state"
          style={inputStyle}
          value={formData.state}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        style={buttonStyle} // Estilo base
        disabled={isLoadingCep}
      >
        {isLoadingCep ? 'Buscando CEP...' : 'Buscar Endereço e Salvar'}
      </button>
    </form>
  );
};

export default ContactForm;