
export type LeadStatus = 'New' | 'Contacted' | 'Interested' | 'Converted' | 'Lost';

export type LeadSource = 'Referral' | 'Website' | 'Social Media' | 'Email' | 'Cold Call' | 'Event' | 'Other';

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: LeadStatus;
  source: LeadSource;
  createdOn: Date;
  notes: string[];
}
