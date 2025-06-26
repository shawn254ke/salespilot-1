// Returns the count of leads with a specific status
export function getStatusCount(leads: Lead[], status: LeadStatus): number {
  return leads.filter(lead => lead.status === status).length;
}

// Returns the conversion rate as a percentage (converted/total * 100)
export function getConversionRate(leads: Lead[]): number {
  if (!leads.length) return 0;
  const converted = getStatusCount(leads, 'Converted');
  return (converted / leads.length) * 100;
}

export type LeadStatus = 'New' | 'Contacted' | 'Interested' | 'Converted' | 'Lost';

export type LeadSource = 'Referral' | 'Website' | 'Social Media' | 'Email' | 'Cold Call' | 'Event' | 'Other';

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: LeadStatus;
  createdOn: Date;
  notes: string[];
}
