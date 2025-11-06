import React, { useState, useEffect } from 'react';
import { Lead } from '../types';

interface LeadDetailModalProps {
  lead: Lead | null;
  onClose: () => void;
}

const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ lead, onClose }) => {
  const [isEmailCopied, setIsEmailCopied] = useState(false);
  const [isTemplateCopied, setIsTemplateCopied] = useState(false);

  useEffect(() => {
    if (!lead) {
      setIsEmailCopied(false);
      setIsTemplateCopied(false);
    }
  }, [lead]);
  
  if (!lead) return null;

  const handleCopyEmail = () => {
    if (lead.report.emailContact) {
      navigator.clipboard.writeText(lead.report.emailContact).then(() => {
        setIsEmailCopied(true);
        setTimeout(() => setIsEmailCopied(false), 2000);
      });
    }
  };

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(lead.email).then(() => {
      setIsTemplateCopied(true);
      setTimeout(() => setIsTemplateCopied(false), 2000);
    });
  };

  const reportData = [
    { label: 'Empresa', value: lead.report.companyName },
    { label: 'Ramo de Atividade', value: lead.report.businessSector },
    { label: 'Contato Chave', value: lead.report.keyContact },
    { label: 'WhatsApp/Contato', value: lead.report.contactNumber },
    { label: 'Website da Empresa', value: lead.report.companyWebsite, isLink: true },
    { label: 'Status Digital', value: lead.report.digitalStatus },
  ];

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        onClick={onClose}
    >
      <div 
        className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-blue-900/20 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-700 sticky top-0 bg-gray-900">
          <h2 className="text-2xl font-bold text-white">{lead.report.companyName}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-4">Relatório de Leads (Métrica)</h3>
            <ul className="space-y-3">
              {reportData.map(item => (
                <li key={item.label}>
                  <p className="text-sm font-medium text-gray-400">{item.label}</p>
                  {item.isLink ? (
                      <a href={`https://${item.value.replace(/^https?:\/\//,'')}`} target="_blank" rel="noopener noreferrer" className="text-base text-blue-400 hover:underline break-all">
                          {item.value}
                      </a>
                  ) : (
                      <p className="text-base text-white break-words">{item.value}</p>
                  )}
                </li>
              ))}
               <li>
                  <p className="text-sm font-medium text-gray-400">Email Contato</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-base text-white break-all">
                      {lead.report.emailContact || <span className="text-gray-500">Não encontrado</span>}
                    </p>
                    {lead.report.emailContact && (
                      <button onClick={handleCopyEmail} className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded-md transition-colors">
                        {isEmailCopied ? 'Copiado!' : 'Copiar'}
                      </button>
                    )}
                  </div>
                </li>
            </ul>
            <div className="mt-4 p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
                <p className="text-xs text-gray-400">
                    <strong>Dica Profissional:</strong> Use o site para encontrar o e-mail de contato geral ou o padrão de e-mail da empresa (ex: nome.sobrenome@site.com).
                </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-4">Escopo de E-mail Gerado pela IA</h3>
            <div className="relative">
                <textarea
                    readOnly
                    value={lead.email}
                    className="w-full h-64 p-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                />
                <button
                    onClick={handleCopyTemplate}
                    className="absolute top-3 right-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1 px-3 rounded-md transition-all duration-200"
                >
                    {isTemplateCopied ? 'Copiado!' : 'Copiar'}
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailModal;