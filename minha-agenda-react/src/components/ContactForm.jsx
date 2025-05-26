// src/components/ContactForm.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify'; // Importar a função toast

const ContactForm = ({ onAddContact }) => {
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
  const [cepError, setCepError] = useState(''); // Mantido para exibir erro abaixo do campo CEP

  // Estilos (mantidos como no exemplo anterior para consistência)
  const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '500px', margin: '20px auto', padding: '25px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'};
  const fieldGroupStyle = { display: 'flex', flexDirection: 'column', gap: '5px' };
  const labelStyle = { fontWeight: 'bold', fontSize: '0.95em', color: '#333' };
  const inputStyle = { padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1em' };
  const buttonStyle = { padding: '12px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1em', cursor: 'pointer', transition: 'background-color 0.2s ease-in-out' };
  const buttonHoverStyle = { backgroundColor: '#0056b3' };
  const errorStyle = { color: 'red', fontSize: '0.9em', marginTop: '2px' };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
    if (name === 'cep') {
      setCepError(''); // Limpa o erro específico do campo CEP ao digitar
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCepError(''); // Limpa erros anteriores do campo CEP

    if (!formData.userName.trim() || !formData.displayName.trim()) {
      toast.error('Nome de usuário e Nome de exibição são obrigatórios.');
      return;
    }

    let currentFormState = { ...formData }; // Usar uma cópia para atualizações internas antes do onAddContact

    // Lógica de busca do CEP (se ele foi preenchido)
    if (formData.cep && formData.cep.trim() !== '') {
      const cepDigitsOnly = formData.cep.replace(/\D/g, '');
      if (cepDigitsOnly.length !== 8) {
        const cepFormatErrorMsg = 'Formato de CEP inválido. Deve conter 8 dígitos.';
        setCepError(cepFormatErrorMsg);
        toast.warn(cepFormatErrorMsg);
        return; // Não continua se o CEP estiver mal formatado
      }

      setIsLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepDigitsOnly}/json/`);
        // Não verificamos response.ok aqui imediatamente, pois ViaCEP retorna 200 mesmo para CEP não encontrado
        
        const data = await response.json(); // Sempre tentar parsear, mesmo que response.ok seja false para outros erros

        if (!response.ok) { // Agora checamos se a requisição HTTP em si falhou (ex: 400, 404, 500)
            const httpErrorMsg = `Falha ao buscar CEP (HTTP ${response.status}). Tente novamente ou preencha manualmente.`;
            setCepError(httpErrorMsg);
            toast.error(httpErrorMsg);
            currentFormState = { ...currentFormState, street: '', neighborhood: '', city: '', state: '', complement: '' };
        } else if (data.erro) { // Checa o erro específico da API ViaCEP (CEP não encontrado)
          const cepNotFoundErrorMsg = 'CEP não encontrado. Preencha o endereço manualmente ou tente outro CEP.';
          setCepError(cepNotFoundErrorMsg);
          toast.warn(cepNotFoundErrorMsg); // Usar warn para CEP não encontrado
          currentFormState = { ...currentFormState, street: '', neighborhood: '', city: '', state: '', complement: '' };
        } else {
          // Sucesso na busca do CEP
          console.log('ContactForm.jsx: Endereço encontrado pela API:', data);
          currentFormState = {
            ...currentFormState,
            street: data.logradouro || '',
            neighborhood: data.bairro || '',
            city: data.localidade || '',
            state: data.uf || '',
            complement: data.complemento || '',
          };
          setFormData(currentFormState); // Atualiza o formulário na UI com os dados da API
          toast.success('Endereço encontrado e preenchido!');
        }
      } catch (error) { // Erro de rede ou outros erros no fetch/json()
        console.error('ContactForm.jsx: Falha na requisição fetch do CEP:', error);
        const networkErrorMsg = `Falha ao conectar com o serviço de CEP: ${error.message}. Verifique sua conexão ou preencha manualmente.`;
        setCepError(networkErrorMsg);
        toast.error(networkErrorMsg);
        currentFormState = { ...currentFormState, street: '', neighborhood: '', city: '', state: '', complement: '' };
      } finally {
        setIsLoadingCep(false);
      }
    }

    // Neste ponto, currentFormState tem os dados mais recentes (com ou sem endereço da API)
    // Agora, efetivamente "salvamos" o contato chamando a função do App.jsx
    const { userName, displayName, cep, street, neighborhood, city, state, complement } = currentFormState;
    
    // Verificação final (um pouco redundante, mas garante)
    if (!userName.trim() || !displayName.trim()) {
      // O toast para isso já foi dado no início.
      // Apenas evita chamar onAddContact com dados inválidos se algo inesperado ocorreu.
      return;
    }
    
    onAddContact({
      userName, displayName, cep, street, neighborhood, city, state, complement,
    });

    // Limpar o formulário após adicionar com sucesso
    setFormData({
      userName: '', displayName: '', cep: '',
      street: '', neighborhood: '', city: '', state: '', complement: ''
    });
    setCepError('');
    // O desafio pede toast para busca de endereço. O toast para "contato salvo" pode ser adicionado
    // se desejado, mas não é o foco deste módulo específico.
    // Ex: toast.info("Contato adicionado à sua lista!");
  };

  return (
    <form
      style={formStyle}
      onSubmit={handleSubmit}
      onMouseOver={(e) => { if(e.target.type === 'submit' && !e.target.disabled) e.target.style.backgroundColor = buttonHoverStyle.backgroundColor; }}
      onMouseOut={(e) => { if(e.target.type === 'submit' && !e.target.disabled) e.target.style.backgroundColor = buttonStyle.backgroundColor; }}
    >
      <h2 style={{ textAlign: 'center', color: '#007bff', marginBottom: '20px' }}>Adicionar Novo Contato</h2>

      {/* Campos do formulário (userName, displayName, cep, street, etc.) como antes */}
      <div style={fieldGroupStyle}><label htmlFor="userName" style={labelStyle}>Nome de Usuário:</label><input type="text" id="userName" name="userName" style={inputStyle} value={formData.userName} onChange={handleChange} required /></div>
      <div style={fieldGroupStyle}><label htmlFor="displayName" style={labelStyle}>Nome de Exibição do Endereço:</label><input type="text" id="displayName" name="displayName" style={inputStyle} value={formData.displayName} onChange={handleChange} required /></div>
      <div style={fieldGroupStyle}><label htmlFor="cep" style={labelStyle}>CEP:</label><input type="text" id="cep" name="cep" placeholder="Ex: 00000-000" style={inputStyle} value={formData.cep} onChange={handleChange} /><p style={errorStyle}>{cepError}</p></div>
      <div style={fieldGroupStyle}><label htmlFor="street" style={labelStyle}>Logradouro:</label><input type="text" id="street" name="street" style={inputStyle} value={formData.street} onChange={handleChange} /></div>
      <div style={fieldGroupStyle}><label htmlFor="neighborhood" style={labelStyle}>Bairro:</label><input type="text" id="neighborhood" name="neighborhood" style={inputStyle} value={formData.neighborhood} onChange={handleChange} /></div>
      <div style={fieldGroupStyle}><label htmlFor="city" style={labelStyle}>Cidade:</label><input type="text" id="city" name="city" style={inputStyle} value={formData.city} onChange={handleChange} /></div>
      <div style={fieldGroupStyle}><label htmlFor="state" style={labelStyle}>Estado (UF):</label><input type="text" id="state" name="state" style={inputStyle} value={formData.state} onChange={handleChange} /></div>
      <div style={fieldGroupStyle}><label htmlFor="complement" style={labelStyle}>Complemento:</label><input type="text" id="complement" name="complement" style={inputStyle} value={formData.complement} onChange={handleChange} /></div>

      <button type="submit" style={buttonStyle} disabled={isLoadingCep}>
        {isLoadingCep ? 'Buscando CEP...' : 'Adicionar Contato'}
      </button>
    </form>
  );
};

export default ContactForm;