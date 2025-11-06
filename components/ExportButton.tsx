import React from 'react';
import { Lead } from '../types';

interface ExportButtonProps {
  leads: Lead[];
}

const ExportButton: React.FC<ExportButtonProps> = ({ leads }) => {
  const handleExport = () => {
    if (leads.length === 0) return;

    const titleKeys = [
      "Nome da Empresa",
      "Setor",
      "Contato Chave",
      "Número de Contato",
      "Website da Empresa",
      "Email de Contato",
      "Status Digital",
      "Email Gerado"
    ];

    const escapeCsvValue = (value: string | undefined | null): string => {
      if (value === null || value === undefined) {
        return '""';
      }
      const stringValue = String(value);
      if (/[",\n]/.test(stringValue)) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return `"${stringValue}"`;
    };

    const csvRows = leads.map(lead => {
      const { report, email } = lead;
      const rowData = [
        report.companyName,
        report.businessSector,
        report.keyContact,
        report.contactNumber,
        report.companyWebsite,
        report.emailContact,
        report.digitalStatus,
        email
      ];
      return rowData.map(escapeCsvValue).join(',');
    });

    const csvContent = [titleKeys.join(','), ...csvRows].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "airtech_leads_report.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out flex items-center space-x-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L10 10.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L9 9.586V4a1 1 0 011-1z" clipRule="evenodd" />
      </svg>
      <span>Exportar para CSV</span>
    </button>
  );
};

export default ExportButton;