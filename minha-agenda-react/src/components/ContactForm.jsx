// src/components/ContactForm.jsx
import React, { useState } from 'react';

const ContactForm = ({ onAddContact }) => { // Recebe onAddContact via props
  const [formData, setFormData] = useState({
    userName: '',
    displayName: '',
    cep: '',
    street: '',
    neighborhood: '',
    city: '',
    state: '',
    complement: '',
  });
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [cepError, setCepError] = useState('');

  // Estilos (mantidos como no exemplo anterior para consistência)
  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    maxWidth: '500px',
    margin: '20px auto',
    padding: '25px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  };
  const fieldGroupStyle = { display: 'flex', flexDirection: 'column', gap: '5px' };
  const labelStyle = { fontWeight: 'bold', fontSize: '0.95em', color: '#333' };
  const inputStyle = { padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1em' };
  const buttonStyle = { padding: '12px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1em', cursor: 'pointer', transition: 'background-color 0.2s ease-in-out' };
  const buttonHoverStyle = { backgroundColor: '#0056b3' };
  const errorStyle = { color: 'red', fontSize: '0.9em', marginTop: '2px' };

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

    if (!formData.userName.trim() || !formData.displayName.trim()) {
      alert('Nome de usuário e Nome de exibição são obrigatórios.');
      return;
    }

    let currentFormData = { ...formData }; // Cria uma cópia para trabalhar

    if (formData.cep && formData.cep.trim() !== '') {
      const cepDigitsOnly = formData.cep.replace(/\D/g, '');
      if (cepDigitsOnly.length !== 8) {
        setCepError('Formato de CEP inválido. Deve conter 8 dígitos.');
        return; // Não continua se o CEP estiver mal formatado
      }

      setIsLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepDigitsOnly}/json/`);
        if (!response.ok) {
          // Considerar que um erro HTTP na busca do CEP não impede o salvamento
          // dos dados já digitados, mas informa o usuário.
          console.error(`Erro HTTP ao buscar CEP: ${response.status}`);
          setCepError(`Falha ao buscar CEP (HTTP ${response.status}). Preencha o endereço manualmente ou tente outro CEP.`);
          // Limpa apenas os campos de endereço para permitir preenchimento manual
          currentFormData = { ...currentFormData, street: '', neighborhood: '', city: '', state: '', complement: '' };
        } else {
          const data = await response.json();
          if (data.erro) {
            setCepError('CEP não encontrado. Preencha o endereço manualmente ou tente outro CEP.');
            currentFormData = { ...currentFormData, street: '', neighborhood: '', city: '', state: '', complement: '' };
            // TODO: Implementar toast de falha para CEP não encontrado (Módulo 6)
          } else {
            console.log('ContactForm.jsx: Endereço encontrado pela API:', data);
            // Atualiza a cópia local dos dados do formulário com os dados da API
            currentFormData = {
              ...currentFormData,
              street: data.logradouro || '',
              neighborhood: data.bairro || '',
              city: data.localidade || '',
              state: data.uf || '',
              complement: data.complemento || '',
            };
            // Atualiza o estado do formulário para refletir os dados da API na UI
            setFormData(currentFormData);
            // TODO: Implementar toast de sucesso para busca de CEP (Módulo 6)
          }
        }
      } catch (error) {
        console.error('ContactForm.jsx: Falha na requisição fetch do CEP:', error);
        setCepError(`Falha ao buscar endereço: ${error.message}. Preencha o endereço manualmente ou tente outro CEP.`);
        currentFormData = { ...currentFormData, street: '', neighborhood: '', city: '', state: '', complement: '' };
      } finally {
        setIsLoadingCep(false);
      }
    }

    // Após a tentativa de busca de CEP (ou se nenhum CEP foi fornecido),
    // currentFormData contém os dados mais recentes (seja da API ou digitados manualmente).
    // Passamos currentFormData para onAddContact, mas sem o ID (o App adicionará o ID).
    const { userName, displayName, cep, street, neighborhood, city, state, complement } = currentFormData;
    
    // Verificação final se os campos obrigatórios estão de fato preenchidos antes de submeter
    if (!userName.trim() || !displayName.trim()) {
      // Esta verificação é um pouco redundante com a do início, mas garante
      // caso a lógica de preenchimento de CEP os apague de alguma forma (não deveria).
      alert('Nome de usuário e Nome de exibição não podem estar vazios para salvar.');
      return;
    }
    
    onAddContact({
      userName,
      displayName,
      cep,
      street,
      neighborhood,
      city,
      state,
      complement,
    });

    // Limpar o formulário após adicionar com sucesso
    setFormData({
      userName: '', displayName: '', cep: '',
      street: '', neighborhood: '', city: '', state: '', complement: ''
    });
    setCepError(''); // Limpar qualquer erro de CEP residual
    alert('Contato salvo com sucesso!'); // Placeholder para toast de "contato salvo"
  };

  return (
    <form
      style={formStyle}
      onSubmit={handleSubmit}
      // Efeitos de hover no botão (opcional, pode ser feito com CSS)
      onMouseOver={(e) => { if(e.target.type === 'submit' && !e.target.disabled) e.target.style.backgroundColor = buttonHoverStyle.backgroundColor; }}
      onMouseOut={(e) => { if(e.target.type === 'submit' && !e.target.disabled) e.target.style.backgroundColor = buttonStyle.backgroundColor; }}
    >
      <h2 style={{ textAlign: 'center', color: '#007bff', marginBottom: '20px' }}>Adicionar Novo Contato</h2>

      <div style={fieldGroupStyle}>
        <label htmlFor="userName" style={labelStyle}>Nome de Usuário:</label>
        <input type="text" id="userName" name="userName" style={inputStyle} value={formData.userName} onChange={handleChange} required />
      </div>

      <div style={fieldGroupStyle}>
        <label htmlFor="displayName" style={labelStyle}>Nome de Exibição do Endereço:</label>
        <input type="text" id="displayName" name="displayName" style={inputStyle} value={formData.displayName} onChange={handleChange} required />
      </div>

      <div style={fieldGroupStyle}>
        <label htmlFor="cep" style={labelStyle}>CEP:</label>
        <input type="text" id="cep" name="cep" placeholder="Ex: 00000-000" style={inputStyle} value={formData.cep} onChange={handleChange} />
        {cepError && <p style={errorStyle}>{cepError}</p>}
      </div>

      <div style={fieldGroupStyle}>
        <label htmlFor="street" style={labelStyle}>Logradouro:</label>
        <input type="text" id="street" name="street" style={inputStyle} value={formData.street} onChange={handleChange} />
      </div>

      <div style={fieldGroupStyle}>
        <label htmlFor="neighborhood" style={labelStyle}>Bairro:</label>
        <input type="text" id="neighborhood" name="neighborhood" style={inputStyle} value={formData.neighborhood} onChange={handleChange} />
      </div>

      <div style={fieldGroupStyle}>
        <label htmlFor="city" style={labelStyle}>Cidade:</label>
        <input type="text" id="city" name="city" style={inputStyle} value={formData.city} onChange={handleChange} />
      </div>

      <div style={fieldGroupStyle}>
        <label htmlFor="state" style={labelStyle}>Estado (UF):</label>
        <input type="text" id="state" name="state" style={inputStyle} value={formData.state} onChange={handleChange} />
      </div>
      
      <div style={fieldGroupStyle}>
        <label htmlFor="complement" style={labelStyle}>Complemento:</label>
        <input type="text" id="complement" name="complement" style={inputStyle} value={formData.complement} onChange={handleChange} />
      </div>

      <button type="submit" style={buttonStyle} disabled={isLoadingCep}>
        {isLoadingCep ? 'Buscando CEP...' : 'Adicionar Contato'}
      </button>
    </form>
  );
};

export default ContactForm;