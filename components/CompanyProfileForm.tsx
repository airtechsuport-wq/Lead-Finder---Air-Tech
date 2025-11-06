import React, { useState } from 'react';
import { CompanyProfile } from '../types';
import SpinnerIcon from './SpinnerIcon';

interface CompanyProfileFormProps {
  onSubmit: (name: string, profile: CompanyProfile) => void;
  onCancel: () => void;
  isSaving: boolean;
}

interface FormFieldProps {
    id: keyof CompanyProfile | 'customEmailPrompt';
    label: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    isTextarea?: boolean;
    isRequired?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({ id, label, placeholder, value, onChange, isTextarea = false, isRequired = true }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-blue-300 mb-2">
            {label} {!isRequired && <span className="text-gray-400 font-normal">(Opcional)</span>}
        </label>
        {isTextarea ? (
            <textarea
                id={id}
                name={id}
                rows={3}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-shadow"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={isRequired}
            />
        ) : (
            <input
                type="text"
                id={id}
                name={id}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-shadow"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={isRequired}
            />
        )}
    </div>
);


const CompanyProfileForm: React.FC<CompanyProfileFormProps> = ({ onSubmit, onCancel, isSaving }) => {
  const [profileName, setProfileName] = useState('');
  const [profile, setProfile] = useState<CompanyProfile>({
    sector: '',
    size: '',
    coreSolution: '',
    icp: '',
    channels: '',
    linkedinProfile: '',
    twitterProfile: '',
    country: '',
    targetAudience: '',
    emailApproach: 'friendly',
    customEmailPrompt: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value,
    }));
  };
  
  const handleApproachChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile(prevProfile => ({
        ...prevProfile,
        emailApproach: e.target.value as CompanyProfile['emailApproach'],
    }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
        alert("Please provide a name for the profile.");
        return;
    }
    onSubmit(profileName, profile);
  };

  const fields: Omit<FormFieldProps, 'value' | 'onChange'>[] = [
    { id: 'sector', label: 'Setor de Atuação', placeholder: 'Ex: E-commerce, Saúde, Serviços B2B' },
    { id: 'size', label: 'Porte/Tamanho da Empresa', placeholder: 'Ex: Pequena, Média, Grande Empresa' },
    { id: 'coreSolution', label: 'Solução Principal', placeholder: 'Qual problema principal sua solução resolve?', isTextarea: true },
    { id: 'icp', label: 'Perfil de Cliente Ideal (ICP)', placeholder: 'Ex: Pequenos negócios de Varejo, CEOs de tech', isTextarea: true },
    { id: 'channels', label: 'Canais de Interação Principais', placeholder: 'Ex: WhatsApp, Instagram, E-mail' },
  ];
  
  const emailApproaches = [
    { id: 'friendly', label: 'Amigável' },
    { id: 'professional', label: 'Profissional' },
    { id: 'aggressive', label: 'Agressiva' },
    { id: 'custom', label: 'Personalizado' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl shadow-blue-900/20">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white">Create a New Profile</h2>
        <p className="text-gray-400 mt-2">
          Define a new Ideal Customer Profile (ICP) to find qualified leads.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="profileName" className="block text-sm font-medium text-blue-300 mb-2">
            Profile Name
          </label>
          <input
            type="text"
            id="profileName"
            name="profileName"
            className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-shadow"
            placeholder="Ex: Profile for selling AI Agents"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            required
          />
        </div>
        
        {fields.map(field => <FormField key={field.id} {...field} value={profile[field.id]} onChange={handleChange} />)}

        <div className="pt-4 mt-4 border-t border-gray-700">
            <h3 className="text-lg font-medium text-gray-300 mb-4">Detalhes de Segmentação</h3>
            <div className="space-y-6">
                <FormField id='country' label='País de Prospecção' placeholder='Ex: Portugal, Brasil, Estados Unidos' value={profile.country} onChange={handleChange} isRequired={true} />
                <FormField id='targetAudience' label='Nacionalidade / Público Específico' placeholder='Ex: Brasileiros em Portugal, Americanos no Brasil' value={profile.targetAudience} onChange={handleChange} isRequired={false} />
            </div>
        </div>

        <div className="pt-4 mt-4 border-t border-gray-700">
            <h3 className="text-lg font-medium text-gray-300 mb-4">Perfis de Redes Sociais</h3>
            <div className="space-y-6">
                <FormField id='linkedinProfile' label='URL do Perfil do LinkedIn' placeholder='https://www.linkedin.com/company/your-company' value={profile.linkedinProfile || ''} onChange={handleChange} isRequired={false} />
                <FormField id='twitterProfile' label='URL do Perfil do Twitter (X)' placeholder='https://x.com/yourcompany' value={profile.twitterProfile || ''} onChange={handleChange} isRequired={false} />
            </div>
        </div>
        
        <div className="pt-4 mt-4 border-t border-gray-700">
            <h3 className="text-lg font-medium text-gray-300 mb-4">Estratégia de E-mail Outreach</h3>
            <div>
                <label className="block text-sm font-medium text-blue-300 mb-2">Tipo de Abordagem</label>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {emailApproaches.map(approach => (
                        <div key={approach.id} className="flex items-center">
                            <input id={`approach-${approach.id}`} name="emailApproach" type="radio" value={approach.id} checked={profile.emailApproach === approach.id} onChange={handleApproachChange} className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-500 focus:ring-blue-500" />
                            <label htmlFor={`approach-${approach.id}`} className="ml-2 block text-sm text-gray-300">{approach.label}</label>
                        </div>
                    ))}
                </div>
            </div>
            {profile.emailApproach === 'custom' && (
                <div className="mt-4">
                    <FormField id='customEmailPrompt' label='Modelo de E-mail Personalizado' placeholder='Cole aqui seu modelo de e-mail ou descreva em detalhes o que você quer. Ex: "Comece o e-mail falando sobre a importância da IA e..."' value={profile.customEmailPrompt || ''} onChange={handleChange} isRequired={true} isTextarea={true} />
                </div>
            )}
        </div>


        <div className="pt-2 flex items-center space-x-4">
          <button 
            type="button" 
            onClick={onCancel} 
            className="w-1/3 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center disabled:opacity-75 disabled:scale-100 disabled:cursor-wait"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <SpinnerIcon className="w-5 h-5 mr-3" />
                Saving...
              </>
            ) : (
              'Save Profile'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyProfileForm;
