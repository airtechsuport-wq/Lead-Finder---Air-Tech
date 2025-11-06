import React from 'react';
import { Lead } from '../types';

interface LeadListProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
}

const LeadList: React.FC<LeadListProps> = ({ leads, onSelectLead }) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {leads.map((lead, index) => (
        <div
          key={index}
          onClick={() => onSelectLead(lead)}
          className="bg-gray-900 border border-gray-700 rounded-lg p-5 cursor-pointer transform hover:scale-105 hover:border-blue-500 transition-all duration-300 ease-in-out"
        >
          <h3 className="text-xl font-semibold text-white truncate">{lead.report.companyName}</h3>
          <p className="text-blue-400 text-sm mt-1">{lead.report.businessSector}</p>
          <p className="text-gray-400 text-xs mt-3">Click to view details and email</p>
        </div>
      ))}
    </div>
  );
};

export default LeadList;