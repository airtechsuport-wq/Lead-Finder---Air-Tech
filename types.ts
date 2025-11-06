export interface LeadReport {
  companyName: string;
  businessSector: string;
  keyContact: string;
  contactNumber: string;
  companyWebsite: string;
  digitalStatus: string;
  emailContact?: string;
}

export interface Lead {
  report: LeadReport;
  email: string;
}

export interface CompanyProfile {
  sector: string;
  size: string;
  coreSolution: string;
  icp: string;
  channels: string;
  linkedinProfile?: string;
  twitterProfile?: string;
  country: string;
  targetAudience: string;
  emailApproach: 'aggressive' | 'friendly' | 'professional' | 'custom';
  customEmailPrompt?: string;
}

export interface SavedProfile {
  id: string;
  name: string;
  profile: CompanyProfile;
}