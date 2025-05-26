// src/components/ContactForm.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { User, MapPin, Home, Building, Navigation, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const ContactForm = ({ onAddContact, onClose }) => {
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
  const [cepSuccess, setCepSuccess] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
    if (name === 'cep') {
      setCepError('');
      setCepSuccess(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCepError('');

    if (!formData.userName.trim() || !formData.displayName.trim()) {
      toast.error('Nome de usuário e Nome de exibição são obrigatórios.');
      return;
    }

    let currentFormState = { ...formData };

    // Lógica de busca do CEP
    if (formData.cep && formData.cep.trim() !== '') {
      const cepDigitsOnly = formData.cep.replace(/\D/g, '');
      if (cepDigitsOnly.length !== 8) {
        const cepFormatErrorMsg = 'Formato de CEP inválido. Deve conter 8 dígitos.';
        setCepError(cepFormatErrorMsg);
        toast.warn(cepFormatErrorMsg);
        return;
      }

      setIsLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepDigitsOnly}/json/`);
        const data = await response.json();

        if (!response.ok) {
          const httpErrorMsg = `Falha ao buscar CEP (HTTP ${response.status}). Tente novamente ou preencha manualmente.`;
          setCepError(httpErrorMsg);
          toast.error(httpErrorMsg);
          currentFormState = { ...currentFormState, street: '', neighborhood: '', city: '', state: '', complement: '' };
        } else if (data.erro) {
          const cepNotFoundErrorMsg = 'CEP não encontrado. Preencha o endereço manualmente ou tente outro CEP.';
          setCepError(cepNotFoundErrorMsg);
          toast.warn(cepNotFoundErrorMsg);
          currentFormState = { ...currentFormState, street: '', neighborhood: '', city: '', state: '', complement: '' };
        } else {
          console.log('ContactForm.jsx: Endereço encontrado pela API:', data);
          currentFormState = {
            ...currentFormState,
            street: data.logradouro || '',
            neighborhood: data.bairro || '',
            city: data.localidade || '',
            state: data.uf || '',
            complement: data.complemento || '',
          };
          setFormData(currentFormState);
          setCepSuccess(true);
          toast.success('Endereço encontrado e preenchido!');
        }
      } catch (error) {
        console.error('ContactForm.jsx: Falha na requisição fetch do CEP:', error);
        const networkErrorMsg = `Falha ao conectar com o serviço de CEP: ${error.message}. Verifique sua conexão ou preencha manualmente.`;
        setCepError(networkErrorMsg);
        toast.error(networkErrorMsg);
        currentFormState = { ...currentFormState, street: '', neighborhood: '', city: '', state: '', complement: '' };
      } finally {
        setIsLoadingCep(false);
      }
    }

    const { userName, displayName, cep, street, neighborhood, city, state, complement } = currentFormState;
    
    if (!userName.trim() || !displayName.trim()) {
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
    setCepSuccess(false);
    
    toast.success('Contato adicionado com sucesso!');
    onClose();
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const fieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.form
      variants={formVariants}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit}
      className="modern-contact-form"
    >
      {/* Seção de Informações Pessoais */}
      <motion.div variants={fieldVariants} className="form-section">
        <h3 className="section-title">
          <User size={20} />
          Informações Pessoais
        </h3>
        
        <div className="form-group">
          <label htmlFor="userName" className="form-label">
            Nome de Usuário *
          </label>
          <input
            type="text"
            id="userName"
            name="userName"
            className="form-input"
            value={formData.userName}
            onChange={handleChange}
            placeholder="Digite o nome de usuário"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="displayName" className="form-label">
            Nome de Exibição *
          </label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            className="form-input"
            value={formData.displayName}
            onChange={handleChange}
            placeholder="Como este contato será exibido"
            required
          />
        </div>
      </motion.div>

      {/* Seção de Endereço */}
      <motion.div variants={fieldVariants} className="form-section">
        <h3 className="section-title">
          <MapPin size={20} />
          Endereço
        </h3>

        <div className="form-group">
          <label htmlFor="cep" className="form-label">
            CEP
          </label>
          <div className="input-with-icon">
            <input
              type="text"
              id="cep"
              name="cep"
              className={`form-input ${cepError ? 'error' : ''} ${cepSuccess ? 'success' : ''}`}
              value={formData.cep}
              onChange={handleChange}
              placeholder="00000-000"
              maxLength="9"
            />
            <div className="input-icon">
              {isLoadingCep ? (
                <Loader2 size={16} className="loading" />
              ) : cepSuccess ? (
                <CheckCircle size={16} style={{ color: '#10b981' }} />
              ) : cepError ? (
                <AlertCircle size={16} style={{ color: '#ef4444' }} />
              ) : (
                <Navigation size={16} />
              )}
            </div>
          </div>
          {cepError && (
            <motion.div 
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle size={16} />
              {cepError}
            </motion.div>
          )}
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="street" className="form-label">
              Logradouro
            </label>
            <input
              type="text"
              id="street"
              name="street"
              className="form-input"
              value={formData.street}
              onChange={handleChange}
              placeholder="Rua, Avenida, etc."
            />
          </div>

          <div className="form-group">
            <label htmlFor="neighborhood" className="form-label">
              Bairro
            </label>
            <input
              type="text"
              id="neighborhood"
              name="neighborhood"
              className="form-input"
              value={formData.neighborhood}
              onChange={handleChange}
              placeholder="Nome do bairro"
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="city" className="form-label">
              Cidade
            </label>
            <input
              type="text"
              id="city"
              name="city"
              className="form-input"
              value={formData.city}
              onChange={handleChange}
              placeholder="Nome da cidade"
            />
          </div>

          <div className="form-group">
            <label htmlFor="state" className="form-label">
              Estado (UF)
            </label>
            <input
              type="text"
              id="state"
              name="state"
              className="form-input"
              value={formData.state}
              onChange={handleChange}
              placeholder="SP, RJ, MG..."
              maxLength="2"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="complement" className="form-label">
            Complemento
          </label>
          <input
            type="text"
            id="complement"
            name="complement"
            className="form-input"
            value={formData.complement}
            onChange={handleChange}
            placeholder="Apartamento, bloco, etc."
          />
        </div>
      </motion.div>

      {/* Botões de Ação */}
      <motion.div 
        variants={fieldVariants}
        className="form-actions"
      >
        <button
          type="button"
          onClick={onClose}
          className="btn btn-secondary"
        >
          Cancelar
        </button>
        
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoadingCep}
        >
          {isLoadingCep ? (
            <>
              <Loader2 size={16} className="loading" />
              Buscando CEP...
            </>
          ) : (
            <>
              <User size={16} />
              Adicionar Contato
            </>
          )}
        </button>
      </motion.div>
    </motion.form>
  );
};

export default ContactForm;